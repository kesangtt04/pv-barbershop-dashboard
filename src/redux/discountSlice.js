import { createSlice } from '@reduxjs/toolkit';

const discountSlice = createSlice({
  name: 'discount',
  initialState: {
    getAll: {
      discounts: null,
      isFetching: false,
      error: false,
    },
    create: {
      createdDiscount: null,
      isFetching: false,
      error: false,
    },
    update: {
      updatedDiscount: null,
      isFetching: false,
      error: false,
    },
    apply: {
      appliedDiscount: null,
      isFetching: false,
      error: false,
    },
    userDiscounts: {
      discounts: null,
      isFetching: false,
      error: false,
    },
    delete: {
      isFetching: false,
      success: false,
      error: false,
    },
  },
  reducers: {
    // Get all discounts
    getAllDiscountsStart: (state) => {
      state.getAll.isFetching = true;
    },
    getAllDiscountsSuccess: (state, action) => {
      state.getAll.isFetching = false;
      state.getAll.discounts = action.payload;
      state.getAll.error = false;
    },
    getAllDiscountsFailure: (state) => {
      state.getAll.isFetching = false;
      state.getAll.error = true;
    },

    // Create discount
    createDiscountStart: (state) => {
      state.create.isFetching = true;
    },
    createDiscountSuccess: (state, action) => {
      state.create.isFetching = false;
      state.create.createdDiscount = action.payload;
      state.create.error = false;
    },
    createDiscountFailure: (state) => {
      state.create.isFetching = false;
      state.create.error = true;
    },

    // Update discount
    updateDiscountStart: (state) => {
      state.update.isFetching = true;
    },
    updateDiscountSuccess: (state, action) => {
      state.update.isFetching = false;
      state.update.updatedDiscount = action.payload;
      state.update.error = false;
    },
    updateDiscountFailure: (state) => {
      state.update.isFetching = false;
      state.update.error = true;
    },

    // Apply discount
    applyDiscountStart: (state) => {
      state.apply.isFetching = true;
    },
    applyDiscountSuccess: (state, action) => {
      state.apply.isFetching = false;
      state.apply.appliedDiscount = action.payload;
      state.apply.error = false;
    },
    applyDiscountFailure: (state) => {
      state.apply.isFetching = false;
      state.apply.error = true;
    },

    // Get user discounts
    getUserDiscountsStart: (state) => {
      state.userDiscounts.isFetching = true;
    },
    getUserDiscountsSuccess: (state, action) => {
      state.userDiscounts.isFetching = false;
      state.userDiscounts.discounts = action.payload;
      state.userDiscounts.error = false;
    },
    getUserDiscountsFailure: (state) => {
      state.userDiscounts.isFetching = false;
      state.userDiscounts.error = true;
    },

    // Delete discount
    deleteDiscountStart: (state) => {
      state.delete.isFetching = true;
      state.delete.success = false;
      state.delete.error = false;
    },
    deleteDiscountSuccess: (state) => {
      state.delete.isFetching = false;
      state.delete.success = true;
      state.delete.error = false;
    },
    deleteDiscountFailure: (state) => {
      state.delete.isFetching = false;
      state.delete.success = false;
      state.delete.error = true;
    },
  },
});

export const {
  getAllDiscountsStart,
  getAllDiscountsSuccess,
  getAllDiscountsFailure,
  createDiscountStart,
  createDiscountSuccess,
  createDiscountFailure,
  updateDiscountStart,
  updateDiscountSuccess,
  updateDiscountFailure,
  applyDiscountStart,
  applyDiscountSuccess,
  applyDiscountFailure,
  getUserDiscountsStart,
  getUserDiscountsSuccess,
  getUserDiscountsFailure,
  deleteDiscountStart,
  deleteDiscountFailure,
  deleteDiscountSuccess,
} = discountSlice.actions;

export default discountSlice.reducer;
