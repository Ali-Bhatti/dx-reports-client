import {
    type ReactNode,
    type CSSProperties,
} from 'react';
import { Dialog, DialogActionsBar, type DialogProps, type ActionsLayout } from '@progress/kendo-react-dialogs';

function cx(...parts: Array<string | undefined | null | false>) {
    return parts.filter(Boolean).join(' ');
}

export type BaseModalProps = Omit<DialogProps, 'title' | 'className'> & {
    title?: ReactNode;
    titleClassName?: string;
    actions?: ReactNode;
    body?: ReactNode;
    children?: ReactNode;
    actionButtonsLayout?: ActionsLayout,
    type?: 'default' | 'success' | 'warning' | 'danger' | 'confirmation',
    size?: 'sm' | 'md' | 'lg' | 'xl';
    autoHeight?: boolean;
    customMinHeight?: number;
    customMaxHeight?: number;
};

export default function BaseModal(props: BaseModalProps) {
    const {
        title,
        titleClassName,
        actions,
        body,
        children,
        actionButtonsLayout = 'end',
        type = 'default',
        size = 'sm',
        autoHeight = false,
        customMinHeight,
        customMaxHeight,
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
        sm: { w: 360, h: 260, minH: 200, maxH: 400 },
        md: { w: 480, h: 360, minH: 250, maxH: 500 },
        lg: { w: 720, h: 480, minH: 300, maxH: 600 },
        xl: { w: 1080, h: 720, minH: 400, maxH: 800 }
    };

    const surfaceColor = getKendoSurfaceColor(type);
    const dialogDimensions = sizeMap[size as keyof typeof sizeMap];

    // Determine height configuration
    const heightProps = autoHeight
        ? {
            minHeight: customMinHeight || dialogDimensions.minH,
            maxHeight: customMaxHeight || dialogDimensions.maxH,
            height: undefined
        }
        : {
            height: dialogDimensions.h
        };

    const dialogStyle: CSSProperties = surfaceColor
        ? { '--kendo-color-surface': surfaceColor } as CSSProperties
        : {};

    const kendoTitle =
        title != null ? <div className={cx('font-semibold', titleClassName)}>{title}</div> : undefined;

    const bodyContent = body ?? children;

    return (
        <Dialog
            {...rest}
            title={kendoTitle}
            style={{ ...dialogStyle }}
            width={dialogDimensions.w}
            {...heightProps}
        >
            {bodyContent && (
                <div className={cx(
                    'pb-3',
                    autoHeight && 'overflow-y-auto'
                )}>
                    {bodyContent}
                </div>
            )}

            {actions != null && (
                <DialogActionsBar layout={actionButtonsLayout}>{actions}</DialogActionsBar>
            )}
        </Dialog>
    );
}