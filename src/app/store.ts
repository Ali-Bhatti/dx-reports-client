import { configureStore } from '@reduxjs/toolkit';
import reportsReducer from '../features/reports/reportsSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';

export const store = configureStore({
  reducer: {
    reports: reportsReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'notifications/addNotification',
          'notifications/showNotification',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;