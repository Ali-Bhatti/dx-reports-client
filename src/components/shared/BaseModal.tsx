import * as React from 'react';
import { Dialog, DialogActionsBar, type DialogProps, type ActionsLayout } from '@progress/kendo-react-dialogs';

function cx(...parts: Array<string | undefined | null | false>) {
    return parts.filter(Boolean).join(' ');
}

export type BaseModalProps = Omit<DialogProps, 'title' | 'className'> & {
    title?: React.ReactNode;
    titleClassName?: string;
    actions?: React.ReactNode;
    body?: React.ReactNode;
    children?: React.ReactNode;
    actionButtonsLayout?: ActionsLayout,
    type?: 'default' | 'success' | 'warning' | 'danger' | 'confirmation',
    size?: 'sm' | 'md' | 'lg' | 'xl';
};

export default function BaseModal(props: BaseModalProps) {
    const {
        title,
        titleClassName,
        actions,
        body,
        children,
        actionButtonsLayout = 'stretched',
        type = 'default',
        size = 'sm',
        ...rest
    } = props;

    const getKendoSurfaceColor = (modalType?: string) => {
        switch (modalType) {
            case 'confirmation':
            case 'success':
                return 'var(--fg-secondary)';
            case 'warning':
                return 'var(--fg-yellow)';
            case 'error':
            case 'danger':
                return 'var(--fg-red)';
            default:
                return 'var(--fg-secondary)';
        }
    };

    const sizeMap = {
        sm: 360,
        md: 480,
        lg: 720,
        xl: 1080
    };

    const surfaceColor = getKendoSurfaceColor(type);
    const dialogWidth = sizeMap[size as keyof typeof sizeMap];

    const dialogStyle: React.CSSProperties = surfaceColor
        ? { '--kendo-color-surface': surfaceColor } as React.CSSProperties
        : {};


    const kendoTitle =
        title != null ? <div className={cx('font-semibold', titleClassName)}>{title}</div> : undefined;

    const bodyContent = body ?? children;

    return (
        <Dialog {...rest} title={kendoTitle} style={{ ...dialogStyle }} width={dialogWidth} height={dialogWidth}>
            {bodyContent && <div>{bodyContent}</div>}

            {actions != null && (
                <DialogActionsBar layout={actionButtonsLayout}>{actions}</DialogActionsBar>
            )}
        </Dialog>
    );
}
