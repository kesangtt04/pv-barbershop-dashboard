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
  Avatar,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';
// import { getSalary } from 'src/redux/apiRequest';

// PDF export
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getAllSalary } from 'src/redux/apiRequest';

export function SalaryView() {
  const currentUser = useSelector((state: any) => state.user.signin.currentUser);
  const accessToken = Cookie.get('accessToken');
  const userID = Cookie.get('_id');
  const userName = Cookie.get('user_name');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const table = useTable();
  const [salaries, setSalarys] = useState<any[]>([]);
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1); // JS: 0-based month
  const [year, setYear] = useState(today.getFullYear());

  const handleGetSalary = async (selectedMonth = month, selectedYear = year) => {
    const data = await getAllSalary(selectedMonth, selectedYear, dispatch);
    setSalarys(data?.metadata);
  };

  const capitalizeFirstLetter = (text: string) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleExport = (staff: any) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(24);
    doc.setTextColor(33, 37, 41);
    doc.setFont('helvetica', 'bold');
    doc.text('SALARY SLIP', 80, 20);

    // Company Info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('PV Barber Shop.', 14, 30);
    doc.text('District 7', 14, 35);
    doc.text('Ho Chi Minh City', 14, 40);

    // Staff Info Box
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(230, 230, 230);
    doc.rect(14, 50, 180, 10, 'F');
    doc.text('STAFF INFORMATION', 16, 57);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    let y = 70;
    doc.text(`Name:`, 16, y);
    doc.text(`${staff?.user_name || 'N/A'}`, 60, y);

    y += 10;
    doc.text(`Role:`, 16, y);
    doc.text(`${capitalizeFirstLetter(staff?.role) || 'N/A'}`, 60, y);

    y += 10;
    doc.text(`Salary:`, 16, y);
    doc.text(`${staff?.salary?.toLocaleString('vi-VN')} VND`, 60, y);

    y += 10;
    doc.text(`Generated on:`, 16, y);
    doc.text(`${new Date().toLocaleDateString('vi-VN')}`, 60, y);

    // Signature
    const signatureY = y + 30;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.text('Authorized Signature', 14, signatureY);
    doc.setFontSize(16);
    doc.text(userName || 'PV Admin', 14, signatureY + 10);

    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 87, 34);
    doc.text('CONFIDENTIAL', 14, 275);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(
      'This salary slip is confidential and intended solely for the staff mentioned above.',
      14,
      280
    );

    doc.save(`salary_${staff?.user_name || 'staff'}.pdf`);
  };

  useEffect(() => {
    handleGetSalary();
  }, [month, year]);

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
          Salary
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            label="Month"
            type="number"
            size="small"
            inputProps={{ min: 1, max: 12 }}
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          />
          <TextField
            label="Year"
            type="number"
            size="small"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
          <Button variant="outlined" onClick={() => handleGetSalary()}>
            Filter
          </Button>
        </Box>
      </Box>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ display: 'flex', justifyContent: 'center' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Avatar</b>
                  </TableCell>
                  <TableCell>
                    <b>Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Role</b>
                  </TableCell>
                  <TableCell>
                    <b>Salary (VND)</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salaries
                  ?.slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  ?.map((staff) => (
                    <TableRow key={staff?.user_id}>
                      <TableCell>
                        <Avatar alt={staff?.user_name} src={staff?.user_avatar} />
                      </TableCell>
                      <TableCell>{staff?.user_name}</TableCell>
                      <TableCell>{capitalizeFirstLetter(staff?.role)}</TableCell>
                      <TableCell>{staff?.salary?.toLocaleString('vi-VN')} VND</TableCell>
                      <TableCell>
                        <Button
                          sx={{ minWidth: '80px', marginTop: '4px' }}
                          variant="contained"
                          color="primary"
                          onClick={() => handleExport(staff)}
                        >
                          Export
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
          count={salaries?.length}
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
