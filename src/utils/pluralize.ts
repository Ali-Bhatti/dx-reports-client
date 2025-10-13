import { pluralWords } from './plurals';

export const pluralize = (
    count: number,
    singular: string,
    customPlural?: string
): string => {
    if (count === 1 || count === 0 || !count) return singular;

    if (customPlural) return customPlural;

    if (pluralWords[singular]) {
        return pluralWords[singular];
    }

    return `${singular}s`;
};
