import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

// Base selectors
export const selectReportsState = (state: RootState) => state.reports;
export const selectCurrentCompany = (state: RootState) => state.reports.currentCompany;
export const selectQuery = (state: RootState) => state.reports.query;
export const selectSelectedReportId = (state: RootState) => state.reports.selectedReportId;
export const selectSelectedReportIds = (state: RootState) => state.reports.selectedReportIds;
export const selectReportSelected = (state: RootState) => state.reports.selectedReport;

// Should show version history (only when single report is clicked, not multiple selected)
export const selectShouldShowVersionHistory = createSelector(
  [selectSelectedReportId, selectSelectedReportIds],
  (selectedReportId, selectedReportIds) => {
    return selectedReportId !== null && selectedReportIds.length === 0;
  }
);

// Has multiple reports selected
export const selectHasMultipleReportsSelected = createSelector(
  [selectSelectedReportIds],
  (selectedReportIds) => selectedReportIds.length > 0
);

// Action bar data (memoized to prevent unnecessary rerenders)
export const selectActionBarData = createSelector(
  [
    (state: RootState) => state.reports.actionContext,
    (state: RootState) => state.reports.selectedReport,
    (state: RootState) => state.reports.selectedReportId
  ],
  (actionContext, selectedReport, selectedReportId) => ({
    actionContext,
    selectedReport,
    selectedReportId
  })
);