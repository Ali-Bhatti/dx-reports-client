import { configureStore } from '@reduxjs/toolkit';
import reportsReducer from '../features/reports/reportsSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import { reportsApi } from '../services/report'

export const store = configureStore({
  reducer: {
    reports: reportsReducer,
    notifications: notificationsReducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'notifications/addNotification',
          'notifications/showNotification',
        ],
        ignoredPaths: ['reportsApi.mutations', 'reportsApi.queries'],
      },
    }).concat(reportsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;