import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppState, Environment } from "../../types";

const initialState: AppState = {
  currentEnvironment: null,
  copyModalEnvironment: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentEnvironment: (state, action: PayloadAction<Environment | null>) => {
      state.currentEnvironment = action.payload;
    },
    clearCurrentEnvironment: (state) => {
      state.currentEnvironment = null;
    },
    setCopyModalEnvironment: (state, action: PayloadAction<Environment | null>) => {
      state.copyModalEnvironment = action.payload;
    },
    clearCopyModalEnvironment: (state) => {
      state.copyModalEnvironment = null;
    },
  },
});

export const {
  setCurrentEnvironment,
  clearCurrentEnvironment,
  setCopyModalEnvironment,
  clearCopyModalEnvironment
} = appSlice.actions;

export default appSlice.reducer;
