// features/notifications/notificationsSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

const selectNotificationsState = (state: RootState) => state.notifications;

export const selectAllNotifications = createSelector(
    selectNotificationsState,
    (notifications) => notifications.notifications
);

export const selectNotificationCount = createSelector(
    selectAllNotifications,
    (notifications) => notifications.length
);

export const selectNotificationsByType = createSelector(
    [selectAllNotifications, (_: unknown, type: string) => type],
    (notifications, type) => notifications.filter(notification => notification.type === type)
);

export const selectLatestNotification = createSelector(
    selectAllNotifications,
    (notifications) => {
        if (notifications.length === 0) return null;
        return notifications[notifications.length - 1];
    }
);

export const selectOldestNotifications = createSelector(
    selectAllNotifications,
    (notifications) => {
        return [...notifications].sort((a, b) => a.timestamp - b.timestamp);
    }
);