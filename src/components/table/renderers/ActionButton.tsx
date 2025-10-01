import { type MouseEvent } from 'react';
import BaseButton from '../../shared/BaseButton';

// Reusable action button component
interface ActionButtonProps {
    icon: any;
    title: string;
    onClick: (e: MouseEvent) => void;
    disabled?: boolean;
}

export const ActionButton = ({
    icon,
    title,
    onClick,
    disabled = false
}: ActionButtonProps) => (
    <BaseButton
        size="small"
        rounded="full"
        fillMode="flat"
        themeColor="base"
        svgIcon={icon}
        title={title}
        onClick={onClick}
        disabled={disabled}
        className="!p-1.5 !text-gray-600 hover:!text-gray-800 hover:!bg-gray-100 disabled:!opacity-50"
        color="none"
    />
);
