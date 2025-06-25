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
  createInventory,
  deleteInventory,
  getAllInventories,
  updateInventory,
  uploadImage,
} from 'src/redux/apiRequest';
import { toast } from 'react-toastify';

export function InventoryView() {
  const currentUser = useSelector((state: any) => state.user.signin.currentUser);
  const accessToken = Cookie.get('accessToken');
  const userID = Cookie.get('_id');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const table = useTable();
  const [inventories, setInventories] = useState<any[]>([]);
  const [openCreateForm, setCreateOpenForm] = useState(false);
  const [openEditForm, setEditOpenForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [search, setSearch] = useState('');
  const [newInventory, setNewInventory] = useState({
    item_name: '',
    item_image: '',
    item_category: '',
    quantity: '',
    unit_price: '',
    supplier: '',
  });
  const [editInventory, setEditInventory] = useState({
    inventory_id: '',
    item_name: '',
    item_image: '',
    item_category: '',
    quantity: '',
    unit_price: '',
    supplier: '',
  });

  const [openEditQtyDialog, setOpenEditQtyDialog] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<any>(null);
  const [newQuantity, setNewQuantity] = useState('');

  const handleOpenForm = () => setCreateOpenForm(true);
  const handleCloseForm = () => setCreateOpenForm(false);
  const handleOpenEditForm = (inventory: any) => {
    setEditInventory({
      inventory_id: inventory?._id,
      item_name: inventory?.item_name,
      item_image: inventory?.item_image,
      item_category: inventory?.item_category,
      quantity: inventory?.quantity,
      unit_price: inventory?.unit_price,
      supplier: inventory?.supplier,
    });
    setEditOpenForm(true);
  };
  const handleCloseEditForm = () => setEditOpenForm(false);

  const handleSubmit = async () => {
    if (Number(newInventory.quantity) <= 0 || Number(newInventory.unit_price) <= 0) {
      toast.error('Quantity and number must be greater than 0');
      return;
    }

    let imageUrl = '';
    try {
      if (imageFile) {
        const imageData = await uploadImage(imageFile, 'inventories', dispatch);
        imageUrl = imageData.img_url;
        setNewInventory((prevState) => ({
          ...prevState,
          item_image: imageData.img_url,
        }));
      }

      const response = await createInventory(
        accessToken,
        { ...newInventory, item_image: imageUrl },
        dispatch,
        navigate,
        axios
      );
      const createdInventory = response.metadata;

      setInventories([
        ...inventories,
        {
          item_name: createdInventory.item_name,
          item_image: createdInventory.item_image,
          item_category: createdInventory.item_category,
          quantity: createdInventory.quantity,
          unit_price: createdInventory.unit_price,
          supplier: createdInventory.supplier,
        },
      ]);
      handleGetAllInventory();
      setCreateOpenForm(false);
    } catch (error) {
      console.error('Error creating inventory:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (Number(editInventory.quantity) <= 0 || Number(editInventory.unit_price) <= 0) {
      toast.error('Quantity and number must be greater than 0');
      return;
    }
    let imageUrl = editInventory.item_image;

    try {
      if (editImageFile) {
        const imageData = await uploadImage(editImageFile, 'inventories', dispatch);
        imageUrl = imageData.img_url;
        setEditInventory((prevState) => ({
          ...prevState,
          item_image: imageUrl,
        }));
      }

      await updateInventory(
        accessToken,
        { ...editInventory, item_image: imageUrl },
        dispatch,
        navigate,
        axios
      );

      await handleGetAllInventory();

      setEditOpenForm(false);
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  };

  const handleDelete = async (inventory: any) => {
    console.log('inventoryid', inventory._id);
    setInventories((prevInventories) =>
      prevInventories.filter((s: any) => inventory.item_name !== s.item_name)
    );

    try {
      deleteInventory(accessToken, inventory._id, dispatch, axios);
    } catch (error) {
      console.error('Error deleting inventory:', error);
      handleGetAllInventory();
    }
  };

  const handleGetAllInventory = async () => {
    const data = await getAllInventories(dispatch);
    console.log('data', data);
    setInventories(data);
  };

  useEffect(() => {
    handleGetAllInventory();
  }, []);

  const handleOpenEditQty = (inventory: any) => {
    setEditInventory({
      inventory_id: inventory?._id,
      item_name: inventory?.item_name,
      item_image: inventory?.item_image,
      item_category: inventory?.item_category,
      quantity: inventory?.quantity,
      unit_price: inventory?.unit_price,
      supplier: inventory?.supplier,
    });
    setSelectedInventory(inventory._id);
    setNewQuantity(inventory.quantity);
    setOpenEditQtyDialog(true);
  };

  const handleCloseEditQty = () => {
    setOpenEditQtyDialog(false);
    setSelectedInventory(null);
  };

  const handleSaveNewQuantity = async () => {
    if (Number(newQuantity) <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }
    if (!selectedInventory) return;

    try {
      await updateInventory(
        accessToken,
        { ...editInventory, quantity: newQuantity, inventory_id: selectedInventory },
        dispatch,
        navigate,
        axios
      );

      await handleGetAllInventory();

      setOpenEditQtyDialog(false);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
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

  const filteredData = inventories.filter((d) => d.item_name.toLowerCase().includes(search));

  return (
    <DashboardContent>
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this inventory item?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for adding new inventory */}
      <Dialog open={openCreateForm} onClose={handleCloseForm}>
        <DialogTitle>Create New Inventory</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : newInventory?.item_image}
              alt={newInventory.item_image}
              width="100"
              height="100"
              style={{ borderRadius: '8px' }}
            />
          </Box>
          <TextField
            sx={{ marginTop: '12px' }}
            label="Name"
            fullWidth
            value={newInventory.item_name}
            onChange={(e) => setNewInventory({ ...newInventory, item_name: e.target.value })}
          />

          <TextField
            sx={{ marginTop: '12px' }}
            label="Category"
            fullWidth
            value={newInventory.item_category}
            onChange={(e) => setNewInventory({ ...newInventory, item_category: e.target.value })}
          />

          <TextField
            sx={{ marginTop: '12px' }}
            label="Quantity"
            fullWidth
            type="number"
            value={newInventory.quantity}
            onChange={(e) => setNewInventory({ ...newInventory, quantity: e.target.value })}
          />

          <TextField
            sx={{ marginTop: '12px' }}
            label="Unit Price"
            fullWidth
            type="number"
            value={newInventory.unit_price}
            onChange={(e) => setNewInventory({ ...newInventory, unit_price: e.target.value })}
          />

          <TextField
            sx={{ marginTop: '12px' }}
            label="Supplier"
            fullWidth
            value={newInventory.supplier}
            onChange={(e) => setNewInventory({ ...newInventory, supplier: e.target.value })}
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

      <Dialog open={openEditQtyDialog} onClose={handleCloseEditQty}>
        <DialogTitle>Edit Quantity</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={newQuantity || ''}
            onChange={(e) => setNewQuantity(e.target.value)}
          />
        </DialogContent>
        <DialogActions style={{ marginRight: '16px' }}>
          <Button onClick={handleCloseEditQty}>Cancel</Button>
          <Button onClick={handleSaveNewQuantity} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditForm} onClose={handleCloseEditForm}>
        <DialogTitle>Edit Inventory</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img
              src={editImageFile ? URL.createObjectURL(editImageFile) : editInventory?.item_image}
              alt={editInventory?.item_name}
              width="100"
              height="100"
              style={{ borderRadius: '8px' }}
            />
          </Box>

          <TextField
            sx={{ marginTop: '12px' }}
            label="Name"
            fullWidth
            value={editInventory?.item_name || ''}
            onChange={(e) => setEditInventory({ ...editInventory, item_name: e.target.value })}
          />

          <TextField
            sx={{ marginTop: '12px' }}
            label="Category"
            fullWidth
            value={editInventory?.item_category || ''}
            onChange={(e) => setEditInventory({ ...editInventory, item_category: e.target.value })}
          />

          <TextField
            sx={{ marginTop: '12px' }}
            label="Quantity"
            type="number"
            fullWidth
            value={editInventory?.quantity || ''}
            onChange={(e) => setEditInventory({ ...editInventory, quantity: e.target.value })}
          />

          <TextField
            sx={{ marginTop: '12px' }}
            label="Unit Price"
            type="number"
            fullWidth
            value={editInventory?.unit_price || ''}
            onChange={(e) => setEditInventory({ ...editInventory, unit_price: e.target.value })}
          />

          <TextField
            sx={{ marginTop: '12px' }}
            label="Supplier"
            fullWidth
            value={editInventory?.supplier || ''}
            onChange={(e) => setEditInventory({ ...editInventory, supplier: e.target.value })}
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
          Inventories
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
          New inventory
        </Button>
      </Box>

      {/* Table for displaying inventories */}
      <Card>
        <Scrollbar>
          <TableContainer sx={{ display: 'flex', justifyContent: 'center' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Inventory Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Category</b>
                  </TableCell>
                  <TableCell>
                    <b>Quantity</b>
                  </TableCell>
                  <TableCell>
                    <b>Unit Price</b>
                  </TableCell>
                  <TableCell>
                    <b>Supplier</b>
                  </TableCell>
                  <TableCell>
                    <b>Image</b>
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
                  .map((inventory) => (
                    <TableRow key={inventory?._id}>
                      <TableCell>{inventory.item_name}</TableCell>
                      <TableCell>{inventory.item_category}</TableCell>
                      <TableCell>{inventory.quantity}</TableCell>
                      <TableCell>{inventory.unit_price}</TableCell>
                      <TableCell>{inventory.supplier}</TableCell>
                      <TableCell>
                        <img
                          src={inventory.item_image}
                          alt={inventory.item_name}
                          width="50"
                          height="50"
                          style={{ borderRadius: '4px' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          sx={{ marginRight: '12px', minWidth: '80px' }}
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenEditForm(inventory)}
                        >
                          Edit
                        </Button>
                        <Button
                          sx={{ marginRight: '12px', minWidth: '80px' }}
                          variant="contained"
                          color="error"
                          onClick={() => {
                            handleAskDelete(inventory);
                          }}
                        >
                          Delete
                        </Button>
                        <Button
                          sx={{ marginRight: '12px', minWidth: '80px' }}
                          variant="contained"
                          color="warning"
                          onClick={() => handleOpenEditQty(inventory)}
                        >
                          Stock in
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
          count={inventories.length}
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
