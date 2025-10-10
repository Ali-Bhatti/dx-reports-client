import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { ReportStatistics } from "../../types";

// Base selectors
export const selectReportsState = (state: RootState) => state.reports;
export const selectReports = (state: RootState) => state.reports.reports;
export const selectHistory = (state: RootState) => state.reports.history;
export const selectCurrentCompany = (state: RootState) => state.reports.currentCompany;
export const selectQuery = (state: RootState) => state.reports.query;
export const selectSelectedReportId = (state: RootState) => state.reports.selectedReportId;
export const selectSelectedReportIds = (state: RootState) => state.reports.selectedReportIds;
export const selectReportsPagination = (state: RootState) => state.reports.reportsPagination;
export const selectVersionsPagination = (state: RootState) => state.reports.versionsPagination;

// Filtered reports based on company and query
export const selectFilteredReports = createSelector(
  [selectReports, selectCurrentCompany, selectQuery],
  (reports, company, query) => {
    if (company == null) return [];
    
    const q = query.trim().toLowerCase();
    return reports
      .filter(r => r.companyId === company)
      .filter(r => (q ? r.reportName.toLowerCase().includes(q) : true));
  }
);

// Paginated reports data
export const selectPaginatedReports = createSelector(
  [selectFilteredReports, selectReportsPagination],
  (reports, pagination) => {
    return reports.slice(pagination.skip, pagination.skip + pagination.take);
  }
);

// Report statistics/KPIs
export const selectReportStatistics = createSelector(
  [selectFilteredReports],
  (reports): ReportStatistics[] => {
    const totalReports = reports.length;
    const activeReports = reports.filter(r => r.merged).length;
    const inactiveReports = totalReports - activeReports;
    
    return [
      { label: 'Total Reports', count: totalReports },
      { label: 'Active Reports', count: activeReports },
      { label: 'In-Active Reports', count: inactiveReports }
    ];
  }
);

// Versions for selected report
export const selectVersionsForSelectedReport = createSelector(
  [selectHistory, selectSelectedReportId],
  (history, selectedReportId) => {
    if (selectedReportId == null) return [];
    
    return history
      .filter(h => h.reportId === selectedReportId)
      .map(h => ({ 
        ...h, 
        isPublished: h.isPublished 
      }));
  }
);

// Paginated versions data
export const selectPaginatedVersions = createSelector(
  [selectVersionsForSelectedReport, selectVersionsPagination],
  (versions, pagination) => {
    return versions.slice(pagination.skip, pagination.skip + pagination.take);
  }
);

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