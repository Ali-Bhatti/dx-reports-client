import moment from 'moment';

export const formatDateTime = (dateValue: any, emptyReturnValue: string = '', convertToBrowserTimeZone: boolean = true): string => {
    if (!dateValue) return emptyReturnValue;

    let momentDate = convertToBrowserTimeZone
        ? moment.utc(dateValue).local()
        : moment(dateValue);

    if (!momentDate.isValid()) return emptyReturnValue;

    // Format: DD/MM/YYYY HH:mm:ss (24-hour format)
    return momentDate.format('DD/MM/YYYY HH:mm:ss');
};

export const formatDate = (dateValue: any, convertToBrowserTimeZone: boolean = false): string => {
    if (!dateValue) return '';

    const momentDate = convertToBrowserTimeZone
        ? moment.utc(dateValue).local()
        : moment(dateValue);

    if (!momentDate.isValid()) return '';

    return momentDate.format('DD/MM/YYYY');
};

export const formatTime = (dateValue: any, convertToBrowserTimeZone: boolean = false): string => {
    if (!dateValue) return '';

    const momentDate = convertToBrowserTimeZone
        ? moment.utc(dateValue).local()
        : moment(dateValue);

    if (!momentDate.isValid()) return '';

    return momentDate.format('HH:mm:ss');
};