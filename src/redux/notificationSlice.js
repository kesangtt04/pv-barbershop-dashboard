import { createSlice } from "@reduxjs/toolkit";

const notificationSlide = createSlice({
  name: "notification",
  initialState: {
    getAll: {
      notifications: null,
      isFetching: false,
      error: false,
    },
    create: {
      createdNotification: null,
      isFetching: false,
      error: false,
    },
    update: {
      updatedNotification: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    getAllNotificationsStart: (state) => {
      state.getAll.isFetching = true;
    },
    getAllNotificationsSuccess: (state, action) => {
      state.getAll.isFetching = false;
      state.getAll.notifications = action.payload;
      state.getAll.error = false;
    },
    getAllNotificationsFailure: (state) => {
      state.getAll.isFetching = false;
      state.getAll.error = true;
    },
    createNotificationStart: (state) => {
      state.create.isFetching = true;
    },
    createNotificationSuccess: (state, action) => {
      state.create.isFetching = false;
      state.create.createdNotification = action.payload;
      state.create.error = false;
    },
    createNotificationFailure: (state) => {
      state.create.isFetching = false;
      state.create.error = true;
    },
    updateNotificationStart: (state) => {
      state.update.isFetching = true;
    },
    updateNotificationSuccess: (state, action) => {
      state.update.isFetching = false;
      state.update.updatedNotification = action.payload;
      state.update.error = false;
    },
    updateNotificationFailure: (state) => {
      state.update.isFetching = false;
      state.update.error = true;
    },
  },
});

export const {
  getAllNotificationsStart,
  getAllNotificationsSuccess,
  getAllNotificationsFailure,
  createNotificationStart,
  createNotificationSuccess,
  createNotificationFailure,
  updateNotificationStart,
  updateNotificationSuccess,
  updateNotificationFailure,
} = notificationSlide.actions;
export default notificationSlide.reducer;
