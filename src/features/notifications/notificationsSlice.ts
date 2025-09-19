import { createSlice, type PayloadAction, nanoid } from '@reduxjs/toolkit';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationItem {
    id: string;
    type: NotificationType;
    content: string;
    delay?: number;
    closable?: boolean;
    timestamp: number;
}

interface NotificationsState {
    notifications: NotificationItem[];
}

const initialState: NotificationsState = {
    notifications: [],
};

const NotificationDelayDefaults: Record<NotificationType, number> = {
    success: 3000,
    error: 4000,
    warning: 3000,
    info: 2500,
};

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Omit<NotificationItem, 'id' | 'timestamp'>>) => {
            const id = nanoid();
            const notification: NotificationItem = {
                ...action.payload,
                id,
                timestamp: Date.now(),
                delay: action.payload.delay ?? NotificationDelayDefaults[action.payload.type],
                closable: action.payload.closable ?? true,
            };
            state.notifications.push(notification);
        },

        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(
                notification => notification.id !== action.payload
            );
        },

        clearAllNotifications: (state) => {
            state.notifications = [];
        },

    },
});

export const {
    addNotification,
    removeNotification,
    clearAllNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;