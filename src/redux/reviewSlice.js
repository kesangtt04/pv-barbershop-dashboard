import { createSlice } from "@reduxjs/toolkit";

const reviewSlide = createSlice({
  name: "review",
  initialState: {
    get: {
      review: null,
      isFetching: false,
      error: false,
    },
    getAll: {
      reviews: null,
      isFetching: false,
      error: false,
    },
    create: {
      createdReview: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    getReviewStart: (state) => {
      state.get.isFetching = true;
    },
    getReviewSuccess: (state, action) => {
      state.get.isFetching = false;
      state.get.review = action.payload;
      state.get.error = false;
    },
    getReviewFailure: (state) => {
      state.get.isFetching = false;
      state.get.error = true;
    },
    getAllReviewsStart: (state) => {
      state.getAll.isFetching = true;
    },
    getAllReviewsSuccess: (state, action) => {
      state.getAll.isFetching = false;
      state.getAll.reviews = action.payload;
      state.getAll.error = false;
    },
    getAllReviewsFailure: (state) => {
      state.getAll.isFetching = false;
      state.getAll.error = true;
    },
    createReviewStart: (state) => {
      state.create.isFetching = true;
    },
    createReviewSuccess: (state, action) => {
      state.create.isFetching = false;
      state.create.createdReview = action.payload;
      state.create.error = false;
    },
    createReviewFailure: (state) => {
      state.create.isFetching = false;
      state.create.error = true;
    },
  },
});

export const {
  getReviewStart,
  getReviewSuccess,
  getReviewFailure,
  getAllReviewsStart,
  getAllReviewsSuccess,
  getAllReviewsFailure,
  createReviewStart,
  createReviewSuccess,
  createReviewFailure,
} = reviewSlide.actions;
export default reviewSlide.reducer;
