// hooks/useNotifications.ts
import { useDispatch } from 'react-redux';
import {
    addNotification,
    removeNotification,
    clearAllNotifications,
} from '../features/notifications/notificationsSlice';
import type { NotificationType } from '../features/notifications/notificationsSlice';

export const useNotifications = () => {
    const dispatch = useDispatch();

    const showNotification = (
        type: NotificationType,
        content: string,
        options?: { delay?: number; closable?: boolean }
    ) => {
        dispatch(addNotification({
            type,
            content,
            delay: options?.delay,
            closable: options?.closable,
        }));
    };

    const closeNotification = (id: string) => {
        dispatch(removeNotification(id));
    };

    const clearAll = () => {
        dispatch(clearAllNotifications());
    };

    return {
        showNotification,
        closeNotification,
        clearAll,
    };
};
