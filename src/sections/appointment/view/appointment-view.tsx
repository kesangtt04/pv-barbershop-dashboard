/* eslint-disable perfectionist/sort-imports */
import { useState, useCallback, useEffect } from 'react';
import moment from 'moment';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  TableRow,
  TableCell,
  TableHead,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';
import {
  deleteAppointment,
  findAllFreeBarber,
  getAllAppointments,
  updateAppointment,
  updateAppointmentStatus,
} from 'src/redux/apiRequest';

export function AppointmentView() {
  const currentUser = useSelector((state: any) => state.user.signin.currentUser);
  const accessToken = Cookie.get('accessToken');
  const userID = Cookie.get('_id');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const table = useTable();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);
  const [appointmentToUpdate, setAppointmentToUpdate] = useState<any>(null);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [openAssignBarberForm, setAssignBarberForm] = useState(false);

  const handleGetFreeBarber = async (startTime = '', endTime = '') => {
    const data = await findAllFreeBarber('', startTime, endTime, dispatch);
    setBarbers(data.metadata);
  };

  const handleDelete = async (appointment: any) => {
    await deleteAppointment(accessToken, appointment._id, dispatch);
    await handleGetAllAppointment();
  };

  const handleAccept = async (appointment: any) => {
    if (appointment.barber) {
      await updateAppointmentStatus(accessToken, appointment._id, 'confirmed', dispatch);
      handleGetAllAppointment();
    } else {
      await handleGetFreeBarber(appointment.appointment_start, appointment.appointment_end);
      setAppointmentToUpdate(appointment._id);
      setAssignBarberForm(true);
    }
  };

  const handleComplete = async (appointment: any) => {
    await updateAppointmentStatus(accessToken, appointment._id, 'completed', dispatch);
    handleGetAllAppointment();
    window.open(`/payment/${appointment._id}`);
  };

  const handleGetAllAppointment = async () => {
    const data = await getAllAppointments(dispatch);
    console.log('data', data.metadata);
    setAppointments(data.metadata);
  };

  const handleCloseAssignBarberForm = () => {
    setAssignBarberForm(false);
  };

  const handleAssignBarber = async () => {
    if (appointmentToUpdate && selectedBarber) {
      const updatedAppointment = {
        _id: appointmentToUpdate,
        barber: selectedBarber,
      };

      await updateAppointment(accessToken, updatedAppointment, dispatch);
      await updateAppointmentStatus(accessToken, updatedAppointment._id, 'confirmed', dispatch);
      await handleGetAllAppointment();
      handleCloseAssignBarberForm();
    }
  };

  const handleOpenForm = () => {
    window.open(`${import.meta.env.VITE_USER_BASE_URL}booking`);
  };

  const handleOpenEditForm = (appointment: any) => {
    window.location.href = `${import.meta.env.VITE_USER_BASE_URL}update-appointment/${appointment._id}`;
  };

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState<any>(null);

  const handleAskDelete = (inventory: any) => {
    setInventoryToDelete(inventory);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!inventoryToDelete) return;

    try {
      await handleDelete(inventoryToDelete);
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setConfirmDeleteOpen(false);
      setInventoryToDelete(null);
    }
  };

  useEffect(() => {
    handleGetAllAppointment();
  }, []);

  return (
    <DashboardContent>
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
            {barbers.map((barber) => (
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

      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Appointments
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenForm}
        >
          New appointment
        </Button>
      </Box>

      {/* Table for displaying appointments */}
      <Card>
        <Scrollbar>
          <TableContainer sx={{ display: 'flex', justifyContent: 'center' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Customer Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Barber</b>
                  </TableCell>
                  <TableCell>
                    <b>Telephone</b>
                  </TableCell>
                  <TableCell>
                    <b>Start</b>
                  </TableCell>
                  <TableCell>
                    <b>End</b>
                  </TableCell>
                  <TableCell>
                    <b>Service</b>
                  </TableCell>
                  <TableCell>
                    <b>Note</b>
                  </TableCell>
                  <TableCell>
                    <b>Proof</b>
                  </TableCell>
                  <TableCell>
                    <b>Status</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments
                  ?.slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  ?.map((appointment, index) => (
                    <TableRow key={appointment?._id}>
                      <TableCell>{appointment?.customer_name}</TableCell>
                      <TableCell>
                        {appointment?.barber ? (
                          <Card
                            key={appointment?.barber._id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                              minWidth: '100px',
                              borderRadius: '16px',
                              padding: '0 8px',
                            }}
                          >
                            <img
                              src={appointment?.barber.user_avatar}
                              alt={appointment?.barber.user_name}
                              width="40"
                              height="40"
                              style={{ borderRadius: '50%', marginRight: '10px' }}
                            />
                            <Typography>{appointment?.barber.user_name}</Typography>
                          </Card>
                        ) : (
                          ''
                        )}
                      </TableCell>

                      <TableCell>{appointment?.phone_number}</TableCell>
                      <TableCell>
                        {moment(appointment?.appointment_start).format('DD-MM-YYYY HH:mm')}
                      </TableCell>
                      <TableCell>
                        {moment(appointment?.appointment_end).format('DD-MM-YYYY HH:mm')}
                      </TableCell>
                      <TableCell>
                        {appointment?.service?.map((service: any) => (
                          <div key={service._id}>
                            <Typography>{service?.service_name}</Typography>
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>{appointment?.notes}</TableCell>
                      <TableCell>
                        <img
                          src={appointment?.complete_picture}
                          alt={appointment?.complete_picture}
                          width="50"
                          height="50"
                          style={{ borderRadius: '4px' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color:
                              appointment?.status === 'pending'
                                ? 'orange'
                                : appointment?.status === 'confirmed'
                                  ? 'blue'
                                  : appointment?.status === 'completed'
                                    ? 'green'
                                    : appointment?.status === 'canceled'
                                      ? 'red'
                                      : 'black',
                            fontWeight: 'bold',
                            textTransform: 'capitalize',
                            fontSize: '14px',
                          }}
                        >
                          {appointment?.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          sx={{ minWidth: '82px', marginTop: '4px' }}
                          variant="contained"
                          color="warning"
                          onClick={() => handleOpenEditForm(appointment)}
                        >
                          Edit
                        </Button>
                        <Button
                          sx={{ minWidth: '82px', marginTop: '4px' }}
                          variant="contained"
                          color="secondary"
                          onClick={() => handleAccept(appointment)}
                          disabled={
                            appointment.status === 'confirmed' ||
                            appointment.status === 'completed' ||
                            appointment.status === 'canceled' ||
                            new Date(appointment.appointment_end) < new Date()
                          }
                        >
                          Accept
                        </Button>

                        <Button
                          sx={{ minWidth: '82px', marginTop: '4px' }}
                          variant="contained"
                          color="success"
                          onClick={() => handleComplete(appointment)}
                          disabled={
                            appointment.status === 'completed' || !appointment.complete_picture
                          }
                        >
                          Done
                        </Button>
                        <Button
                          sx={{ minWidth: '82px', marginTop: '4px' }}
                          variant="contained"
                          color="error"
                          onClick={() => handleAskDelete(appointment)}
                          disabled={appointment.status === 'completed' ? true : false}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={appointments.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
