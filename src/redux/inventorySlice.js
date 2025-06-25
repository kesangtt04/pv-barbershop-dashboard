import { createSlice } from "@reduxjs/toolkit";

const inventorySlide = createSlice({
  name: "inventory",
  initialState: {
    get: {
      inventory: null,
      isFetching: false,
      error: false,
    },
    getAll: {
      inventorys: null,
      isFetching: false,
      error: false,
    },
    create: {
      createdInventory: null,
      isFetching: false,
      error: false,
    },
    update: {
      updatedInventory: null,
      isFetching: false,
      error: false,
    },
    delete: {
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    getInventoryStart: (state) => {
      state.get.isFetching = true;
    },
    getInventorySuccess: (state, action) => {
      state.get.isFetching = false;
      state.get.inventory = action.payload;
      state.get.error = false;
    },
    getInventoryFailure: (state) => {
      state.get.isFetching = false;
      state.get.error = true;
    },
    getAllInventorysStart: (state) => {
      state.getAll.isFetching = true;
    },
    getAllInventorysSuccess: (state, action) => {
      state.getAll.isFetching = false;
      state.getAll.inventorys = action.payload;
      state.getAll.error = false;
    },
    getAllInventorysFailure: (state) => {
      state.getAll.isFetching = false;
      state.getAll.error = true;
    },
    createInventoryStart: (state) => {
      state.create.isFetching = true;
    },
    createInventorySuccess: (state, action) => {
      state.create.isFetching = false;
      state.create.createdInventory = action.payload;
      state.create.error = false;
    },
    createInventoryFailure: (state) => {
      state.create.isFetching = false;
      state.create.error = true;
    },
    updateInventoryStart: (state) => {
      state.update.isFetching = true;
    },
    updateInventorySuccess: (state, action) => {
      state.update.isFetching = false;
      state.update.updatedInventory = action.payload;
      state.update.error = false;
    },
    updateInventoryFailure: (state) => {
      state.update.isFetching = false;
      state.update.error = true;
    },
    deleteInventoryStart: (state) => {
      state.delete.isFetching = true;
    },
    deleteInventorySuccess: (state) => {
      state.delete.isFetching = false;
      state.delete.error = false;
    },
    deleteInventoryFailure: (state) => {
      state.delete.isFetching = false;
      state.delete.error = true;
    },
  },
});

export const {
  getInventoryStart,
  getInventorySuccess,
  getInventoryFailure,
  getAllInventorysStart,
  getAllInventorysSuccess,
  getAllInventorysFailure,
  createInventoryStart,
  createInventorySuccess,
  createInventoryFailure,
  updateInventoryStart,
  updateInventorySuccess,
  updateInventoryFailure,
  deleteInventoryStart,
  deleteInventorySuccess,
  deleteInventoryFailure,
} = inventorySlide.actions;
export default inventorySlide.reducer;
