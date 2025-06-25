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
  getAllAppointments,
  getAllAppointmentsOfBarber,
  getAppointment,
  updateAppointment,
  updateAppointmentProof,
  uploadImage,
} from 'src/redux/apiRequest';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = Array.from({ length: 15 }, (_, i) => `${i + 8}:00`); // 8:00 đến 22:00

export default function Timetable() {
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentUser = useSelector((state: any) => state.user.signin.currentUser);
  const accessToken = Cookie.get('accessToken');
  const userID = Cookie.get('_id');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleClose = () => {
    setOpen(false);
    setImageFile(null);
  };

  const handleUpdateProof = async () => {
    let imageUrl = '';
    try {
      if (imageFile) {
        const imageData = await uploadImage(imageFile, 'schedules', dispatch);
        imageUrl = imageData.img_url;
      }

      await updateAppointmentProof(accessToken, selectedAppointment._id, imageUrl, dispatch);

      await handleGetAllSchedule();
      handleClose();
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const handlePreviousDay = () => {
    setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
  };

  const handleNextDay = () => {
    setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() + 1)));
  };

  const weekDays = days.map((_, index) => {
    const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    const dayDate = new Date(startOfWeekDate);
    dayDate.setDate(dayDate.getDate() + index);
    return format(dayDate, 'dd/MM/yyyy');
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
    () => getAppointmentsForCurrentWeek(currentDate),
    [schedules, currentDate]
  );

  const handleGetAllSchedule = async () => {
    const data = await getAllAppointments(dispatch);
    console.log('data', data);
    setSchedules(data.metadata);
  };

  useEffect(() => {
    handleGetAllSchedule();
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

  const todayIndex = (currentDate.getDay() + 6) % 7;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button onClick={handlePreviousDay}>Yesterday</Button>
        <Typography variant="h4">
          Daily schedule from {format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'dd/MM/yyyy')}{' '}
          to {format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'dd/MM/yyyy')}
        </Typography>
        <Button onClick={handleNextDay}>Tomorrow</Button>
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
          gridTemplateColumns: '80px 1fr', // 1 cột giờ + 1 cột thứ
          gridTemplateRows: '40px repeat(15, 60px)', // 1 hàng header + 15 hàng giờ
          border: '1px solid #ccc',
        }}
      >
        <Box
          sx={{ borderRight: '1px solid #ccc', borderBottom: '1px solid #ccc', bgcolor: '#f0f0f0' }}
        />

        {weekDays.map((day, index) => {
          if (index !== todayIndex) return null;

          return (
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
          );
        })}

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

            ...weekDays.map((_, dayIndex) => {
              if (dayIndex !== todayIndex) return null;
              return (
                <Box
                  key={`cell-${hourLabel}-${dayIndex}`}
                  sx={{
                    position: 'relative',
                    borderRight: '1px solid #eee',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {filteredAppointments
                    .filter((apt: any) => {
                      const start = parseISO(apt.appointment_start);
                      const aptDay = getDay(start) === 0 ? 6 : getDay(start) - 1;

                      if (aptDay !== dayIndex) return false;

                      const startHourDecimal = start.getHours() + start.getMinutes() / 60;

                      return startHourDecimal >= startHour && startHourDecimal < startHour + 1;
                    })

                    .map((apt: any, index: number, arr: any[]) => {
                      const start = parseISO(apt.appointment_start);
                      const end = parseISO(apt.appointment_end);
                      const duration = differenceInMinutes(end, start);
                      const durationInHours = duration / 60;

                      return (
                        <Paper
                          key={apt._id}
                          sx={{
                            position: 'absolute',
                            top: 2,
                            left: `${(index / arr.length) * 100}%`,
                            width: `${100 / arr.length}%`,
                            height: `calc(${durationInHours * 100}% + ${(durationInHours - 1) * 1}px)`,
                            bgcolor:
                              apt.status === 'completed'
                                ? 'green'
                                : apt.complete_picture
                                  ? '#b76e00'
                                  : '#90caf9',
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
                          <Card
                            key={apt.barber._id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                              backgroundColor: 'transparent',
                            }}
                          >
                            <Typography
                              sx={{ fontSize: '12px', fontWeight: 'bold', marginRight: '4px' }}
                            >
                              Barber:
                            </Typography>
                            <img
                              src={apt.barber.user_avatar}
                              alt={apt.barber.user_name}
                              width="20"
                              height="20"
                              style={{ borderRadius: '50%', marginRight: '4px' }}
                            />
                            <Typography sx={{ fontSize: '12px' }}>
                              {apt.barber.user_name}
                            </Typography>
                          </Card>
                        </Paper>
                      );
                    })}
                </Box>
              );
            }),
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
            <Button onClick={handleUpdateProof} variant="contained" color="primary">
              Upload proof
            </Button>
          )}
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
