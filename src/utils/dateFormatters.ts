import moment from 'moment';

export const formatDateTime = (dateValue: any, emptyReturnValue: string = ''): string => {
    if (!dateValue) return emptyReturnValue;

    const momentDate = moment(dateValue);

    if (!momentDate.isValid()) return emptyReturnValue;

    // Format: DD/MM/YYYY HH:MM:SS (24-hour format)
    return momentDate.format('DD/MM/YYYY HH:mm:ss');
};

export const formatDate = (dateValue: any): string => {
    if (!dateValue) return '';

    const momentDate = moment(dateValue);

    if (!momentDate.isValid()) return '';

    return momentDate.format('DD/MM/YYYY');
};

export const formatTime = (dateValue: any): string => {
    if (!dateValue) return '';

    const momentDate = moment(dateValue);

    if (!momentDate.isValid()) return '';

    return momentDate.format('HH:mm:ss');
};