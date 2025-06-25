import { createSlice } from "@reduxjs/toolkit";

const serviceSlide = createSlice({
  name: "service",
  initialState: {
    get: {
      service: null,
      isFetching: false,
      error: false,
    },
    getAll: {
      services: null,
      isFetching: false,
      error: false,
    },
    create: {
      createdService: null,
      isFetching: false,
      error: false,
    },
    update: {
      updatedService: null,
      isFetching: false,
      error: false,
    },
    delete: {
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    getServiceStart: (state) => {
      state.get.isFetching = true;
    },
    getServiceSuccess: (state, action) => {
      state.get.isFetching = false;
      state.get.service = action.payload;
      state.get.error = false;
    },
    getServiceFailure: (state) => {
      state.get.isFetching = false;
      state.get.error = true;
    },
    getAllServicesStart: (state) => {
      state.getAll.isFetching = true;
    },
    getAllServicesSuccess: (state, action) => {
      state.getAll.isFetching = false;
      state.getAll.services = action.payload;
      state.getAll.error = false;
    },
    getAllServicesFailure: (state) => {
      state.getAll.isFetching = false;
      state.getAll.error = true;
    },
    createServiceStart: (state) => {
      state.create.isFetching = true;
    },
    createServiceSuccess: (state, action) => {
      state.create.isFetching = false;
      state.create.createdService = action.payload;
      state.create.error = false;
    },
    createServiceFailure: (state) => {
      state.create.isFetching = false;
      state.create.error = true;
    },
    updateServiceStart: (state) => {
      state.update.isFetching = true;
    },
    updateServiceSuccess: (state, action) => {
      state.update.isFetching = false;
      state.update.updatedService = action.payload;
      state.update.error = false;
    },
    updateServiceFailure: (state) => {
      state.update.isFetching = false;
      state.update.error = true;
    },
    deleteServiceStart: (state) => {
      state.delete.isFetching = true;
    },
    deleteServiceSuccess: (state) => {
      state.delete.isFetching = false;
      state.delete.error = false;
    },
    deleteServiceFailure: (state) => {
      state.delete.isFetching = false;
      state.delete.error = true;
    },
  },
});

export const {
  getServiceStart,
  getServiceSuccess,
  getServiceFailure,
  getAllServicesStart,
  getAllServicesSuccess,
  getAllServicesFailure,
  createServiceStart,
  createServiceSuccess,
  createServiceFailure,
  updateServiceStart,
  updateServiceSuccess,
  updateServiceFailure,
  deleteServiceStart,
  deleteServiceSuccess,
  deleteServiceFailure,
} = serviceSlide.actions;
export default serviceSlide.reducer;
