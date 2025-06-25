import { createSlice } from '@reduxjs/toolkit';

const invoiceSlide = createSlice({
  name: 'invoice',
  initialState: {
    get: {
      invoice: null,
      isFetching: false,
      error: false,
    },
    getAll: {
      invoices: null,
      isFetching: false,
      error: false,
    },
    create: {
      createdInvoice: null,
      isFetching: false,
      error: false,
    },
    update: {
      updatedInvoice: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    getInvoiceStart: (state) => {
      state.get.isFetching = true;
    },
    getInvoiceSuccess: (state, action) => {
      state.get.isFetching = false;
      state.get.invoice = action.payload;
      state.get.error = false;
    },
    getInvoiceFailure: (state) => {
      state.get.isFetching = false;
      state.get.error = true;
    },
    getAllInvoicesStart: (state) => {
      state.getAll.isFetching = true;
    },
    getAllInvoicesSuccess: (state, action) => {
      state.getAll.isFetching = false;
      state.getAll.invoices = action.payload;
      state.getAll.error = false;
    },
    getAllInvoicesFailure: (state) => {
      state.getAll.isFetching = false;
      state.getAll.error = true;
    },
    createInvoiceStart: (state) => {
      state.create.isFetching = true;
    },
    createInvoiceSuccess: (state, action) => {
      state.create.isFetching = false;
      state.create.createdInvoice = action.payload;
      state.create.error = false;
    },
    createInvoiceFailure: (state) => {
      state.create.isFetching = false;
      state.create.error = true;
    },
    updateInvoiceStart: (state) => {
      state.update.isFetching = true;
    },
    updateInvoiceSuccess: (state, action) => {
      state.update.isFetching = false;
      state.update.updatedInvoice = action.payload;
      state.update.error = false;
    },
    updateInvoiceFailure: (state) => {
      state.update.isFetching = false;
      state.update.error = true;
    },
  },
});

export const {
  getInvoiceStart,
  getInvoiceSuccess,
  getInvoiceFailure,
  getAllInvoicesStart,
  getAllInvoicesSuccess,
  getAllInvoicesFailure,
  createInvoiceStart,
  createInvoiceSuccess,
  createInvoiceFailure,
  updateInvoiceStart,
  updateInvoiceSuccess,
  updateInvoiceFailure,
} = invoiceSlide.actions;
export default invoiceSlide.reducer;
