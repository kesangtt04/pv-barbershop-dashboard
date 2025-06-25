import { createSlice } from '@reduxjs/toolkit';

const statisticSlice = createSlice({
  name: 'statistic',
  initialState: {
    getBarberRating: {
      rating: null,
      isFetching: false,
      error: false,
    },
    getBarbersRating: {
      ratings: null,
      isFetching: false,
      error: false,
    },
    getBarberIncome: {
      income: null,
      isFetching: false,
      error: false,
    },
    getBarbersIncome: {
      income: null,
      isFetching: false,
      error: false,
    },
    getSystemIncomeInMonth: {
      income: null,
      isFetching: false,
      error: false,
    },
    getSystemIncomeInDuration: {
      income: null,
      isFetching: false,
      error: false,
    },
    getSystemIncome: {
      income: null,
      isFetching: false,
      error: false,
    },
    getSystemAppointment: {
      appointment: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    // getBarberRating
    getBarberRatingStart: (state) => {
      state.getBarberRating.isFetching = true;
    },
    getBarberRatingSuccess: (state, action) => {
      state.getBarberRating.isFetching = false;
      state.getBarberRating.rating = action.payload;
      state.getBarberRating.error = false;
    },
    getBarberRatingFailure: (state) => {
      state.getBarberRating.isFetching = false;
      state.getBarberRating.error = true;
    },

    // getBarbersRating
    getBarbersRatingStart: (state) => {
      state.getBarbersRating.isFetching = true;
    },
    getBarbersRatingSuccess: (state, action) => {
      state.getBarbersRating.isFetching = false;
      state.getBarbersRating.ratings = action.payload;
      state.getBarbersRating.error = false;
    },
    getBarbersRatingFailure: (state) => {
      state.getBarbersRating.isFetching = false;
      state.getBarbersRating.error = true;
    },

    // getBarberIncome
    getBarberIncomeStart: (state) => {
      state.getBarberIncome.isFetching = true;
    },
    getBarberIncomeSuccess: (state, action) => {
      state.getBarberIncome.isFetching = false;
      state.getBarberIncome.income = action.payload;
      state.getBarberIncome.error = false;
    },
    getBarberIncomeFailure: (state) => {
      state.getBarberIncome.isFetching = false;
      state.getBarberIncome.error = true;
    },

    // getBarbersIncome
    getBarbersIncomeStart: (state) => {
      state.getBarbersIncome.isFetching = true;
    },
    getBarbersIncomeSuccess: (state, action) => {
      state.getBarbersIncome.isFetching = false;
      state.getBarbersIncome.income = action.payload;
      state.getBarbersIncome.error = false;
    },
    getBarbersIncomeFailure: (state) => {
      state.getBarbersIncome.isFetching = false;
      state.getBarbersIncome.error = true;
    },

    // getSystemIncomeInMonth
    getSystemIncomeInMonthStart: (state) => {
      state.getSystemIncomeInMonth.isFetching = true;
    },
    getSystemIncomeInMonthSuccess: (state, action) => {
      state.getSystemIncomeInMonth.isFetching = false;
      state.getSystemIncomeInMonth.income = action.payload;
      state.getSystemIncomeInMonth.error = false;
    },
    getSystemIncomeInMonthFailure: (state) => {
      state.getSystemIncomeInMonth.isFetching = false;
      state.getSystemIncomeInMonth.error = true;
    },

    // getSystemIncomeInDuration
    getSystemIncomeInDurationStart: (state) => {
      state.getSystemIncomeInDuration.isFetching = true;
    },
    getSystemIncomeInDurationSuccess: (state, action) => {
      state.getSystemIncomeInDuration.isFetching = false;
      state.getSystemIncomeInDuration.income = action.payload;
      state.getSystemIncomeInDuration.error = false;
    },
    getSystemIncomeInDurationFailure: (state) => {
      state.getSystemIncomeInDuration.isFetching = false;
      state.getSystemIncomeInDuration.error = true;
    },

    // getSystemIncome
    getSystemIncomeStart: (state) => {
      state.getSystemIncome.isFetching = true;
    },
    getSystemIncomeSuccess: (state, action) => {
      state.getSystemIncome.isFetching = false;
      state.getSystemIncome.income = action.payload;
      state.getSystemIncome.error = false;
    },
    getSystemIncomeFailure: (state) => {
      state.getSystemIncome.isFetching = false;
      state.getSystemIncome.error = true;
    },

    // getSystemAppointment
    getSystemAppointmentStart: (state) => {
      state.getSystemAppointment.isFetching = true;
    },
    getSystemAppointmentSuccess: (state, action) => {
      state.getSystemAppointment.isFetching = false;
      state.getSystemAppointment.appointment = action.payload;
      state.getSystemAppointment.error = false;
    },
    getSystemAppointmentFailure: (state) => {
      state.getSystemAppointment.isFetching = false;
      state.getSystemAppointment.error = true;
    },
  },
});

export const {
  getBarberRatingStart,
  getBarberRatingSuccess,
  getBarberRatingFailure,
  getBarbersRatingStart,
  getBarbersRatingSuccess,
  getBarbersRatingFailure,
  getBarberIncomeStart,
  getBarberIncomeSuccess,
  getBarberIncomeFailure,
  getBarbersIncomeStart,
  getBarbersIncomeSuccess,
  getBarbersIncomeFailure,
  getSystemIncomeInMonthStart,
  getSystemIncomeInMonthSuccess,
  getSystemIncomeInMonthFailure,
  getSystemIncomeInDurationStart,
  getSystemIncomeInDurationSuccess,
  getSystemIncomeInDurationFailure,
  getSystemIncomeStart,
  getSystemIncomeSuccess,
  getSystemIncomeFailure,
  getSystemAppointmentStart,
  getSystemAppointmentSuccess,
  getSystemAppointmentFailure,
} = statisticSlice.actions;

export default statisticSlice.reducer;
