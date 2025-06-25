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
import { getAllInvoices } from 'src/redux/apiRequest';

// PDF export
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function InvoiceView() {
  const currentUser = useSelector((state: any) => state.user.signin.currentUser);
  const accessToken = Cookie.get('accessToken');
  const userID = Cookie.get('_id');
  const userName = Cookie.get('user_name');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const table = useTable();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const handleGetInvoice = async () => {
    const data = await getAllInvoices(true, dispatch);
    console.log(data);
    setInvoices(data);
  };
  const capitalizeFirstLetter = (text: string) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleExport = (invoice: any) => {
    const doc = new jsPDF();

    // Title: INVOICE
    doc.setFontSize(24);
    doc.setTextColor(33, 37, 41);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 14, 20);

    // Company Info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('PV Barber Shop.', 14, 30);
    doc.text('District 7', 14, 35);
    doc.text('Ho Chi Minh City', 14, 40);

    // BILL TO
    const customer = invoice?.appointment?.customer;
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO', 14, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(`${customer?.user_name || invoice?.appointment?.customer_name || ''}`, 14, 60);
    doc.text(`${customer?.user_phone || invoice?.appointment?.phone_number || ''}`, 14, 65);
    doc.text(`${customer?.user_email || ''}`, 14, 70);

    // INVOICE DETAILS
    const rightCol = 130;
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', rightCol, 30);
    doc.text('INVOICE DATE', rightCol, 40);
    doc.text('DUE DATE', rightCol, 50);

    doc.setFont('helvetica', 'normal');
    doc.text(invoice?._id || 'N/A', rightCol + 30, 30);
    doc.text(new Date(invoice?.createdAt).toLocaleDateString('vi-VN'), rightCol + 30, 40);
    doc.text(
      new Date(invoice?.appointment?.appointment_end).toLocaleDateString('vi-VN'),
      rightCol + 30,
      50
    );

    // Table Header
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(230, 230, 230);
    doc.rect(14, 80, 180, 10, 'F');
    doc.text('QTY', 16, 87);
    doc.text('DESCRIPTION', 35, 87);
    doc.text('UNIT PRICE', 120, 87);
    doc.text('AMOUNT', 165, 87);

    // Table Body
    doc.setFont('helvetica', 'normal');
    let startY = 95;
    let total = 0;

    invoice?.appointment?.service?.forEach((item: any) => {
      const price = item?.service_price || 0;
      total += price;

      doc.text('1', 16, startY);
      doc.text(item?.service_name || 'N/A', 35, startY);
      doc.text(`${price.toLocaleString('vi-VN')} VND`, 120, startY);
      doc.text(`${price.toLocaleString('vi-VN')} VND`, 165, startY);
      startY += 10;
    });

    // Subtotal, Tax, Total
    const subtotalY = startY + 10;
    const tax = 0; // hoặc tự tính nếu có thuế
    doc.text('Subtotal', 120, subtotalY);
    doc.text(`${total.toLocaleString('vi-VN')} VND`, 188, subtotalY, {
      align: 'right',
    });

    doc.text('Sales Tax', 120, subtotalY + 8);
    doc.text(`${tax.toLocaleString('vi-VN')} VND`, 188, subtotalY + 8, {
      align: 'right',
    });

    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL', 120, subtotalY + 16);
    doc.text(`${invoice?.total_amount?.toLocaleString('vi-VN')} VND`, 188, subtotalY + 16, {
      align: 'right',
    });

    // Signature
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.text('Authorized Signature', 14, subtotalY + 40);
    doc.setFontSize(16);
    doc.text(userName, 14, subtotalY + 50);

    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 87, 34);
    doc.text('TERMS & CONDITIONS', 14, 270);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(
      'Should you have any inquiries or issues regarding this invoice, please do not hesitate to contact us.',
      14,
      275
    );

    // Save
    doc.save(`invoice_${invoice?._id}.pdf`);
  };

  useEffect(() => {
    handleGetInvoice();
  }, []);

  const filteredData = invoices.filter((d) =>
    d.appointment.customer_name.toLowerCase().includes(search)
  );

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
          Invoices
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
                    <b>Price</b>
                  </TableCell>
                  <TableCell>
                    <b>Payment Method</b>
                  </TableCell>
                  <TableCell>
                    <b>Created At</b>
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
                  ?.map((invoice) => (
                    <TableRow key={invoice?._id}>
                      <TableCell>{invoice?.appointment.customer_name}</TableCell>
                      <TableCell>{invoice?.total_amount}</TableCell>
                      <TableCell>{capitalizeFirstLetter(invoice?.payment_method)}</TableCell>
                      <TableCell>{new Date(invoice?.createdAt).toLocaleString('vi-VN')}</TableCell>
                      <TableCell>
                        <Button
                          sx={{ minWidth: '80px', marginTop: '4px' }}
                          variant="contained"
                          color="primary"
                          onClick={() => handleExport(invoice)}
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
          count={invoices?.length}
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
