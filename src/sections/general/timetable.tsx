/* eslint-disable react/self-closing-comp */
/* eslint-disable arrow-body-style */
/* eslint-disable perfectionist/sort-imports */
import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  DialogActions,
  TextField,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { parseISO, format, getHours, differenceInMinutes } from 'date-fns';
import Cookie from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllAppointments,
  findAllBarber,
  updateAppointmentProof,
  uploadImage,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  findAllFreeBarber,
  createNotification,
} from 'src/redux/apiRequest';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment';
import socket from 'src/hooks/useSocker';

const hours = Array.from({ length: 15 }, (_, i) => `${i + 8}:00`); // 8h -> 22h

export default function Timetable() {
  const accessToken = Cookie.get('accessToken');
  const receptionistName = Cookie.get('user_name');
  const userID = Cookie.get('_id');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [freeBarbers, setFreeBarbers] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const dispatch = useDispatch();
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleGetAppointments = async () => {
    const res = await getAllAppointments(dispatch);
    setAppointments(res.metadata || []);
  };

  const handleGetBarbers = async () => {
    const res = await findAllBarber(dispatch);
    setBarbers(res.metadata || []);
  };

  useEffect(() => {
    const fetchData = async () => {
      const resApt = await getAllAppointments(dispatch);
      const appointmentsData = resApt.metadata || [];

      const resBarber = await findAllBarber(dispatch);
      let barbersData = resBarber.metadata || [];

      const hasUnassigned = appointmentsData.some((apt: any) => !apt.barber || !apt.barber._id);
      if (hasUnassigned) {
        barbersData = [
          ...barbersData,
          {
            _id: 'unassigned',
            user_name: 'Unassigned',
            user_avatar: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
          },
        ];
      }

      setAppointments(appointmentsData);
      setBarbers(barbersData);
    };

    fetchData();
  }, []);

  const handleClose = () => {
    setOpen(false);
    setImageFile(null);
  };

  const todayAppointments = useMemo(() => {
    return appointments.filter((apt: any) => {
      const aptDate = parseISO(apt.appointment_start);
      return aptDate.toDateString() === currentDate.toDateString();
    });
  }, [appointments, currentDate]);

  const getAppointmentsByBarber = (barberId: string, hour: number) => {
    return todayAppointments.filter((apt) => {
      const start = parseISO(apt.appointment_start);
      const hourStart = start.getHours();
      const currentBarberId = apt.barber?._id || 'unassigned';
      return currentBarberId === barberId && hourStart === hour;
    });
  };

  const handleUpdateProof = async () => {
    let imageUrl = '';
    try {
      if (imageFile) {
        const imageData = await uploadImage(imageFile, 'schedules', dispatch);
        imageUrl = imageData.img_url;
      }

      await updateAppointmentProof(accessToken, selectedAppointment._id, imageUrl, dispatch);

      await handleGetAppointments();
      handleClose();
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const NOTE = [
    {
      boxColor: 'green',
      noteText: 'Completed',
    },
    {
      boxColor: '#b76e00',
      noteText: 'Waiting for receptionist confirmation',
    },
    {
      boxColor: '#90caf9',
      noteText: 'Not yet completed',
    },
  ];

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState<any>(null);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);
  const [appointmentToUpdate, setAppointmentToUpdate] = useState<any>(null);
  const [openAssignBarberForm, setAssignBarberForm] = useState(false);

  const handleAskDelete = (inventory: any) => {
    setInventoryToDelete(inventory);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!inventoryToDelete) return;

    try {
      await handleDelete(inventoryToDelete);
      handleClose();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setConfirmDeleteOpen(false);
      setInventoryToDelete(null);
    }
  };

  const handleGetFreeBarber = async (startTime = '', endTime = '') => {
    const data = await findAllFreeBarber('', startTime, endTime, dispatch);
    setFreeBarbers(data.metadata);
  };

  const handleDelete = async (appointment: any) => {
    await deleteAppointment(accessToken, appointment._id, dispatch);
    await handleGetAppointments();
  };

  const handleAccept = async (appointment: any) => {
    if (appointment.barber) {
      await updateAppointmentStatus(accessToken, appointment._id, 'confirmed', dispatch);
      await createNotification(
        accessToken,
        {
          user: appointment.barber._id,
          title: 'New Schedule',
          message: `You will have an appointment with customer ${appointment.customer_name} from ${moment(appointment.appointment_start).format('HH:mm DD/MM/YYYY')} to ${moment(appointment.appointment_end).format('HH:mm DD/MM/YYYY')}`,
          data: appointment,
          is_read: false,
        },
        dispatch
      );
      if (appointment?.customer) {
        await createNotification(
          accessToken,
          {
            user: appointment?.customer._id,
            title: 'Your Schedule',
            message: `Dear Customer ${appointment.customer_name}, you will have an appointment from ${moment(appointment.appointment_start).format('HH:mm DD/MM/YYYY')} to ${moment(appointment.appointment_end).format('HH:mm DD/MM/YYYY')} with barber ${appointment.barber.user_name}`,
            data: appointment,
            is_read: false,
          },
          dispatch
        );
      }
      await handleGetAppointments();
      handleClose();
    } else {
      await handleGetFreeBarber(appointment.appointment_start, appointment.appointment_end);
      setAppointmentToUpdate(appointment);
      setAssignBarberForm(true);
    }
  };

  const handleComplete = async (appointment: any) => {
    await updateAppointmentStatus(accessToken, appointment._id, 'completed', dispatch);
    await createNotification(
      accessToken,
      {
        user: appointment.barber._id,
        title: 'Appointment Confirmed as Completed',
        message: `Receptionist ${receptionistName} has confirmed that you have completed the haircut appointment from ${moment(appointment.appointment_start).format('HH:mm DD/MM/YYYY')} to ${moment(appointment.appointment_end).format('HH:mm DD/MM/YYYY')}.`,
        data: appointment,
        is_read: false,
      },
      dispatch
    );

    await handleGetAppointments();
    window.open(`/payment/${appointment._id}`);
  };

  const handleCloseAssignBarberForm = () => {
    setAssignBarberForm(false);
  };

  const handleAssignBarber = async () => {
    if (appointmentToUpdate && selectedBarber) {
      const updatedAppointment = {
        _id: appointmentToUpdate._id,
        barber: selectedBarber,
      };

      await updateAppointment(accessToken, updatedAppointment, dispatch);
      await updateAppointmentStatus(accessToken, updatedAppointment._id, 'confirmed', dispatch);
      await createNotification(
        accessToken,
        {
          user: selectedBarber._id,
          title: 'New Schedule',
          message: `Customer ${appointmentToUpdate.customer_name} has booked an appointment from ${moment(appointmentToUpdate.appointment_start).format('HH:mm DD/MM/YYYY')} to ${moment(appointmentToUpdate.appointment_end).format('HH:mm DD/MM/YYYY')}`,
          data: { appointmentToUpdate, barber: selectedBarber },
          is_read: false,
        },
        dispatch
      );
      if (appointmentToUpdate?.customer) {
        await createNotification(
          accessToken,
          {
            user: appointmentToUpdate?.customer._id,
            title: 'Your Schedule',
            message: `Dear Customer ${appointmentToUpdate.customer_name}, you will have an appointment from ${moment(appointmentToUpdate.appointment_start).format('HH:mm DD/MM/YYYY')} to ${moment(appointmentToUpdate.appointment_end).format('HH:mm DD/MM/YYYY')} with barber ${selectedBarber?.user_name}`,
            data: { appointmentToUpdate, barber: selectedBarber },
            is_read: false,
          },
          dispatch
        );
      }
      await handleGetAppointments();
      handleCloseAssignBarberForm();
      handleClose();
    }
  };

  const handleOpenEditForm = (appointment: any) => {
    window.location.href = `${import.meta.env.VITE_USER_BASE_URL}update-appointment/${appointment._id}`;
  };

  useEffect(() => {
    socket.emit('join_room', userID);

    socket.on('new_notification', (newNotification: any) => {
      handleGetAppointments();
    });

    return () => {
      socket.off('new_notification');
    };
  }, []);

  return (
    <Box>
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this appointment?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAssignBarberForm} onClose={handleCloseAssignBarberForm}>
        <DialogTitle>Assign Barber</DialogTitle>
        <DialogContent>
          <Typography>Select a barber to assign to the appointment</Typography>
          <Box sx={{ mt: 2 }}>
            {freeBarbers.map((barber) => (
              <Card key={barber._id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img
                  src={barber.user_avatar}
                  alt={barber.user_name}
                  width="40"
                  height="40"
                  style={{ borderRadius: '50%', marginRight: '10px' }}
                />
                <Typography>{barber.user_name}</Typography>
                <Button
                  sx={{ marginLeft: 'auto' }}
                  variant="outlined"
                  onClick={() => setSelectedBarber(barber)}
                >
                  {selectedBarber?._id === barber._id ? 'Selected' : 'Select'}
                </Button>
              </Card>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ marginRight: '16px' }}>
          <Button onClick={handleCloseAssignBarberForm}>Cancel</Button>
          <Button onClick={handleAssignBarber} variant="contained" color="primary">
            Assign
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button
          onClick={() => setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() - 1)))}
        >
          Yesterday
        </Button>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Choose a day"
            value={currentDate}
            onChange={(newValue) => {
              if (newValue) setCurrentDate(newValue);
            }}
            slotProps={{ textField: { size: 'small' } }}
            sx={{
              minWidth: '600px',
            }}
          />
        </LocalizationProvider>

        <Button
          onClick={() => setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() + 1)))}
        >
          Tomorrow
        </Button>
      </Box>

      <Typography variant="h4" align="center" sx={{ mb: 2 }}>
        Schedule of {format(currentDate, 'dd/MM/yyyy')}
      </Typography>

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'right', mb: 2, mr: 4 }}>
        {NOTE.map((note, index) => (
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '12px' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: note.boxColor }}></div>
            <Typography
              key={index}
              variant="caption"
              sx={{ fontSize: '0.75rem', color: note.boxColor, marginLeft: '4px' }}
            >
              {note.noteText}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `80px repeat(${barbers.length}, 1fr)`,
          gridTemplateRows: `40px repeat(${hours.length}, 60px)`,
          border: '1px solid #ccc',
        }}
      >
        {/* Header row */}
        <Box sx={{ borderBottom: '1px solid #ccc', bgcolor: '#f0f0f0' }} />
        {barbers.map((barber) => (
          <Box
            key={barber._id}
            sx={{
              borderLeft: '1px solid #ccc',
              borderBottom: '1px solid #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#f0f0f0',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              textAlign: 'center',
              p: 1,
            }}
          >
            <img
              src={barber.user_avatar}
              alt={barber.user_name}
              style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }}
            />
            {barber.user_name}
          </Box>
        ))}

        {hours.map((label, i) => {
          const hour = 8 + i;

          return (
            <>
              {/* Time label column */}
              <Box
                key={`time-${label}`}
                sx={{
                  borderTop: '1px solid #ccc',
                  borderRight: '1px solid #ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#f9f9f9',
                  fontSize: '0.85rem',
                }}
              >
                {label}
              </Box>

              {barbers.map((barber, index) => {
                const barberAppointments = getAppointmentsByBarber(barber._id, hour);

                return (
                  <Box
                    key={`cell-${index}`}
                    sx={{
                      position: 'relative',
                      borderRight: '1px solid #eee',
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    {barberAppointments?.map((apt: any) => {
                      const start = parseISO(apt.appointment_start);
                      const end = parseISO(apt.appointment_end);

                      const startDecimal = start.getHours() + start.getMinutes() / 60;
                      const duration = differenceInMinutes(end, start);
                      const durationInHours = duration / 60;

                      if (Math.abs(startDecimal - hour) < 0.01) {
                        return (
                          <Paper
                            key={apt._id}
                            sx={{
                              position: 'absolute',
                              top: 2,
                              left: 2,
                              right: 2,
                              height: `calc(${durationInHours * 100}% + ${(durationInHours - 1) * 1}px)`,
                              bgcolor: (() => {
                                const isPast = new Date(apt.appointment_end) < new Date();
                                if (apt.status === 'pending') {
                                  return '#90caf9';
                                } else if (
                                  apt.status === 'canceled' ||
                                  (isPast && apt.status !== 'completed' && !apt.complete_picture)
                                ) {
                                  return 'red';
                                } else if (apt.status === 'completed') {
                                  return 'green';
                                } else if (apt.complete_picture) {
                                  return '#b76e00';
                                } else {
                                  return '#90caf9';
                                }
                              })(),
                              zIndex: 1,
                              padding: '2px',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setOpen(true);
                            }}
                          >
                            <Typography variant="caption" fontWeight="bold">
                              {apt.customer_name || 'Khách lẻ'}
                            </Typography>
                            <br />
                            <Typography variant="caption">
                              {format(start, 'HH:mm')} - {format(end, 'HH:mm')}
                            </Typography>
                          </Paper>
                        );
                      }

                      return null;
                    })}
                  </Box>
                );
              })}
            </>
          );
        })}
      </Box>
      {/* Detail form */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Schedule detail</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            <strong>Name:</strong> {selectedAppointment?.customer_name}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Phone:</strong> {selectedAppointment?.phone_number}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Time:</strong>{' '}
            {new Date(selectedAppointment?.appointment_start).toLocaleString()} -{' '}
            {new Date(selectedAppointment?.appointment_end).toLocaleString()}
          </Typography>

          <Typography variant="body2" gutterBottom>
            <strong>Service:</strong>{' '}
            {selectedAppointment?.service.map((s: any) => (
              <Card key={s._id} sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 1, px: 1 }}>
                <img
                  src={s.service_image}
                  alt={s._id}
                  width="40"
                  height="40"
                  style={{ borderRadius: '50%', marginRight: '10px' }}
                />
                <p style={{ marginRight: '10px' }}>{s.service_name}</p>
                <p style={{ marginLeft: 'auto' }}>{s.service_price} VNĐ</p>
              </Card>
            ))}
            <div>
              <strong>Total:</strong>{' '}
              {selectedAppointment?.service.reduce(
                (total: number, s: any) => total + s.service_price,
                0
              )}{' '}
              VNĐ
            </div>
          </Typography>

          <Typography variant="body2" gutterBottom>
            <strong>Note:</strong> {selectedAppointment?.notes || 'Không có'}
          </Typography>

          <Typography variant="body2" gutterBottom>
            <strong>Status:</strong> {selectedAppointment?.status || 'Không có'}
          </Typography>

          {(selectedAppointment?.complete_picture || imageFile) && (
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <img
                src={
                  imageFile ? URL.createObjectURL(imageFile) : selectedAppointment?.complete_picture
                }
                alt="Appointment"
                width="100"
                height="100"
                style={{ borderRadius: '8px' }}
              />
            </Box>
          )}

          {selectedAppointment?.status !== 'completed' && (
            <TextField
              sx={{ marginTop: '12px' }}
              type="file"
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: 'image/*' }}
              onChange={(e) => {
                const fileInput = e.target as HTMLInputElement;
                if (fileInput.files && fileInput.files[0]) {
                  setImageFile(fileInput.files[0]);
                }
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          {selectedAppointment?.status !== 'completed' && (
            <Button
              onClick={handleUpdateProof}
              variant="contained"
              color="primary"
              disabled={selectedAppointment?.status !== 'confirmed'}
            >
              Upload proof
            </Button>
          )}
          <Button
            sx={{ minWidth: '82px', marginTop: '4px' }}
            variant="contained"
            color="warning"
            onClick={() => handleOpenEditForm(selectedAppointment)}
            disabled={selectedAppointment?.status === 'completed' ? true : false}
          >
            Edit
          </Button>
          <Button
            sx={{ minWidth: '82px', marginTop: '4px' }}
            variant="contained"
            color="secondary"
            onClick={() => handleAccept(selectedAppointment)}
            disabled={
              selectedAppointment?.status === 'confirmed' ||
              selectedAppointment?.status === 'completed'
            }
          >
            Accept
          </Button>

          <Button
            sx={{ minWidth: '82px', marginTop: '4px' }}
            variant="contained"
            color="success"
            onClick={() => handleComplete(selectedAppointment)}
            disabled={
              selectedAppointment?.status === 'completed' || !selectedAppointment?.complete_picture
            }
          >
            Done
          </Button>
          <Button
            sx={{ minWidth: '82px', marginTop: '4px' }}
            variant="contained"
            color="error"
            onClick={() => handleAskDelete(selectedAppointment)}
            disabled={selectedAppointment?.status === 'completed' ? true : false}
          >
            Delete
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
