import type { ReportStatistics } from '../types';
import type { ReportListItem } from '../data/reportData';

export type ReportsState = {
  selectedCompanyId: number | null;
  reports: ReportListItem[];
  statistics: ReportStatistics[];
  loadingReports: boolean;
  loadingStatistics: boolean;
  error: string | null;
};

export const reportsInitialState: ReportsState = {
  selectedCompanyId: null,
  reports: [],
  statistics: [],
  loadingReports: false,
  loadingStatistics: false,
  error: null,
};

export const reportsActions = {
  setSelectedCompanyId: (companyId: number | null) => ({
    type: 'reports/setSelectedCompanyId' as const,
    payload: companyId,
  }),
  setReports: (reports: ReportListItem[]) => ({
    type: 'reports/setReports' as const,
    payload: reports,
  }),
  setStatistics: (statistics: ReportStatistics[]) => ({
    type: 'reports/setStatistics' as const,
    payload: statistics,
  }),
  setReportsLoading: (loading: boolean) => ({
    type: 'reports/setReportsLoading' as const,
    payload: loading,
  }),
  setStatisticsLoading: (loading: boolean) => ({
    type: 'reports/setStatisticsLoading' as const,
    payload: loading,
  }),
  setError: (error: string | null) => ({
    type: 'reports/setError' as const,
    payload: error,
  }),
  clear: () => ({
    type: 'reports/clear' as const,
  }),
};

export type ReportsAction = ReturnType<(typeof reportsActions)[keyof typeof reportsActions]>;

type AnyAction = ReportsAction | { type: string; payload?: unknown };

export function reportsReducer(
  state: ReportsState,
  action: AnyAction,
): ReportsState {
  switch (action.type) {
    case 'reports/setSelectedCompanyId': {
      const companyId = action.payload as number | null;
      if (companyId == null) {
        return {
          ...reportsInitialState,
        };
      }
      return {
        ...state,
        selectedCompanyId: companyId,
      };
    }
    case 'reports/setReports':
      return {
        ...state,
        reports: action.payload as ReportListItem[],
      };
    case 'reports/setStatistics':
      return {
        ...state,
        statistics: action.payload as ReportStatistics[],
      };
    case 'reports/setReportsLoading':
      return {
        ...state,
        loadingReports: Boolean(action.payload),
      };
    case 'reports/setStatisticsLoading':
      return {
        ...state,
        loadingStatistics: Boolean(action.payload),
      };
    case 'reports/setError':
      return {
        ...state,
        error: (action.payload as string | null) ?? null,
      };
    case 'reports/clear':
      return {
        ...reportsInitialState,
      };
    default:
      return state;
  }
}
