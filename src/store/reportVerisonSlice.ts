import type { ReportVersionItem } from '../data/reportData';

export type ReportVersionsState = {
  selectedReportId: number | null;
  reportVersions: ReportVersionItem[];
  loading: boolean;
  error: string | null;
};

export const reportVersionsInitialState: ReportVersionsState = {
  selectedReportId: null,
  reportVersions: [],
  loading: false,
  error: null,
};

export const reportVersionsActions = {
  setSelectedReportId: (reportId: number | null) => ({
    type: 'reportVersions/setSelectedReportId' as const,
    payload: reportId,
  }),
  setReportVersions: (versions: ReportVersionItem[]) => ({
    type: 'reportVersions/setReportVersions' as const,
    payload: versions,
  }),
  setLoading: (loading: boolean) => ({
    type: 'reportVersions/setLoading' as const,
    payload: loading,
  }),
  setError: (error: string | null) => ({
    type: 'reportVersions/setError' as const,
    payload: error,
  }),
  clear: () => ({
    type: 'reportVersions/clear' as const,
  }),
};

export type ReportVersionsAction = ReturnType<
  (typeof reportVersionsActions)[keyof typeof reportVersionsActions]
>;

type AnyAction = ReportVersionsAction | { type: string; payload?: unknown };

export function reportVersionsReducer(
  state: ReportVersionsState,
  action: AnyAction,
): ReportVersionsState {
  switch (action.type) {
    case 'reportVersions/setSelectedReportId': {
      const reportId = action.payload as number | null;
      if (reportId == null) {
        return {
          ...reportVersionsInitialState,
        };
      }
      return {
        ...state,
        selectedReportId: reportId,
      };
    }
    case 'reportVersions/setReportVersions':
      return {
        ...state,
        reportVersions: action.payload as ReportVersionItem[],
      };
    case 'reportVersions/setLoading':
      return {
        ...state,
        loading: Boolean(action.payload),
      };
    case 'reportVersions/setError':
      return {
        ...state,
        error: (action.payload as string | null) ?? null,
      };
    case 'reportVersions/clear':
      return {
        ...reportVersionsInitialState,
      };
    default:
      return state;
  }
}
