/* eslint-disable perfectionist/sort-named-imports */
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
  FormControlLabel,
  Switch,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';
import axios from 'axios';
import { createGift, deleteGift, getAllGifts, updateGift, uploadImage } from 'src/redux/apiRequest';

export function GiftView() {
  const currentUser = useSelector((state: any) => state.user.signin.currentUser);
  const accessToken = Cookie.get('accessToken');
  const userID = Cookie.get('_id');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const table = useTable();
  const [gifts, setGifts] = useState<any[]>([]);
  const [openCreateForm, setCreateOpenForm] = useState(false);
  const [openEditForm, setEditOpenForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [newGift, setNewGift] = useState({
    name: '',
    description: '',
    image: '',
    required_points: 0,
    quantity: 0,
    is_active: true,
    start_date: Date.now(),
    end_date: Date.now(),
  });
  const [editGift, setEditGift] = useState({
    id: '',
    name: '',
    description: '',
    image: '',
    required_points: 0,
    quantity: 0,
    is_active: true,
    start_date: Date.now(),
    end_date: Date.now(),
  });

  const handleOpenForm = () => setCreateOpenForm(true);
  const handleCloseForm = () => setCreateOpenForm(false);
  const handleOpenEditForm = (gift: any) => {
    setEditGift({
      id: gift?._id,
      name: gift?.name,
      description: gift?.description,
      image: gift?.image,
      required_points: gift?.required_points,
      quantity: gift?.quantity,
      is_active: gift?.is_active,
      start_date: gift?.start_date,
      end_date: gift?.end_date,
    });
    setEditOpenForm(true);
  };
  const handleCloseEditForm = () => setEditOpenForm(false);

  const handleSubmit = async () => {
    let imageUrl = '';
    try {
      if (imageFile) {
        const imageData = await uploadImage(imageFile, 'gifts', dispatch);
        imageUrl = imageData.img_url;
        setNewGift((prevState) => ({
          ...prevState,
          image: imageData.img_url,
        }));
      }

      const response = await createGift(accessToken, { ...newGift, image: imageUrl }, dispatch);
      const createdGift = response.metadata;

      setGifts([
        ...gifts,
        {
          name: createdGift?.name,
          description: createdGift?.description,
          image: createdGift?.image,
          required_points: createdGift?.required_points,
          quantity: createdGift?.quantity,
          is_active: createdGift?.is_active,
          start_date: createdGift?.start_date,
          end_date: createdGift?.end_date,
        },
      ]);
      handleGetAllGift();
      setCreateOpenForm(false);
    } catch (error) {
      console.error('Error creating gift:', error);
    }
  };

  const handleSaveEdit = async () => {
    let imageUrl = editGift.image;

    try {
      if (editImageFile) {
        const imageData = await uploadImage(editImageFile, 'gifts', dispatch);
        imageUrl = imageData.img_url;
        setEditGift((prevState) => ({
          ...prevState,
          image: imageUrl,
        }));
      }

      await updateGift(accessToken, editGift?.id, { ...editGift, image: imageUrl }, dispatch);

      await handleGetAllGift();

      setEditOpenForm(false);
    } catch (error) {
      console.error('Error saving gift:', error);
    }
  };

  const handleDelete = async (gift: any) => {
    console.log('giftid', gift._id);
    try {
      await deleteGift(accessToken, gift._id, dispatch);
      handleGetAllGift();
    } catch (error) {
      console.error('Error deleting gift:', error);
    }
  };

  const handleGetAllGift = async () => {
    const data = await getAllGifts(dispatch);
    console.log('data', data);
    setGifts(data);
  };

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [inventoryToDelete, setGiftToDelete] = useState<any>(null);

  const handleAskDelete = (gift: any) => {
    setGiftToDelete(gift);
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
      setGiftToDelete(null);
    }
  };

  useEffect(() => {
    handleGetAllGift();
  }, []);

  const filteredData = gifts?.filter((d) => d?.name?.toLowerCase().includes(search));

  return (
    <DashboardContent>
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this gift?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Modal for adding new gift */}
      <Dialog open={openCreateForm} onClose={handleCloseForm}>
        <DialogTitle>Create New Gift</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : newGift?.image}
              alt={newGift.name}
              width="100"
              height="100"
              style={{ borderRadius: '8px' }}
            />
          </Box>
          <TextField
            sx={{ marginTop: '12px' }}
            label="Gift Name"
            fullWidth
            value={newGift.name}
            onChange={(e) => setNewGift({ ...newGift, name: e.target.value })}
          />
          <TextField
            sx={{ marginTop: '12px' }}
            label="Required Point"
            fullWidth
            type="number"
            value={newGift.required_points}
            onChange={(e) => setNewGift({ ...newGift, required_points: Number(e.target.value) })}
          />
          <TextField
            sx={{ marginTop: '12px' }}
            label="Quantity"
            fullWidth
            type="number"
            value={newGift.quantity}
            onChange={(e) => setNewGift({ ...newGift, quantity: Number(e.target.value) })}
          />
          <TextField
            sx={{ marginTop: '16px' }}
            label="Gift Description"
            fullWidth
            value={newGift.description}
            onChange={(e) => setNewGift({ ...newGift, description: e.target.value })}
          />
          <FormControlLabel
            control={
              <Switch
                checked={newGift.is_active}
                onChange={(e) => setNewGift({ ...newGift, is_active: e.target.checked })}
              />
            }
            label="Active"
          />
          <TextField
            sx={{ marginTop: '12px' }}
            label="Start Date"
            type="datetime-local"
            fullWidth
            value={new Date(newGift.start_date).toISOString().slice(0, 16)}
            onChange={(e) =>
              setNewGift({ ...newGift, start_date: new Date(e.target.value).getTime() })
            }
          />

          <TextField
            sx={{ marginTop: '12px' }}
            label="End Date"
            type="datetime-local"
            fullWidth
            value={new Date(newGift.end_date).toISOString().slice(0, 16)}
            onChange={(e) =>
              setNewGift({ ...newGift, end_date: new Date(e.target.value).getTime() })
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
                setImageFile(fileInput.files[0]);
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ marginRight: '16px' }}>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button
            sx={{ marginRight: '16px' }}
            onClick={handleSubmit}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditForm} onClose={handleCloseEditForm}>
        <DialogTitle>Edit Gift</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img
              src={editImageFile ? URL.createObjectURL(editImageFile) : editGift?.image}
              alt={editGift.name}
              width="100"
              height="100"
              style={{ borderRadius: '8px' }}
            />
          </Box>
          <TextField
            sx={{ marginTop: '12px' }}
            label="Gift Name"
            fullWidth
            value={editGift?.name || ''}
            onChange={(e) => setEditGift({ ...editGift, name: e.target.value })}
          />
          <TextField
            sx={{ marginTop: '12px' }}
            label="Required Point"
            fullWidth
            type="number"
            value={editGift?.required_points || ''}
            onChange={(e) => setEditGift({ ...editGift, required_points: Number(e.target.value) })}
          />
          <TextField
            sx={{ marginTop: '12px' }}
            label="Quantity"
            fullWidth
            type="number"
            value={editGift?.quantity || ''}
            onChange={(e) => setEditGift({ ...editGift, quantity: Number(e.target.value) })}
          />
          <TextField
            sx={{ marginTop: '12px' }}
            label="Gift Description"
            fullWidth
            value={editGift?.description || ''}
            onChange={(e) => setEditGift({ ...editGift, description: e.target.value })}
          />
          <FormControlLabel
            control={
              <Switch
                checked={editGift.is_active}
                onChange={(e) => setNewGift({ ...editGift, is_active: e.target.checked })}
              />
            }
            label="Active"
          />
          <TextField
            sx={{ marginTop: '12px' }}
            label="Start Date"
            type="datetime-local"
            fullWidth
            value={new Date(editGift.start_date).toISOString().slice(0, 16)}
            onChange={(e) =>
              setEditGift({ ...editGift, start_date: new Date(e.target.value).getTime() })
            }
          />

          <TextField
            sx={{ marginTop: '12px' }}
            label="End Date"
            type="datetime-local"
            fullWidth
            value={new Date(editGift.end_date).toISOString().slice(0, 16)}
            onChange={(e) =>
              setEditGift({ ...editGift, end_date: new Date(e.target.value).getTime() })
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
        <DialogActions sx={{ marginRight: '16px' }}>
          <Button onClick={handleCloseEditForm}>Cancel</Button>
          <Button
            sx={{ marginRight: '16px' }}
            onClick={handleSaveEdit}
            variant="contained"
            color="primary"
          >
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
          Gifts
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '40px' }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value?.toLowerCase())}
          />
        </Box>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenForm}
        >
          New gift
        </Button>
      </Box>

      {/* Table for displaying gifts */}
      <Card>
        <Scrollbar>
          <TableContainer sx={{ display: 'flex', justifyContent: 'center' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Gift Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Required Point</b>
                  </TableCell>
                  <TableCell>
                    <b>Quantity</b>
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
                    <b>Effect</b>
                  </TableCell>
                  <TableCell>
                    <b>Expire</b>
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
                  ?.map((gift) => (
                    <TableRow key={gift?._id}>
                      <TableCell>{gift?.name}</TableCell>
                      <TableCell>{gift?.required_points}</TableCell>
                      <TableCell>{gift?.quantity}</TableCell>
                      <TableCell>{gift?.description}</TableCell>
                      <TableCell>
                        <img
                          src={gift?.image}
                          alt={gift?.name}
                          width="50"
                          height="50"
                          style={{ borderRadius: '4px' }}
                        />
                      </TableCell>
                      <TableCell>{gift?.is_active ? 'Active' : 'Inactive'}</TableCell>
                      <TableCell>{new Date(gift?.start_date).toLocaleString()}</TableCell>
                      <TableCell>{new Date(gift?.end_date).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button
                          sx={{ marginRight: '12px', minWidth: '80px' }}
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenEditForm(gift)}
                        >
                          Edit
                        </Button>
                        <Button
                          sx={{ minWidth: '80px', marginTop: '4px' }}
                          variant="contained"
                          color="error"
                          onClick={() => handleAskDelete(gift)}
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
          count={gifts.length}
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
