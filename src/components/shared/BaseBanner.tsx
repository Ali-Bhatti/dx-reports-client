import { Notification } from '@progress/kendo-react-notification';

type BannerType = 'success' | 'error' | 'warning' | 'info';

interface BaseBannerProps {
    type: BannerType;
    message: string;
    closable?: boolean;
    onClose?: () => void;
}

export default function BaseBanner({
    type,
    message,
    closable = false,
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
            <span dangerouslySetInnerHTML={{ __html: message }} />
        </Notification>
    );
}
