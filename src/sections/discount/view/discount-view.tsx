/* eslint-disable react/jsx-boolean-value */
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';
import axios from 'axios';
import {
  createDiscount,
  deleteDiscount,
  findAllUser,
  getAllDiscounts,
  updateDiscount,
  uploadImage,
} from 'src/redux/apiRequest';
import { Label } from 'src/components/label';
import { toast } from 'react-toastify';

export function DiscountView() {
  const currentUser = useSelector((state: any) => state.user.signin.currentUser);
  const accessToken = Cookie.get('accessToken');
  const userID = Cookie.get('_id');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const table = useTable();
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [openCreateForm, setCreateOpenForm] = useState(false);
  const [openEditForm, setEditOpenForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openAssignUserForm, setAssignUserForm] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [newDiscount, setNewDiscount] = useState({
    code: '',
    description: '',
    percentage: 0,
    amount: 0,
    is_active: true,
    start_date: Date.now(),
    end_date: Date.now(),
    usage_limit: 0,
    used_count: 0,
    assigned_user: null,
    discountType: '',
    specific: false as boolean,
  });
  const [editDiscount, setEditDiscount] = useState({
    id: '',
    code: '',
    description: '',
    percentage: 0,
    amount: 0,
    is_active: true,
    start_date: Date.now(),
    end_date: Date.now(),
    usage_limit: 0,
    used_count: 0,
    assigned_user: null,
    discountType: '',
    specific: false as boolean,
  });

  const handleOpenForm = () => setCreateOpenForm(true);
  const handleCloseForm = () => setCreateOpenForm(false);
  const handleOpenEditForm = (discount: any) => {
    setEditDiscount({
      id: discount?._id,
      code: discount?.code,
      description: discount?.description,
      percentage: discount?.percentage,
      amount: discount?.amount,
      is_active: discount?.is_active,
      start_date: discount?.start_date,
      end_date: discount?.end_date,
      usage_limit: discount?.usage_limit,
      used_count: discount?.used_count,
      assigned_user: discount?.assigned_user,
      discountType: discount?.amount > 0 ? 'amount' : 'percentage',
      specific: discount?.assigned_user ? true : false,
    });
    setSelectedUser(discount?.assigned_user);
    setEditOpenForm(true);
  };
  const handleCloseEditForm = () => setEditOpenForm(false);

  const handleCloseAssignUserForm = () => {
    setAssignUserForm(false);
  };

  const handleAssignUser = async () => {
    if (selectedUser) {
      console.log('selected', newDiscount);
      handleCloseAssignUserForm();
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await createDiscount(accessToken, { ...newDiscount }, dispatch);
      const createdDiscount = response;

      if (!createdDiscount) {
        toast.error('Create discount failed');
      } else {
        setNewDiscount({
          code: '',
          description: '',
          percentage: 0,
          amount: 0,
          is_active: true,
          start_date: Date.now(),
          end_date: Date.now(),
          usage_limit: 0,
          used_count: 0,
          assigned_user: null,
          discountType: '',
          specific: false,
        });
        toast.success('Create discount successfully');
        setSelectedUser(null);
        handleGetAllDiscount();
        setCreateOpenForm(false);
      }
    } catch (error) {
      console.error('Error creating discount:', error);
    }
  };

  const handleGetAllUser = async () => {
    const data = await findAllUser('', dispatch);
    const customers = data?.metadata.filter((user: any) => user.user_role === 'customer');
    setUsers(customers);
  };

  const handleSaveEdit = async () => {
    try {
      console.log('editing', editDiscount);
      const data = await updateDiscount(
        accessToken,
        editDiscount.id,
        { ...editDiscount },
        dispatch
      );
      if (data) {
        setSelectedUser(null);
        setEditDiscount({
          id: '',
          code: '',
          description: '',
          percentage: 0,
          amount: 0,
          is_active: true,
          start_date: Date.now(),
          end_date: Date.now(),
          usage_limit: 0,
          used_count: 0,
          assigned_user: null,
          discountType: 'percentage',
          specific: false,
        });
        toast.success('Update discount successfully');
        await handleGetAllDiscount();
        setEditOpenForm(false);
      } else {
        toast.error('Update discount failed');
      }
    } catch (error) {
      console.error('Error saving discount:', error);
    }
  };

  const handleDelete = async (discount: any) => {
    try {
      const data = await deleteDiscount(accessToken, discount._id, dispatch);
      if (data) {
        toast.success('Delete discord successfully');
        handleGetAllDiscount();
      } else {
        toast.error('Delete discord failed');
      }
    } catch (error) {
      console.error('Error deleting discount:', error);
    }
  };

  const handleGetAllDiscount = async () => {
    const data = await getAllDiscounts(dispatch);
    setDiscounts(data);
  };

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [inventoryToDelete, setDiscountToDelete] = useState<any>(null);

  const handleAskDelete = (discount: any) => {
    setDiscountToDelete(discount);
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
      setDiscountToDelete(null);
    }
  };

  useEffect(() => {
    handleGetAllDiscount();
    handleGetAllUser();
  }, []);

  const filteredDiscounts = discounts.filter((d) => d.code.toUpperCase().includes(searchCode));

  return (
    <DashboardContent>
      <Dialog open={openAssignUserForm} onClose={handleCloseAssignUserForm}>
        <DialogTitle>Assign User</DialogTitle>
        <DialogContent>
          <Typography>Select a user to assign with discount code</Typography>
          <Box sx={{ mt: 2 }}>
            {users?.map((user) => (
              <Card key={user._id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img
                  src={user.user_avatar}
                  alt={user.user_name}
                  width="40"
                  height="40"
                  style={{ borderRadius: '50%', marginRight: '10px' }}
                />
                <Typography>{user.user_name}</Typography>
                <Button
                  sx={{ marginLeft: 'auto' }}
                  variant="outlined"
                  onClick={() => {
                    setNewDiscount({ ...newDiscount, assigned_user: user._id });
                    setEditDiscount({ ...editDiscount, assigned_user: user._id });
                    setSelectedUser(user);
                  }}
                >
                  {selectedUser?._id === user._id ? 'Selected' : 'Select'}
                </Button>
              </Card>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ marginRight: '16px' }}>
          <Button onClick={handleCloseAssignUserForm}>Cancel</Button>
          <Button onClick={handleAssignUser} variant="contained" color="primary">
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this discount?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Modal for adding new discount */}
      <Dialog open={openCreateForm} onClose={handleCloseForm}>
        <DialogTitle>Create New Discount</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ mt: 2 }}
            label="Discount Code"
            fullWidth
            value={newDiscount.code}
            onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="discount-type-label">Discount Type</InputLabel>
            <Select
              labelId="discount-type-label"
              value={newDiscount.discountType}
              label="Discount Type"
              onChange={(e) =>
                setNewDiscount({
                  ...newDiscount,
                  discountType: e.target.value,
                })
              }
            >
              <MenuItem value="amount">Amount</MenuItem>
              <MenuItem value="percentage">Percentage</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="discount-type-label">For Specific User</InputLabel>
            <Select
              labelId="discount-type-label"
              value={newDiscount.specific ? 'true' : 'false'}
              label="Discount Type"
              onChange={(e) => {
                const specificValue = e.target.value === 'true';
                setNewDiscount((prev) => ({
                  ...prev,
                  specific: specificValue,
                  assigned_user: specificValue ? prev.assigned_user : null,
                }));
                setAssignUserForm(specificValue);
                if (!specificValue) setSelectedUser(null);
              }}
            >
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </Select>
          </FormControl>

          {selectedUser && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <Label id="discount-type-label">Owned by</Label>
              <Card key={selectedUser?._id} sx={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={selectedUser?.user_avatar}
                  alt={selectedUser?.user_name}
                  width="40"
                  height="40"
                  style={{ borderRadius: '50%', marginRight: '10px' }}
                />
                <Typography>{selectedUser?.user_name}</Typography>
              </Card>
            </FormControl>
          )}

          {newDiscount.discountType === 'amount' && (
            <TextField
              sx={{ mt: 2 }}
              label="Discount Amount"
              type="number"
              fullWidth
              value={newDiscount.amount}
              onChange={(e) => setNewDiscount({ ...newDiscount, amount: Number(e.target.value) })}
            />
          )}

          {newDiscount.discountType === 'percentage' && (
            <TextField
              sx={{ mt: 2 }}
              label="Discount Percentage"
              type="number"
              fullWidth
              value={newDiscount.percentage}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, percentage: Number(e.target.value) })
              }
            />
          )}

          <TextField
            sx={{ mt: 2 }}
            label="Usage Limit"
            type="number"
            fullWidth
            value={newDiscount.usage_limit}
            onChange={(e) =>
              setNewDiscount({ ...newDiscount, usage_limit: Number(e.target.value) })
            }
          />

          <TextField
            sx={{ mt: 2 }}
            label="Start Date"
            type="datetime-local"
            fullWidth
            value={new Date(newDiscount.start_date).toISOString().slice(0, 16)}
            onChange={(e) =>
              setNewDiscount({
                ...newDiscount,
                start_date: new Date(e.target.value).getTime(),
              })
            }
          />
          <TextField
            sx={{ mt: 2 }}
            label="End Date"
            type="datetime-local"
            fullWidth
            value={new Date(newDiscount.end_date).toISOString().slice(0, 16)}
            onChange={(e) =>
              setNewDiscount({
                ...newDiscount,
                end_date: new Date(e.target.value).getTime(),
              })
            }
          />

          <TextField
            sx={{ mt: 2 }}
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newDiscount.description}
            onChange={(e) => setNewDiscount({ ...newDiscount, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ marginRight: '16px' }}>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ marginRight: '16px' }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditForm} onClose={handleCloseEditForm}>
        <DialogTitle>Edit Discount</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ mt: 2 }}
            label="Discount Code"
            fullWidth
            value={editDiscount.code}
            onChange={(e) =>
              setEditDiscount({ ...editDiscount, code: e.target.value.toUpperCase() })
            }
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="discount-type-label">Discount Type</InputLabel>
            <Select
              labelId="discount-type-label"
              value={editDiscount.discountType}
              label="Discount Type"
              onChange={(e) =>
                setEditDiscount({
                  ...editDiscount,
                  discountType: e.target.value,
                })
              }
            >
              <MenuItem value="amount">Amount</MenuItem>
              <MenuItem value="percentage">Percentage</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="discount-type-label">For Specific User</InputLabel>
            <Select
              labelId="discount-type-label"
              value={editDiscount.specific ? 'true' : 'false'}
              label="Discount Type"
              onChange={(e) => {
                const specificValue = e.target.value === 'true';
                setEditDiscount((prev) => ({
                  ...prev,
                  specific: specificValue,
                  assigned_user: specificValue ? prev.assigned_user : null,
                }));
                setAssignUserForm(specificValue);
                if (!specificValue) setSelectedUser(null);
              }}
            >
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </Select>
          </FormControl>

          {selectedUser && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <Label id="discount-type-label">Owned by</Label>
              <Card key={selectedUser?._id} sx={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={selectedUser?.user_avatar}
                  alt={selectedUser?.user_name}
                  width="40"
                  height="40"
                  style={{ borderRadius: '50%', marginRight: '10px' }}
                />
                <Typography>{selectedUser?.user_name}</Typography>
              </Card>
            </FormControl>
          )}

          {editDiscount.discountType === 'amount' && (
            <TextField
              sx={{ mt: 2 }}
              label="Discount Amount"
              type="number"
              fullWidth
              value={editDiscount.amount}
              onChange={(e) => setEditDiscount({ ...editDiscount, amount: Number(e.target.value) })}
            />
          )}

          {editDiscount.discountType === 'percentage' && (
            <TextField
              sx={{ mt: 2 }}
              label="Discount Percentage"
              type="number"
              fullWidth
              value={editDiscount.percentage}
              onChange={(e) =>
                setEditDiscount({ ...editDiscount, percentage: Number(e.target.value) })
              }
            />
          )}

          <TextField
            sx={{ mt: 2 }}
            label="Usage Limit"
            type="number"
            fullWidth
            value={editDiscount.usage_limit}
            onChange={(e) =>
              setEditDiscount({ ...editDiscount, usage_limit: Number(e.target.value) })
            }
          />

          <TextField
            sx={{ mt: 2 }}
            label="Start Date"
            type="datetime-local"
            fullWidth
            value={new Date(editDiscount.start_date).toISOString().slice(0, 16)}
            onChange={(e) =>
              setEditDiscount({
                ...editDiscount,
                start_date: new Date(e.target.value).getTime(),
              })
            }
          />
          <TextField
            sx={{ mt: 2 }}
            label="End Date"
            type="datetime-local"
            fullWidth
            value={new Date(editDiscount.end_date).toISOString().slice(0, 16)}
            onChange={(e) =>
              setEditDiscount({
                ...editDiscount,
                end_date: new Date(e.target.value).getTime(),
              })
            }
          />

          <TextField
            sx={{ mt: 2 }}
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={editDiscount.description}
            onChange={(e) => setEditDiscount({ ...editDiscount, description: e.target.value })}
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
          Discounts
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '40px' }}>
          <TextField
            label="Search by Code"
            variant="outlined"
            size="small"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
          />
        </Box>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenForm}
        >
          New discount
        </Button>
      </Box>

      {/* Table for displaying discounts */}
      <Card>
        <Scrollbar>
          <TableContainer sx={{ display: 'flex', justifyContent: 'center' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Discount Code</b>
                  </TableCell>
                  <TableCell>
                    <b>Description</b>
                  </TableCell>
                  <TableCell>
                    <b>Amount</b>
                  </TableCell>
                  <TableCell>
                    <b>Type</b>
                  </TableCell>
                  <TableCell>
                    <b>Valid</b>
                  </TableCell>
                  <TableCell>
                    <b>Expire</b>
                  </TableCell>
                  <TableCell>
                    <b>Limit</b>
                  </TableCell>
                  <TableCell>
                    <b>Used</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDiscounts
                  ?.slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  ?.map((discount) => (
                    <TableRow key={discount?._id}>
                      <TableCell>{discount?.code}</TableCell>
                      <TableCell>{discount?.description}</TableCell>
                      <TableCell>
                        {discount?.percentage > 0
                          ? discount?.percentage + '%'
                          : discount?.amount + 'VND'}
                      </TableCell>
                      <TableCell>
                        {!discount?.assigned_user
                          ? 'General'
                          : 'Specific' + ` (${discount.assigned_user.user_name})`}
                      </TableCell>
                      <TableCell>{new Date(discount?.start_date).toLocaleString()}</TableCell>
                      <TableCell>{new Date(discount?.end_date).toLocaleString()}</TableCell>
                      <TableCell>{discount?.usage_limit}</TableCell>
                      <TableCell>{discount?.used_count}</TableCell>
                      <TableCell>
                        <Button
                          sx={{ marginRight: '12px', minWidth: '80px' }}
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenEditForm(discount)}
                        >
                          Edit
                        </Button>
                        <Button
                          sx={{ minWidth: '80px', marginTop: '4px' }}
                          variant="contained"
                          color="error"
                          onClick={() => handleAskDelete(discount)}
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
          count={discounts.length}
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
