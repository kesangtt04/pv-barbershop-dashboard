import { createSlice } from "@reduxjs/toolkit";

const uploadSlide = createSlice({
  name: "upload",
  initialState: {
    image: {
      uploadedImage: null,
      isFetching: false,
      error: false,
    },
    audio: {
      uploadedAudio: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    uploadImageStart: (state) => {
      state.image.isFetching = true;
    },
    uploadImageSuccess: (state, action) => {
      state.image.isFetching = false;
      state.image.uploadedImage = action.payload;
      state.image.error = false;
    },
    uploadImageFailure: (state) => {
      state.image.isFetching = false;
      state.image.error = true;
    },
    uploadAudioStart: (state) => {
      state.audio.isFetching = true;
    },
    uploadAudioSuccess: (state, action) => {
      state.audio.isFetching = false;
      state.audio.uploadedAudio = action.payload;
      state.audio.error = false;
    },
    uploadAudioFailure: (state) => {
      state.audio.isFetching = false;
      state.audio.error = true;
    },
  },
});

export const {
  uploadImageStart,
  uploadImageSuccess,
  uploadImageFailure,
  uploadAudioStart,
  uploadAudioSuccess,
  uploadAudioFailure,
} = uploadSlide.actions;
export default uploadSlide.reducer;
