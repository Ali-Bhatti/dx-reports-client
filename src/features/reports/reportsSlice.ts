import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit'

import type { Report as ReportRow, ReportVersion as HistoryRow, ActionContext, ReportStatistics } from "../../types";


interface ReportsState {
  selectedReportId: number | null;
  selectedReport: ReportRow | null;
  selectedReportVersion: HistoryRow | null;
  selectedReportIds: number[];
  currentCompany: number | null;
  query: string;
  loading: boolean;
  error: string | null;
  selectedVersionIds: number[];
  actionContext: ActionContext;
  companyKPIs?: ReportStatistics[];
}

const initialState: ReportsState = {
  selectedReport: null,
  selectedReportVersion: null,
  selectedReportId: null,
  selectedReportIds: [],
  currentCompany: null,
  query: '',
  error: null,
  selectedVersionIds: [],
  loading: false,
  actionContext: {
    type: null,
  },
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setCurrentCompany: (state, action: PayloadAction<number | null>) => {
      state.currentCompany = action.payload;
      state.selectedReportId = null;
      state.selectedReportIds = [];
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setSelectedReportId: (state, action: PayloadAction<number | null>) => {
      state.selectedReportId = action.payload;
    },
    setSelectedReport: (state, action: PayloadAction<ReportRow | null>) => {
      state.selectedReport = action.payload;
    },
    setSelectedReportVersion: (state, action: PayloadAction<HistoryRow | null>) => {
      state.selectedReportVersion = action.payload;
    },
    setSelectedReportIds: (state, action: PayloadAction<number[]>) => {
      state.selectedReportIds = action.payload;
    },
    addSelectedReportId: (state, action: PayloadAction<number>) => {
      if (!state.selectedReportIds.includes(action.payload)) {
        state.selectedReportIds.push(action.payload);
      }
    },
    removeSelectedReportId: (state, action: PayloadAction<number>) => {
      state.selectedReportIds = state.selectedReportIds.filter(id => id !== action.payload);
    },
    clearSelectedReportIds: (state) => {
      state.selectedReportIds = [];
    },
    setSelectedVersionIds: (state, action: PayloadAction<number[]>) => {
      state.selectedVersionIds = action.payload;
    },
    addSelectedVersionId: (state, action: PayloadAction<number>) => {
      if (!state.selectedVersionIds.includes(action.payload)) {
        state.selectedVersionIds.push(action.payload);
      }
    },
    removeSelectedVersionId: (state, action: PayloadAction<number>) => {
      state.selectedVersionIds = state.selectedVersionIds.filter(id => id !== action.payload);
    },
    clearSelectedVersionIds: (state) => {
      state.selectedVersionIds = [];
    },
    setActionContext: (state, action: PayloadAction<ActionContext>) => {
      state.actionContext = action.payload;
    },
    clearActionContext: (state) => {
      state.actionContext = { type: null };
    },
    setCompanyKPIs: (state, action: PayloadAction<ReportStatistics[]>) => {
      state.companyKPIs = action.payload;
    }
  },
});

export const {
  setCurrentCompany,
  setQuery,
  setSelectedReportId,
  setSelectedReportIds,
  setSelectedReport,
  setSelectedReportVersion,
  addSelectedReportId,
  removeSelectedReportId,
  clearSelectedReportIds,
  setSelectedVersionIds,
  addSelectedVersionId,
  removeSelectedVersionId,
  clearSelectedVersionIds,
  setActionContext,
  clearActionContext,
} = reportsSlice.actions;

export default reportsSlice.reducer;

