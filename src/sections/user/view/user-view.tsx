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
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import { TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';
import { useDispatch, useSelector } from 'react-redux';
import { findAllUser, uploadImage, createAccount, banUser } from 'src/redux/apiRequest';
import axios from 'axios';
import Cookie from 'js-cookie';
// ----------------------------------------------------------------------

export function UserView() {
  const table = useTable();
  const accessToken = Cookie.get('accessToken');
  const userID = Cookie.get('_id');
  const dispatch = useDispatch();
  const { foundUsers, isFetching } = useSelector((state: any) => state.user.findAll);

  useEffect(() => {
    findAllUser('', dispatch);
  }, [dispatch]);

  const [users, setUsers] = useState<any[]>([]);
  const [filterName, setFilterName] = useState('');

  const dataFiltered: UserProps[] = applyFilter({
    inputData: users || [],
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    user_name: '',
    user_email: '',
    user_avatar: '',
    user_gender: '',
    user_password: '',
    user_role: '',
  });

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const handleAskDelete = (user: any) => {
    setUserToDelete(user);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await banUser(accessToken, userID, userToDelete._id, dispatch, axios);
      await handleGetUser();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setConfirmDeleteOpen(false);
      setUserToDelete(null);
    }
  };

  const handleGetUser = async () => {
    const data = await findAllUser('', dispatch);
    setUsers(data?.metadata);
  };
  const handleOpenForm = () => setOpenCreateForm(true);
  const handleCloseForm = () => setOpenCreateForm(false);

  const handleDelete = async (user: any) => {
    try {
      await banUser(accessToken, userID, user._id, dispatch, axios);
      await handleGetUser();
    } catch (error) {
      console.error('Error deleting user:', error);
      handleGetUser();
    }
  };

  const handleSubmit = async () => {
    let imageUrl = '';
    try {
      if (imageFile) {
        const imageData = await uploadImage(imageFile, 'users', dispatch);
        imageUrl = imageData.img_url;
        setNewUser((prevState) => ({
          ...prevState,
          user_avatar: imageData.img_url,
        }));
      }

      const userToCreate = {
        ...newUser,
        user_avatar: imageUrl || newUser.user_avatar,
      };

      await createAccount({ ...userToCreate, user_avatar: imageUrl }, dispatch);

      // Làm mới danh sách người dùng
      handleGetUser();

      setNewUser({
        user_name: '',
        user_email: '',
        user_avatar: '',
        user_gender: '',
        user_password: '',
        user_role: '',
      });

      setOpenCreateForm(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  return (
    <DashboardContent>
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Delete
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
          Users
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenForm}
        >
          New user
        </Button>
      </Box>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={foundUsers?.length || 0}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _users.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'gender', label: 'Gender' },
                  { id: 'role', label: 'Role' },
                  { id: 'status', label: 'Status' },
                  { id: 'action', label: 'Action' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <UserTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onDelete={() => handleAskDelete(row)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, foundUsers?.length || 0)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={users?.length || 0}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Dialog open={openCreateForm} onClose={handleCloseForm}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img
              src={
                imageFile
                  ? URL.createObjectURL(imageFile)
                  : newUser.user_avatar || '/assets/avatar_default.jpg'
              }
              alt="avatar"
              width="100"
              height="100"
              style={{ borderRadius: '50%' }}
            />
          </Box>

          <TextField
            sx={{ mt: 2 }}
            label="Name"
            fullWidth
            value={newUser.user_name}
            onChange={(e) => setNewUser({ ...newUser, user_name: e.target.value })}
          />

          <TextField
            sx={{ mt: 2 }}
            label="Email"
            fullWidth
            value={newUser.user_email}
            onChange={(e) => setNewUser({ ...newUser, user_email: e.target.value })}
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              value={newUser.user_gender}
              label="Gender"
              onChange={(e) => setNewUser({ ...newUser, user_gender: e.target.value })}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="unknown">Unknown</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={newUser.user_role}
              label="Role"
              onChange={(e) => setNewUser({ ...newUser, user_role: e.target.value })}
            >
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="customer">Customer</MenuItem>
            </Select>
          </FormControl>

          <TextField
            sx={{ mt: 2 }}
            label="Password"
            fullWidth
            type="password"
            value={newUser.user_password}
            onChange={(e) => setNewUser({ ...newUser, user_password: e.target.value })}
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
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

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
