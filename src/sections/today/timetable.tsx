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
} from 'src/redux/apiRequest';

const hours = Array.from({ length: 15 }, (_, i) => `${i + 8}:00`); // 8h -> 22h

export default function Timetable() {
  const accessToken = Cookie.get('accessToken');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
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
    handleGetAppointments();
    handleGetBarbers();
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
      return apt.barber?._id === barberId && hourStart === hour;
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          onClick={() => setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() - 1)))}
        >
          Yesterday
        </Button>
        <Typography variant="h4">Schedule of {format(currentDate, 'dd/MM/yyyy')}</Typography>
        <Button
          onClick={() => setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() + 1)))}
        >
          Tomorrow
        </Button>
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
          gridTemplateColumns: `80px repeat(${barbers.length}, 1fr)`,
          gridTemplateRows: `40px repeat(${hours.length}, 60px)`,
          border: '1px solid #ccc',
        }}
      >
        {/* Header row */}
        <Box sx={{ borderBottom: '1px solid #ccc', bgcolor: '#f0f0f0' }} />
        {barbers.map((barber) => (
          <Box
            key={barber?._id}
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
              src={barber?.user_avatar}
              alt={barber?.user_name}
              style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }}
            />
            {barber?.user_name}
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
                const barberAppointments = getAppointmentsByBarber(barber?._id, hour);

                return (
                  <Box
                    key={`cell-${index}`}
                    sx={{
                      position: 'relative',
                      borderRight: '1px solid #eee',
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    {barberAppointments.map((apt: any) => {
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
            <Button onClick={handleUpdateProof} variant="contained" color="primary">
              Upload proof
            </Button>
          )}
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
