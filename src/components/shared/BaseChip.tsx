type ChipType = 'green' | 'red' | 'yellow' | 'blue' | 'gray';

export interface BaseChipsProps {
    type: ChipType;
    text: string;
    className?: string;
}

const CHIP_STYLES: Record<ChipType, string> = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800'
};

function cx(...parts: Array<string | undefined | false | null>): string {
    return parts.filter(Boolean).join(' ');
}

export default function BaseChips({ type, text, className }: BaseChipsProps) {
    const baseClasses = 'inline-flex items-center px-3 py-0.75 rounded-full text-xs font-medium';
    const typeClasses = CHIP_STYLES[type];

    return (
        <span className={cx(baseClasses, typeClasses, className)}>
            {text}
        </span>
    );
}