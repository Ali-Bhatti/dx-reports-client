import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit'

import type { Report as ReportRow, ReportVersion as HistoryRow } from "../../types";

export type ReportStatistics = {
  label: string;
  total: number;
};

interface ReportsState {
  reports: ReportRow[];
  history: HistoryRow[];
  selectedReportId: number | null;
  selectedReportIds: number[];
  currentCompany: number | null;
  query: string;
  reportsPagination: {
    skip: number;
    take: number;
  };
  versionsPagination: {
    skip: number;
    take: number;
  };
  loading: boolean;
  error: string | null;
  selectedVersionIds: number[];
  actionContext: {
    type: 'edit' | 'new_version' | null;
    reportId?: number;
    versionId?: number;
  };
}

const initialState: ReportsState = {
  reports: [
    { id: 1, reportName: 'Loadlist', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Atif', active: true, companyId: 1 },
    { id: 2, reportName: 'Unloadlist', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
    { id: 3, reportName: 'Unloadlist1', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
    { id: 4, reportName: 'Unloadlist2', createdOn: '8/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Kas', active: false, companyId: 1 },
    { id: 5, reportName: 'Unloadlist3', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
    { id: 6, reportName: 'Unloadlist4', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
    { id: 7, reportName: 'Unloadlist5', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Kas', active: false, companyId: 1 },
    { id: 8, reportName: 'Unloadlist6', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
    { id: 9, reportName: 'Unloadlist7', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
    { id: 10, reportName: 'Unloadlist8', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
    { id: 11, reportName: 'Unloadlist9', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
    { id: 12, reportName: 'Unloadlist00', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Kas', active: false, companyId: 1 },
    { id: 13, reportName: 'Unloadlist11', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
    { id: 14, reportName: 'Unloadlist12', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
    { id: 15, reportName: 'Unloadlist13', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
    { id: 16, reportName: 'Unloadlist14', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
    { id: 17, reportName: 'Unloadlist', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
    { id: 18, reportName: 'Order label A6', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 19, reportName: 'Order label 110x50', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 20, reportName: 'Order label1 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 21, reportName: 'Order label2 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 22, reportName: 'Order label3 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 23, reportName: 'Order label4 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 24, reportName: 'Order label5 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 25, reportName: 'Order label6 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 26, reportName: 'Order label7 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 27, reportName: 'Order label8 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 28, reportName: 'Order label9 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 29, reportName: 'Order label00 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 30, reportName: 'Order label11 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 31, reportName: 'Order label12 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 32, reportName: 'Order label13 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 33, reportName: 'Order label14 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 34, reportName: 'Order label15 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 35, reportName: 'Order label16 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 36, reportName: 'Order label17 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 37, reportName: 'Order label18 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 38, reportName: 'Order label19 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
    { id: 39, reportName: 'Order label20 70x37', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  ],
  history: [
    { id: 1, version: 'v1', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Atif', isPublished: true, reportId: 1, isDefault: true },
    { id: 2, version: 'v2', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Atif', isPublished: false, reportId: 1, isDefault: false },
    { id: 3, version: 'v1', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Kas', isPublished: true, reportId: 2, isDefault: true },
    { id: 4, version: 'v2', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Kas', isPublished: true, reportId: 2, isDefault: false },
    { id: 5, version: 'v1', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Arooba', isPublished: false, reportId: 3, isDefault: true },
    { id: 6, version: 'v2', createdOn: '12/7/2024', modifiedOn: '12/7/2024', modifiedBy: 'Arooba', isPublished: false, reportId: 3, isDefault: false },
  ],
  selectedReportId: null,
  selectedReportIds: [],
  currentCompany: null,
  query: '',
  reportsPagination: { skip: 0, take: 10 },
  versionsPagination: { skip: 0, take: 10 },
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
      state.reportsPagination.skip = 0;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      state.reportsPagination.skip = 0;
    },
    setSelectedReportId: (state, action: PayloadAction<number | null>) => {
      state.selectedReportId = action.payload;
      state.versionsPagination.skip = 0;
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
    setReportsPagination: (state, action: PayloadAction<{ skip: number; take: number }>) => {
      state.reportsPagination = action.payload;
    },
    setVersionsPagination: (state, action: PayloadAction<{ skip: number; take: number }>) => {
      state.versionsPagination = action.payload;
    },
    updateVersionPublishedStatus: (state, action: PayloadAction<{ id: number; published: boolean }>) => {
      const version = state.history.find(h => h.id === action.payload.id);
      if (version) {
        version.isPublished = action.payload.published;
      }
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
    setActionContext: (state, action: PayloadAction<{ type: 'edit' | 'new_version' | null; reportId?: number; versionId?: number }>) => {
      state.actionContext = action.payload;
    },
    clearActionContext: (state) => {
      state.actionContext = { type: null };
    },
  },
});

export const {
  setCurrentCompany,
  setQuery,
  setSelectedReportId,
  setSelectedReportIds,
  addSelectedReportId,
  removeSelectedReportId,
  clearSelectedReportIds,
  setReportsPagination,
  setVersionsPagination,
  updateVersionPublishedStatus,
  setSelectedVersionIds,
  addSelectedVersionId,
  removeSelectedVersionId,
  clearSelectedVersionIds,
  setActionContext,
  clearActionContext,
} = reportsSlice.actions;

export default reportsSlice.reducer;

