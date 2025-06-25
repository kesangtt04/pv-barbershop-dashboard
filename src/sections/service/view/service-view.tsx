/* eslint-disable perfectionist/sort-imports */
import { useState, useCallback, useEffect } from 'react';

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
import axios from 'axios';
import {
  createService,
  deleteService,
  getAllServices,
  updateService,
  uploadImage,
} from 'src/redux/apiRequest';
import { toast } from 'react-toastify';

export function ServiceView() {
  const currentUser = useSelector((state: any) => state.user.signin.currentUser);
  const accessToken = Cookie.get('accessToken');
  const userID = Cookie.get('_id');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const table = useTable();
  const [services, setServices] = useState<any[]>([]);
  const [openCreateForm, setCreateOpenForm] = useState(false);
  const [openEditForm, setEditOpenForm] = useState(false);
  const [search, setSearch] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [newService, setNewService] = useState({
    service_name: '',
    service_price: '',
    service_duration: '',
    service_description: '',
    service_image: '',
  });
  const [editService, setEditService] = useState({
    service_id: '',
    service_name: '',
    service_price: '',
    service_duration: '',
    service_description: '',
    service_image: '',
  });

  const handleOpenForm = () => setCreateOpenForm(true);
  const handleCloseForm = () => setCreateOpenForm(false);
  const handleOpenEditForm = (service: any) => {
    setEditService({
      service_id: service?._id,
      service_name: service?.service_name,
      service_price: service?.service_price,
      service_duration: service?.service_duration,
      service_description: service?.service_description,
      service_image: service?.service_image,
    });
    setEditOpenForm(true);
  };
  const handleCloseEditForm = () => setEditOpenForm(false);

  const handleSubmit = async () => {
    if (Number(newService.service_price) <= 0 || Number(newService.service_duration) <= 0) {
      toast.error('Duration and price must be greater than 0');
      return;
    }
    let imageUrl = '';
    try {
      if (imageFile) {
        const imageData = await uploadImage(imageFile, 'services', dispatch);
        imageUrl = imageData.img_url;
        setNewService((prevState) => ({
          ...prevState,
          service_image: imageData.img_url,
        }));
      }

      const response = await createService(
        accessToken,
        { ...newService, service_image: imageUrl },
        dispatch,
        navigate,
        axios
      );
      const createdService = response.metadata;

      setServices([
        ...services,
        {
          service_name: createdService.service_name,
          service_price: createdService.service_price,
          service_duration: createdService.service_duration,
          service_description: createdService.service_description,
          service_image: createdService.service_image,
        },
      ]);
      handleGetAllService();
      setCreateOpenForm(false);
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (Number(editService.service_price) <= 0 || Number(editService.service_duration) <= 0) {
      toast.error('Duration and price must be greater than 0');
      return;
    }
    let imageUrl = editService.service_image;

    try {
      if (editImageFile) {
        const imageData = await uploadImage(editImageFile, 'services', dispatch);
        imageUrl = imageData.img_url;
        setEditService((prevState) => ({
          ...prevState,
          service_image: imageUrl,
        }));
      }

      await updateService(
        accessToken,
        { ...editService, service_image: imageUrl },
        dispatch,
        navigate,
        axios
      );

      await handleGetAllService();

      setEditOpenForm(false);
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleDelete = async (service: any) => {
    console.log('serviceid', service._id);
    setServices((prevServices) =>
      prevServices.filter(
        (s: any) =>
          service.service_name !== s.service_name && s.service_price !== service.service_price
      )
    );

    try {
      deleteService(accessToken, service._id, dispatch, axios);
    } catch (error) {
      console.error('Error deleting service:', error);
      handleGetAllService();
    }
  };

  const handleGetAllService = async () => {
    const data = await getAllServices(dispatch);
    console.log('data', data);
    setServices(data);
  };

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState<any>(null);

  const handleAskDelete = (service: any) => {
    setInventoryToDelete(service);
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
    handleGetAllService();
  }, []);

  const filteredData = services.filter((d) => d.service_name.toLowerCase().includes(search));

  return (
    <DashboardContent>
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this service?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Modal for adding new service */}
      <Dialog open={openCreateForm} onClose={handleCloseForm}>
        <DialogTitle>Create New Service</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : newService?.service_image}
              alt={newService.service_name}
              width="100"
              height="100"
              style={{ borderRadius: '8px' }}
            />
          </Box>
          <TextField
            sx={{ marginTop: '12px' }}
            label="Service Name"
            fullWidth
            value={newService.service_name}
            onChange={(e) => setNewService({ ...newService, service_name: e.target.value })}
          />
          <TextField
            sx={{ marginTop: '12px' }}
            label="Service Price"
            fullWidth
            type="number"
            value={newService.service_price}
            onChange={(e) => setNewService({ ...newService, service_price: e.target.value })}
          />
          <TextField
            sx={{ marginTop: '12px' }}
            label="Service Duration (Minute)"
            fullWidth
            type="number"
            value={newService.service_duration}
            onChange={(e) => setNewService({ ...newService, service_duration: e.target.value })}
          />
          <TextField
            sx={{ marginTop: '16px' }}
            label="Service Description"
            fullWidth
            value={newService.service_description}
            onChange={(e) => setNewService({ ...newService, service_description: e.target.value })}
          />
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
        </DialogContent>
        <DialogActions sx={{ mr: 2 }}>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditForm} onClose={handleCloseEditForm}>
        <DialogTitle>Edit Service</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img
              src={editImageFile ? URL.createObjectURL(editImageFile) : editService?.service_image}
              alt={editService.service_name}
              width="100"
              height="100"
              style={{ borderRadius: '8px' }}
            />
          </Box>
          <TextField
            sx={{ marginTop: '12px' }}
            label="Service Name"
            fullWidth
            value={editService?.service_name || ''}
            onChange={(e) => setEditService({ ...editService, service_name: e.target.value })}
          />
          <TextField
            sx={{ marginTop: '12px' }}
            label="Service Price"
            fullWidth
            type="number"
            value={editService?.service_price || ''}
            onChange={(e) => setEditService({ ...editService, service_price: e.target.value })}
          />
          <TextField
            sx={{ marginTop: '12px' }}
            label="Service Duration (Minute)"
            fullWidth
            type="number"
            value={editService?.service_duration || ''}
            onChange={(e) => setEditService({ ...editService, service_duration: e.target.value })}
          />
          <TextField
            sx={{ marginTop: '12px' }}
            label="Service Description"
            fullWidth
            value={editService?.service_description || ''}
            onChange={(e) =>
              setEditService({ ...editService, service_description: e.target.value })
            }
          />
          <TextField
            sx={{ marginTop: '12px' }}
            type="file"
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ accept: 'image/*' }}
            onChange={(e) => {
              const fileInput = e.target as HTMLInputElement;
              if (fileInput.files && fileInput.files[0]) {
                setEditImageFile(fileInput.files[0]);
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ mr: 2 }}>
          <Button onClick={handleCloseEditForm}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save
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
          Services
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '40px' }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
        </Box>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenForm}
        >
          New service
        </Button>
      </Box>

      {/* Table for displaying services */}
      <Card>
        <Scrollbar>
          <TableContainer sx={{ display: 'flex', justifyContent: 'center' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Service Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Price</b>
                  </TableCell>
                  <TableCell>
                    <b>Duration</b>
                  </TableCell>
                  <TableCell>
                    <b>Description</b>
                  </TableCell>
                  <TableCell>
                    <b>Image</b>
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
                {filteredData
                  ?.slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  ?.map((service) => (
                    <TableRow key={service?._id}>
                      <TableCell>{service?.service_name}</TableCell>
                      <TableCell>{service?.service_price}</TableCell>
                      <TableCell>{service?.service_duration}</TableCell>
                      <TableCell>{service?.service_description}</TableCell>
                      <TableCell>
                        <img
                          src={service?.service_image}
                          alt={service?.service_name}
                          width="50"
                          height="50"
                          style={{ borderRadius: '4px' }}
                        />
                      </TableCell>
                      <TableCell>{service?.isActive ? 'Active' : 'Inactive'}</TableCell>
                      <TableCell>
                        <Button
                          sx={{ marginRight: '12px', minWidth: '80px' }}
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenEditForm(service)}
                        >
                          Edit
                        </Button>
                        <Button
                          sx={{ minWidth: '80px', marginTop: '4px' }}
                          variant="contained"
                          color="error"
                          onClick={() => handleAskDelete(service)}
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
          count={services.length}
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
