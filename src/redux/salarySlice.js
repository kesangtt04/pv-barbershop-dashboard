import { createSlice } from '@reduxjs/toolkit';

const salarySlice = createSlice({
  name: 'salary',
  initialState: {
    getAll: {
      salary: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    getAllSalaryStart: (state) => {
      state.getAll.isFetching = true;
    },
    getAllSalarySuccess: (state, action) => {
      state.getAll.isFetching = false;
      state.getAll.salary = action.payload;
      state.getAll.error = false;
    },
    getAllSalaryFailure: (state) => {
      state.getAll.isFetching = false;
      state.getAll.error = true;
    },
  },
});

export const { getAllSalaryStart, getAllSalarySuccess, getAllSalaryFailure } = salarySlice.actions;

export default salarySlice.reducer;
