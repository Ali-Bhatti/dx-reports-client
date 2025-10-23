import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppState, Environment } from "../../types";

const initialState: AppState = {
  currentEnvironment: null,
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
  },
});

export const {
  setCurrentEnvironment,
  clearCurrentEnvironment,
} = appSlice.actions;

export default appSlice.reducer;
