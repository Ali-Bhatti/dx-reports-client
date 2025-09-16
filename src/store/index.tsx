import * as React from 'react';
import {
  reportsInitialState,
  reportsReducer,
  type ReportsState,
  type ReportsAction,
} from './reportsSlice';
import {
  reportVersionsInitialState,
  reportVersionsReducer,
  type ReportVersionsState,
  type ReportVersionsAction,
} from './reportVerisonSlice';

type StoreState = {
  reports: ReportsState;
  reportVersions: ReportVersionsState;
};

type StoreAction = ReportsAction | ReportVersionsAction | { type: string; payload?: unknown };

type StoreContextValue = {
  state: StoreState;
  dispatch: React.Dispatch<StoreAction>;
};

const StoreContext = React.createContext<StoreContextValue | undefined>(undefined);

const initialState: StoreState = {
  reports: reportsInitialState,
  reportVersions: reportVersionsInitialState,
};

function rootReducer(state: StoreState, action: StoreAction): StoreState {
  return {
    reports: reportsReducer(state.reports, action),
    reportVersions: reportVersionsReducer(state.reportVersions, action),
  };
}

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(rootReducer, initialState);
  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStoreContext = () => {
  const context = React.useContext(StoreContext);
  if (!context) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }
  return context;
};

export type RootState = StoreState;
export type AppDispatch = React.Dispatch<StoreAction>;
