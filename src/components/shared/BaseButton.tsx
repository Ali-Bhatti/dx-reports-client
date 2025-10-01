import { Button, type ButtonProps } from '@progress/kendo-react-buttons';

type FGColor =
    | 'gray'
    | 'red'
    | 'green'
    | 'blue'
    | 'yellow'
    | 'purple'
    | 'orange'
    | 'slate'
    | 'none'
    ;

type FGType = 'default' | 'iconButton';

export type BaseButtonProps = Omit<ButtonProps, 'className'> & {
    color?: FGColor;
    typeVariant?: FGType;
    className?: string;
};

const BASE_CLASSES = '!rounded-md !p-2';
const BASE_TEXT_COLOR = '!text-white';
const COLOR_CLASSES: Record<FGColor, string> = {
    gray: `!bg-gray-500 hover:!bg-gray-600 ${BASE_TEXT_COLOR}`,
    red: `!bg-red-500 hover:!bg-red-600 ${BASE_TEXT_COLOR}`,
    green: `!bg-green-500 hover:!bg-green-600 ${BASE_TEXT_COLOR}`,
    blue: `!bg-fg-primary hover:!bg-fg-primary-hover ${BASE_TEXT_COLOR}`,
    yellow: `!bg-yellow-500 hover:!bg-yellow-600 ${BASE_TEXT_COLOR}`,
    purple: `!bg-purple-500 hover:!bg-purple-600 ${BASE_TEXT_COLOR}`,
    orange: `!bg-orange-500 hover:!bg-orange-600 ${BASE_TEXT_COLOR}`,
    slate: `!bg-slate-500 hover:!bg-slate-600 ${BASE_TEXT_COLOR}`,
    none: `!bg-transparent`
};

function cx(...parts: Array<string | undefined | false | null>): string {
    return parts.filter(Boolean).join(' ');
}

export default function BaseButton(props: BaseButtonProps) {
    const {
        color = 'blue',
        typeVariant = 'default',
        className,
        children,
        ...rest
    } = props;

    // Compose classes: base + color + caller classes
    const composed = cx(BASE_CLASSES, COLOR_CLASSES[color], className);

    // For icon-only button: hide text; leave icon and aria-label to the caller
    const isIcon = typeVariant === 'iconButton';

    return (
        <Button
            {...rest}
            className={composed}
        >
            {isIcon ? null : children}
        </Button>
    );
}
