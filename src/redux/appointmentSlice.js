import { createSlice } from '@reduxjs/toolkit';

const appointmentSlide = createSlice({
  name: 'appointment',
  initialState: {
    find: {
      foundAppointment: null,
      isFetching: false,
      error: false,
    },
    findAll: {
      foundAppointments: null,
      isFetching: false,
      error: false,
    },
    create: {
      createdAppointment: null,
      isFetching: false,
      error: false,
    },
    update: {
      isFetching: false,
      error: false,
    },
    delete: {
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    createAppointmentStart: (state) => {
      state.create.isFetching = true;
    },
    createAppointmentSuccess: (state, action) => {
      state.create.isFetching = false;
      state.create.createdAppointment = action.payload;
      state.create.error = false;
    },
    createAppointmentFailure: (state) => {
      state.create.isFetching = false;
      state.create.error = true;
    },
    findAppointmentStart: (state) => {
      state.find.isFetching = true;
    },
    findAppointmentSuccess: (state, action) => {
      state.find.isFetching = false;
      state.find.foundAppointment = action.payload;
      state.find.error = false;
    },
    findAppointmentFailure: (state) => {
      state.find.isFetching = false;
      state.find.error = true;
    },
    findAllAppointmentsStart: (state) => {
      state.findAll.isFetching = true;
    },
    findAllAppointmentsSuccess: (state, action) => {
      state.findAll.isFetching = false;
      state.findAll.foundAppointments = action.payload;
      state.findAll.error = false;
    },
    findAllAppointmentsFailure: (state) => {
      state.findAll.isFetching = false;
      state.findAll.error = true;
    },
    updateAppointmentStart: (state) => {
      state.update.isFetching = true;
    },
    updateAppointmentSuccess: (state) => {
      state.update.isFetching = false;
      state.update.error = false;
    },
    updateAppointmentFailure: (state) => {
      state.update.isFetching = false;
      state.update.error = true;
    },
    deleteAppointmentStart: (state) => {
      state.delete.isFetching = true;
    },
    deleteAppointmentSuccess: (state) => {
      state.delete.isFetching = false;
      state.delete.error = false;
    },
    deleteAppointmentFailure: (state) => {
      state.delete.isFetching = false;
      state.delete.error = true;
    },
  },
});

export const {
  createAppointmentStart,
  createAppointmentFailure,
  createAppointmentSuccess,
  findAppointmentStart,
  findAppointmentSuccess,
  findAppointmentFailure,
  findAllAppointmentsStart,
  findAllAppointmentsSuccess,
  findAllAppointmentsFailure,
  updateAppointmentStart,
  updateAppointmentSuccess,
  updateAppointmentFailure,
  deleteAppointmentStart,
  deleteAppointmentSuccess,
  deleteAppointmentFailure,
} = appointmentSlide.actions;
export default appointmentSlide.reducer;
