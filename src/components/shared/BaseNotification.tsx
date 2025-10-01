import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { Fade } from '@progress/kendo-react-animation';

import { selectAllNotifications } from '../../features/notifications/notificationsSelectors';
import { removeNotification } from '../../features/notifications/notificationsSlice';

const BaseNotification = () => {
    const dispatch = useDispatch();
    const notifications = useSelector(selectAllNotifications);

    // Auto-close notifications after specified delay
    useEffect(() => {
        const timers: ReturnType<typeof setTimeout>[] = [];

        notifications.forEach((notification) => {
            const delay = notification.delay ?? 2000;

            const timer = setTimeout(() => {
                dispatch(removeNotification(notification.id));
            }, delay);

            timers.push(timer);
        });

        // Cleanup timers on unmount or when notifications change
        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [notifications, dispatch]);

    const handleNotificationClose = (id: string) => {
        dispatch(removeNotification(id));
    };

    if (notifications.length === 0) {
        return null;
    }

    return (
        <NotificationGroup
            style={{
                position: 'fixed',
                zIndex: 9999,
                flexDirection: 'column',
                gap: '8px',
                maxWidth: '400px',
                top: 10,
                right: 10,
                alignItems: 'flex-end'
            }}
        >
            {notifications.map((notification) => (
                <Fade key={notification.id} enter={true} exit={true}>
                    <Notification
                        type={{
                            style: notification.type,
                            icon: true
                        }}
                        closable={notification.closable}
                        onClose={() => handleNotificationClose(notification.id)}
                        style={{
                            maxWidth: '400px',
                            minWidth: '300px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            animation: 'slideInFromLeft 0.3s ease-out',
                            wordWrap: 'break-word',
                            minHeight: '48px',
                            maxHeight: '200px',
                        }}
                    >
                        <span dangerouslySetInnerHTML={{ __html: notification.content }} />
                    </Notification>
                </Fade>
            ))}
        </NotificationGroup>
    );
};

export default BaseNotification;