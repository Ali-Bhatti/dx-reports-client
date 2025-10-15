import { Notification } from '@progress/kendo-react-notification';

type BannerType = 'success' | 'error' | 'warning' | 'info';

interface BaseBannerProps {
    type: BannerType;
    message: string | React.ReactNode;
    closable?: boolean;
    className?: string;
    onClose?: () => void;
}

export default function BaseBanner({
    type,
    message,
    closable = false,
    className = '',
    onClose
}: BaseBannerProps) {
    return (
        <Notification
            type={{
                style: type,
                icon: true
            }}
            closable={closable}
            onClose={onClose}
            style={{
                width: '100%',
                marginBottom: '1rem',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                minHeight: '40px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            {typeof message === 'string' ? (
                <span className={className} dangerouslySetInnerHTML={{ __html: message }} />
            ) : (
                message
            )}
        </Notification>
    );
}
