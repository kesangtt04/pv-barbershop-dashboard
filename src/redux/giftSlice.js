import { createSlice } from '@reduxjs/toolkit';

const giftSlice = createSlice({
  name: 'gift',
  initialState: {
    getAll: {
      gifts: null,
      isFetching: false,
      error: false,
    },
    create: {
      createdGift: null,
      isFetching: false,
      error: false,
    },
    update: {
      updatedGift: null,
      isFetching: false,
      error: false,
    },
    redeem: {
      redeemedGift: null,
      isFetching: false,
      error: false,
    },
    redemptions: {
      list: null,
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
    // Get all gifts
    getAllGiftsStart: (state) => {
      state.getAll.isFetching = true;
    },
    getAllGiftsSuccess: (state, action) => {
      state.getAll.isFetching = false;
      state.getAll.gifts = action.payload;
      state.getAll.error = false;
    },
    getAllGiftsFailure: (state) => {
      state.getAll.isFetching = false;
      state.getAll.error = true;
    },

    // Create gift
    createGiftStart: (state) => {
      state.create.isFetching = true;
    },
    createGiftSuccess: (state, action) => {
      state.create.isFetching = false;
      state.create.createdGift = action.payload;
      state.create.error = false;
    },
    createGiftFailure: (state) => {
      state.create.isFetching = false;
      state.create.error = true;
    },

    // Update gift
    updateGiftStart: (state) => {
      state.update.isFetching = true;
    },
    updateGiftSuccess: (state, action) => {
      state.update.isFetching = false;
      state.update.updatedGift = action.payload;
      state.update.error = false;
    },
    updateGiftFailure: (state) => {
      state.update.isFetching = false;
      state.update.error = true;
    },

    // Redeem gift
    redeemGiftStart: (state) => {
      state.redeem.isFetching = true;
    },
    redeemGiftSuccess: (state, action) => {
      state.redeem.isFetching = false;
      state.redeem.redeemedGift = action.payload;
      state.redeem.error = false;
    },
    redeemGiftFailure: (state) => {
      state.redeem.isFetching = false;
      state.redeem.error = true;
    },

    // Get user's redemptions
    getRedemptionsStart: (state) => {
      state.redemptions.isFetching = true;
    },
    getRedemptionsSuccess: (state, action) => {
      state.redemptions.isFetching = false;
      state.redemptions.list = action.payload;
      state.redemptions.error = false;
    },
    getRedemptionsFailure: (state) => {
      state.redemptions.isFetching = false;
      state.redemptions.error = true;
    },
    // Delete gift
    deleteGiftStart: (state) => {
      state.delete.isFetching = true;
      state.delete.success = false;
      state.delete.error = false;
    },
    deleteGiftSuccess: (state) => {
      state.delete.isFetching = false;
      state.delete.success = true;
      state.delete.error = false;
    },
    deleteGiftFailure: (state) => {
      state.delete.isFetching = false;
      state.delete.success = false;
      state.delete.error = true;
    },
  },
});

export const {
  getAllGiftsStart,
  getAllGiftsSuccess,
  getAllGiftsFailure,
  createGiftStart,
  createGiftSuccess,
  createGiftFailure,
  updateGiftStart,
  updateGiftSuccess,
  updateGiftFailure,
  redeemGiftStart,
  redeemGiftSuccess,
  redeemGiftFailure,
  getRedemptionsStart,
  getRedemptionsSuccess,
  getRedemptionsFailure,
  deleteGiftStart,
  deleteGiftFailure,
  deleteGiftSuccess,
} = giftSlice.actions;

export default giftSlice.reducer;
