import { Switch, type SwitchProps } from '@progress/kendo-react-inputs';


export interface BaseSwitchProps extends Omit<SwitchProps, 'className' | 'onLabel' | 'offLabel'> {
    className?: string;
    showLabels?: boolean;
    onLabel?: string;
    offLabel?: string;
}

export default function BaseSwitch({
    size = 'small',
    className,
    showLabels = false,
    onLabel,
    offLabel,
    ...props
}: BaseSwitchProps) {

    // If showLabels is false, set empty labels to hide ON/OFF text
    const finalOnLabel = showLabels ? (onLabel || 'ON') : '';
    const finalOffLabel = showLabels ? (offLabel || 'OFF') : '';

    return (
        <Switch
            {...props}
            className={className}
            onLabel={finalOnLabel}
            offLabel={finalOffLabel}
            size={size}
        />
    );
}