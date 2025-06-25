import { createSlice } from "@reduxjs/toolkit";

const sliderSlide = createSlice({
  name: "slider",
  initialState: {
    get: {
      slider: null,
      isFetching: false,
      error: false,
    },
    getAll: {
      sliders: null,
      isFetching: false,
      error: false,
    },
    getActive: {
      sliders: null,
      isFetching: false,
      error: false,
    },
    getCollections: {
      collections: null,
      isFetching: false,
      error: false,
    },
    getByCollection: {
      sliders: null,
      isFetching: false,
      error: false,
    },
    create: {
      createdSlider: null,
      isFetching: false,
      error: false,
    },
    update: {
      updatedSlider: null,
      isFetching: false,
      error: false,
    },
    toggle: {
      updatedSlider: null,
      isFetching: false,
      error: false,
    },
    delete: {
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    getSliderStart: (state) => {
      state.get.isFetching = true;
    },
    getSliderSuccess: (state, action) => {
      state.get.isFetching = false;
      state.get.slider = action.payload;
      state.get.error = false;
    },
    getSliderFailure: (state) => {
      state.get.isFetching = false;
      state.get.error = true;
    },
    getAllSlidersStart: (state) => {
      state.getAll.isFetching = true;
    },
    getAllSlidersSuccess: (state, action) => {
      state.getAll.isFetching = false;
      state.getAll.sliders = action.payload;
      state.getAll.error = false;
    },
    getAllSlidersFailure: (state) => {
      state.getAll.isFetching = false;
      state.getAll.error = true;
    },
    getActiveSlidersStart: (state) => {
      state.getActive.isFetching = true;
    },
    getActiveSlidersSuccess: (state, action) => {
      state.getActive.isFetching = false;
      state.getActive.sliders = action.payload;
      state.getActive.error = false;
    },
    getActiveSlidersFailure: (state) => {
      state.getActive.isFetching = false;
      state.getActive.error = true;
    },
    getCollectionsStart: (state) => {
      state.getCollections.isFetching = true;
    },
    getCollectionsSuccess: (state, action) => {
      state.getCollections.isFetching = false;
      state.getCollections.collections = action.payload;
      state.getCollections.error = false;
    },
    getCollectionsFailure: (state) => {
      state.getCollections.isFetching = false;
      state.getCollections.error = true;
    },
    getByCollectionStart: (state) => {
      state.getByCollection.isFetching = true;
    },
    getByCollectionSuccess: (state, action) => {
      state.getByCollection.isFetching = false;
      state.getByCollection.sliders = action.payload;
      state.getByCollection.error = false;
    },
    getByCollectionFailure: (state) => {
      state.getByCollection.isFetching = false;
      state.getByCollection.error = true;
    },
    createSliderStart: (state) => {
      state.create.isFetching = true;
    },
    createSliderSuccess: (state, action) => {
      state.create.isFetching = false;
      state.create.createdSlider = action.payload;
      state.create.error = false;
    },
    createSliderFailure: (state) => {
      state.create.isFetching = false;
      state.create.error = true;
    },
    updateSliderStart: (state) => {
      state.update.isFetching = true;
    },
    updateSliderSuccess: (state, action) => {
      state.update.isFetching = false;
      state.update.updatedSlider = action.payload;
      state.update.error = false;
    },
    updateSliderFailure: (state) => {
      state.update.isFetching = false;
      state.update.error = true;
    },
    toggleSliderStart: (state) => {
      state.toggle.isFetching = true;
    },
    toggleSliderSuccess: (state, action) => {
      state.toggle.isFetching = false;
      state.toggle.updatedSlider = action.payload;
      state.toggle.error = false;
    },
    toggleSliderFailure: (state) => {
      state.toggle.isFetching = false;
      state.toggle.error = true;
    },
    deleteSliderStart: (state) => {
      state.delete.isFetching = true;
    },
    deleteSliderSuccess: (state) => {
      state.delete.isFetching = false;
      state.delete.error = false;
    },
    deleteSliderFailure: (state) => {
      state.delete.isFetching = false;
      state.delete.error = true;
    },
  },
});

export const {
  getSliderStart,
  getSliderSuccess,
  getSliderFailure,
  getAllSlidersStart,
  getAllSlidersSuccess,
  getAllSlidersFailure,
  getActiveSlidersStart,
  getActiveSlidersSuccess,
  getActiveSlidersFailure,
  getCollectionsStart,
  getCollectionsSuccess,
  getCollectionsFailure,
  getByCollectionStart,
  getByCollectionSuccess,
  getByCollectionFailure,
  createSliderStart,
  createSliderSuccess,
  createSliderFailure,
  updateSliderStart,
  updateSliderSuccess,
  updateSliderFailure,
  toggleSliderStart,
  toggleSliderSuccess,
  toggleSliderFailure,
  deleteSliderStart,
  deleteSliderSuccess,
  deleteSliderFailure,
} = sliderSlide.actions;
export default sliderSlide.reducer;
