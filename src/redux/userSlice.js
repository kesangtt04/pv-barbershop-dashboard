import { createSlice } from '@reduxjs/toolkit';

const userSlide = createSlice({
  name: 'user',
  initialState: {
    signin: {
      currentUser: null,
      isFetching: false,
      error: false,
    },
    signup: {
      isFetching: false,
      error: false,
      success: false,
    },
    logout: {
      isFetching: false,
      error: false,
    },
    find: {
      foundUser: null,
      isFetching: false,
      error: false,
    },
    findAll: {
      foundUsers: null,
      isFetching: false,
      error: false,
    },
    findAllFree: {
      foundUsers: null,
      isFetching: false,
      error: false,
    },
    findAllReceptionist: {
      foundReceptionists: null,
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
    password: {
      success: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    userSigninStart: (state) => {
      state.signin.isFetching = true;
    },
    userSigninSuccess: (state, action) => {
      state.signin.isFetching = false;
      state.signin.currentUser = action.payload;
      state.signin.error = false;
    },
    userSigninFailure: (state) => {
      state.signin.isFetching = false;
      state.signin.error = true;
    },
    userSignupStart: (state) => {
      state.signup.isFetching = true;
    },
    userSignupSuccess: (state) => {
      state.signup.isFetching = false;
      state.signup.error = false;
      state.signup.success = true;
    },
    userSignupFailure: (state) => {
      state.signup.isFetching = false;
      state.signup.error = true;
      state.signup.success = false;
    },
    userLogoutStart: (state) => {
      state.signin.isFetching = true;
    },
    userLogoutSuccess: (state) => {
      state.signin.isFetching = false;
      state.signin.currentUser = null;
      state.signin.error = false;
    },
    userLogoutFailure: (state) => {
      state.signin.isFetching = false;
      state.signin.error = true;
    },
    findUserStart: (state) => {
      state.find.isFetching = true;
    },
    findUserSuccess: (state, action) => {
      state.find.isFetching = false;
      state.find.foundUser = action.payload;
      state.find.error = false;
    },
    findUserFailure: (state) => {
      state.find.isFetching = false;
      state.find.error = true;
    },
    findAllUsersStart: (state) => {
      state.findAll.isFetching = true;
    },
    findAllUsersSuccess: (state, action) => {
      state.findAll.isFetching = false;
      state.findAll.foundUsers = action.payload;
      state.findAll.error = false;
    },
    findAllUsersFailure: (state) => {
      state.findAll.isFetching = false;
      state.findAll.error = true;
    },
    findAllReceptionistStart: (state) => {
      state.findAllReceptionist.isFetching = true;
    },
    findAllReceptionistSuccess: (state, action) => {
      state.findAllReceptionist.isFetching = false;
      state.findAllReceptionist.foundReceptionists = action.payload;
      state.findAllReceptionist.error = false;
    },
    findAllReceptionistFailure: (state) => {
      state.findAllReceptionist.isFetching = false;
      state.findAllReceptionist.error = true;
    },
    findAllFreeBarberStart: (state) => {
      state.findAllFree.isFetching = true;
    },
    findAllFreeBarberSuccess: (state, action) => {
      state.findAllFree.isFetching = false;
      state.findAllFree.foundUsers = action.payload;
      state.findAllFree.error = false;
    },
    findAllFreeBarberFailure: (state) => {
      state.findAllFree.isFetching = false;
      state.findAllFree.error = true;
    },
    updateUserStart: (state) => {
      state.update.isFetching = true;
    },
    updateUserSuccess: (state) => {
      state.update.isFetching = false;
      state.update.error = false;
    },
    updateUserFailure: (state) => {
      state.update.isFetching = false;
      state.update.error = true;
    },
    deleteUserStart: (state) => {
      state.delete.isFetching = true;
    },
    deleteUserSuccess: (state) => {
      state.delete.isFetching = false;
      state.delete.error = false;
    },
    deleteUserFailure: (state) => {
      state.delete.isFetching = false;
      state.delete.error = true;
    },
    changePasswordStart: (state) => {
      state.password.isFetching = true;
    },
    changePasswordSuccess: (state, action) => {
      state.password.success = action.payload;
      state.password.isFetching = false;
      state.password.error = false;
    },
    changePasswordFailure: (state) => {
      state.password.isFetching = false;
      state.password.error = true;
    },
  },
});

export const {
  userSigninStart,
  userSigninSuccess,
  userSigninFailure,
  userSignupStart,
  userSignupSuccess,
  userSignupFailure,
  userLogoutStart,
  userLogoutSuccess,
  userLogoutFailure,
  findUserStart,
  findUserSuccess,
  findUserFailure,
  findAllUsersStart,
  findAllUsersSuccess,
  findAllUsersFailure,
  findAllFreeBarberStart,
  findAllFreeBarberSuccess,
  findAllFreeBarberFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  findAllReceptionistStart,
  findAllReceptionistSuccess,
  findAllReceptionistFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFailure,
} = userSlide.actions;
export default userSlide.reducer;
