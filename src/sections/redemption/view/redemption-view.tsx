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
import Cookie from 'js-cookie';

import { useDispatch, useSelector } from 'react-redux';
import {
  completeRedemption,
  contactAboutRedemptionViaEmail,
  getAllRedemptions,
} from 'src/redux/apiRequest';
import { toast } from 'react-toastify';

export function RedemptionView() {
  const dispatch = useDispatch();
  const table = useTable();
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const handleGetRedemption = async () => {
    const data = await getAllRedemptions(dispatch);
    console.log(data);
    setRedemptions(data);
  };

  const handleContact = async (redemption: any) => {
    const email = redemption?.user?.user_email;
    const address = redemption?.user?.user_address;
    const giftName = redemption?.gift?.name;
    const userName = redemption?.user?.user_name;

    try {
      await contactAboutRedemptionViaEmail({
        to: email,
        userName,
        address,
        giftName,
      });

      toast.success('Send mail successfully!');
    } catch (error) {
      toast.error('Lỗi khi gửi mail!');
      console.error(error);
    }
  };

  const handleDelete = async (redemption: any) => {
    const accessToken = Cookie.get('accessToken');
    await completeRedemption(accessToken, redemption._id, dispatch);
    await handleGetRedemption();
  };

  useEffect(() => {
    handleGetRedemption();
  }, []);

  const filteredData = redemptions.filter((d) => d.user.user_name.toLowerCase().includes(search));

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Redemptions
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
      </Box>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ display: 'flex', justifyContent: 'center' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Customer</b>
                  </TableCell>
                  <TableCell>
                    <b>Gift</b>
                  </TableCell>
                  <TableCell>
                    <b>Point</b>
                  </TableCell>
                  <TableCell>
                    <b>Redeemed At</b>
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
                  ?.map((redemption) => (
                    <TableRow key={redemption?._id}>
                      <TableCell>
                        <Box sx={{ mt: 2 }}>
                          <Card
                            key={redemption?.user?._id}
                            sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                          >
                            <img
                              src={redemption?.user?.user_avatar}
                              alt={redemption?.user?.user_name}
                              width="40"
                              height="40"
                              style={{ borderRadius: '50%', marginRight: '10px' }}
                            />
                            <Typography>{redemption?.user?.user_name}</Typography>
                          </Card>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ mt: 2 }}>
                          <Card
                            key={redemption?.gift?._id}
                            sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                          >
                            <img
                              src={redemption?.gift?.image}
                              alt={redemption?.gift?.name}
                              width="40"
                              height="40"
                              style={{ borderRadius: '50%', marginRight: '10px' }}
                            />
                            <Typography>{redemption?.gift?.name}</Typography>
                          </Card>
                        </Box>
                      </TableCell>
                      <TableCell>{redemption?.points_used}</TableCell>
                      <TableCell>
                        {new Date(redemption?.redeemed_at).toLocaleString('vi-VN')}
                      </TableCell>
                      <TableCell>
                        <Button
                          sx={{ minWidth: '80px', marginTop: '4px' }}
                          variant="contained"
                          color="primary"
                          onClick={() => handleContact(redemption)}
                        >
                          Contact
                        </Button>
                        <Button
                          sx={{ minWidth: '80px', marginTop: '4px', marginLeft: '8px' }}
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(redemption)}
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
          count={redemptions?.length}
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
