import { createSlice } from "@reduxjs/toolkit";

const commentSlide = createSlice({
  name: "comment",
  initialState: {
    getParent: {
      comments: null,
      isFetching: false,
      error: false,
    },
    getChildren: {
      comments: null,
      isFetching: false,
      error: false,
    },
    create: {
      createdComment: null,
      isFetching: false,
      error: false,
    },
    update: {
      updatedComment: null,
      isFetching: false,
      error: false,
    },
    delete: {
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    getParentStart: (state) => {
      state.getParent.isFetching = true;
    },
    getParentSuccess: (state, action) => {
      state.getParent.isFetching = false;
      state.getParent.comments = action.payload;
      state.getParent.error = false;
    },
    getParentFailure: (state) => {
      state.getParent.isFetching = false;
      state.getParent.error = true;
    },
    getChildrenStart: (state) => {
      state.getChildren.isFetching = true;
    },
    getChildrenSuccess: (state, action) => {
      state.getChildren.isFetching = false;
      state.getChildren.comments = action.payload;
      state.getChildren.error = false;
    },
    getChildrenFailure: (state) => {
      state.getChildren.isFetching = false;
      state.getChildren.error = true;
    },
    createCommentStart: (state) => {
      state.create.isFetching = true;
    },
    createCommentSuccess: (state, action) => {
      state.create.isFetching = false;
      state.create.createdComment = action.payload;
      state.create.error = false;
    },
    createCommentFailure: (state) => {
      state.create.isFetching = false;
      state.create.error = true;
    },
    updateCommentStart: (state) => {
      state.update.isFetching = true;
    },
    updateCommentSuccess: (state, action) => {
      state.update.isFetching = false;
      state.update.updatedComment = action.payload;
      state.update.error = false;
    },
    updateCommentFailure: (state) => {
      state.update.isFetching = false;
      state.update.error = true;
    },
    deleteCommentStart: (state) => {
      state.delete.isFetching = true;
    },
    deleteCommentSuccess: (state) => {
      state.delete.isFetching = false;
      state.delete.error = false;
    },
    deleteCommentFailure: (state) => {
      state.delete.isFetching = false;
      state.delete.error = true;
    },
  },
});

export const {
  getParentStart,
  getParentSuccess,
  getParentFailure,
  getChildrenStart,
  getChildrenSuccess,
  getChildrenFailure,
  createCommentStart,
  createCommentSuccess,
  createCommentFailure,
  updateCommentStart,
  updateCommentSuccess,
  updateCommentFailure,
  deleteCommentStart,
  deleteCommentSuccess,
  deleteCommentFailure,
} = commentSlide.actions;
export default commentSlide.reducer;
