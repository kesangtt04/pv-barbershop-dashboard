/* eslint-disable react/self-closing-comp */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
import { useState, useMemo, useEffect } from 'react';
import Cookie from 'js-cookie';
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  TextField,
} from '@mui/material';
import {
  parseISO,
  format,
  getDay,
  differenceInMinutes,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  createNotification,
  getAllAppointmentsOfBarber,
  updateAppointment,
  updateAppointmentProof,
  uploadImage,
  findReceptionists,
  updateAppointmentStatus,
} from 'src/redux/apiRequest';
import moment from 'moment';
import socket from 'src/hooks/useSocker';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = Array.from({ length: 15 }, (_, i) => `${i + 8}:00`); // 8:00 đến 22:00

export default function Timetable() {
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const currentUser = useSelector((state: any) => state.user.signin.currentUser);
  const [receptionists, setReceptionists] = useState<any>([]);
  const accessToken = Cookie.get('accessToken');
  const userID = Cookie.get('_id');
  const barberName = Cookie.get('user_name');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleClose = () => {
    setOpen(false);
    setImageFile(null);
  };

  const handleGetReceptionist = async () => {
    const data = await findReceptionists(dispatch);
    console.log('Receptionist', data);
    setReceptionists(data.metadata);
  };

  const handleCancel = async (appointment: any) => {
    const data = await updateAppointmentStatus(accessToken, appointment._id, 'canceled', dispatch);
    if (data) {
      for (const r of receptionists) {
        await createNotification(
          accessToken,
          {
            user: r._id,
            title: 'Haircut Canceled!',
            message: `Barber ${barberName} has canceled haircut appointment from ${moment(appointment.appointment_start).format('HH:mm DD/MM/YYYY')} to ${moment(appointment.appointment_end).format('HH:mm DD/MM/YYYY')} with customer ${appointment.customer_name}, please contact with them!`,
            data: appointment,
            is_read: false,
          },
          dispatch
        );
      }
      handleGetAllSchedule();
      handleClose();
    }
  };

  const handleUpdateProof = async (appointment: any) => {
    let imageUrl = '';
    try {
      if (imageFile) {
        const imageData = await uploadImage(imageFile, 'schedules', dispatch);
        imageUrl = imageData.img_url;
      }

      const res = await updateAppointmentProof(
        accessToken,
        selectedAppointment._id,
        imageUrl,
        dispatch
      );
      if (res) {
        for (const r of receptionists) {
          await createNotification(
            accessToken,
            {
              user: r._id,
              title: 'Haircut Complete',
              message: `Barber ${barberName} has completed haircut appointment from ${moment(appointment.appointment_start).format('HH:mm DD/MM/YYYY')} to ${moment(appointment.appointment_end).format('HH:mm DD/MM/YYYY')}`,
              data: res,
              is_read: false,
            },
            dispatch
          );
        }
        await handleGetAllSchedule();
        handleClose();
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1)); // Chuyển sang tuần trước
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1)); // Chuyển sang tuần sau
  };

  // Lấy các ngày trong tuần dựa trên tuần hiện tại
  const weekDays = days.map((day, index) => {
    const startOfWeekDate = new Date(currentWeek);
    startOfWeekDate.setDate(startOfWeekDate.getDate() - startOfWeekDate.getDay() + (index + 1));
    return format(startOfWeekDate, 'dd/MM/yyyy');
  });

  // Lọc các cuộc hẹn cho tuần hiện tại
  const getAppointmentsForCurrentWeek = (weekStartDate: Date) => {
    const startOfThisWeek = startOfWeek(weekStartDate, { weekStartsOn: 1 });
    const endOfThisWeek = endOfWeek(weekStartDate, { weekStartsOn: 1 });

    return schedules.filter((apt: any) => {
      const appointmentStart = parseISO(apt.appointment_start);
      return appointmentStart >= startOfThisWeek && appointmentStart <= endOfThisWeek;
    });
  };

  const filteredAppointments = useMemo(
    () => getAppointmentsForCurrentWeek(currentWeek),
    [schedules, currentWeek]
  );

  const handleGetAllSchedule = async () => {
    const data = await getAllAppointmentsOfBarber(userID, dispatch);
    console.log('data', data);
    setSchedules(data.metadata);
  };

  useEffect(() => {
    handleGetReceptionist();
    handleGetAllSchedule();
  }, []);

  useEffect(() => {
    socket.emit('join_room', userID);

    socket.on('new_notification', (newNotification: any) => {
      handleGetAllSchedule();
    });

    return () => {
      socket.off('new_notification');
    };
  }, []);

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

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button onClick={handlePreviousWeek}>Previous week</Button>
        <Typography variant="h4">
          Weekly schedule from {format(currentWeek, 'dd/MM/yyyy')} to{' '}
          {format(addWeeks(currentWeek, 1), 'dd/MM/yyyy')}
        </Typography>
        <Button onClick={handleNextWeek}>Following week</Button>
      </Box>
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
          gridTemplateColumns: '80px repeat(7, 1fr)', // 1 cột giờ + 7 cột thứ
          gridTemplateRows: '40px repeat(15, 60px)', // 1 hàng header + 15 hàng giờ
          border: '1px solid #ccc',
        }}
      >
        <Box
          sx={{ borderRight: '1px solid #ccc', borderBottom: '1px solid #ccc', bgcolor: '#f0f0f0' }}
        />

        {weekDays.map((day, index) => (
          <Box
            key={`header-${day}`}
            sx={{
              borderRight: '1px solid #ccc',
              borderBottom: '1px solid #ccc',
              textAlign: 'center',
              fontSize: 12,
              bgcolor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {days[index]}
            <br />({day})
          </Box>
        ))}

        {hours.map((hourLabel, hourIndex) => {
          const startHour = 8 + hourIndex;

          return [
            <Box
              key={`hour-${hourLabel}`}
              sx={{
                borderRight: '1px solid #ccc',
                borderBottom: '1px solid #ccc',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f9f9f9',
              }}
            >
              {hourLabel}
            </Box>,

            ...weekDays.map((_, dayIndex) => (
              <Box
                key={`cell-${hourLabel}-${dayIndex}`}
                sx={{
                  position: 'relative',
                  borderRight: '1px solid #eee',
                  borderBottom: '1px solid #eee',
                }}
              >
                {filteredAppointments.map((apt: any) => {
                  const start = parseISO(apt.appointment_start);
                  const end = parseISO(apt.appointment_end);
                  const aptDay = getDay(start); // Sunday = 0
                  const displayDay = aptDay === 0 ? 6 : aptDay - 1; // shift: Monday = 0

                  if (displayDay !== dayIndex) return null;

                  const startDecimal = start.getHours() + start.getMinutes() / 60;
                  const duration = differenceInMinutes(end, start);
                  const durationInHours = duration / 60;

                  if (Math.abs(startDecimal - startHour) < 0.01) {
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
                            if (
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
            )),
          ];
        })}
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Schedule detail</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            <strong>Name:</strong> {selectedAppointment?.customer_name}
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
              onClick={() => handleUpdateProof(selectedAppointment)}
              variant="contained"
              color="primary"
              disabled={!imageFile}
            >
              Upload proof
            </Button>
          )}
          {selectedAppointment?.status !== 'completed' && (
            <Button
              onClick={() => handleCancel(selectedAppointment)}
              variant="contained"
              color="error"
              disabled={new Date(selectedAppointment?.appointment_end) < new Date()}
            >
              Cancel
            </Button>
          )}
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
