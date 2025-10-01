import { type MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import type { ICellRendererParams } from 'ag-grid-community';

import { ActionButton } from './ActionButton';
import type { Report as ReportRow } from '../../../types';
import {
    setSelectedReportId,
    clearSelectedReportIds,
} from '../../../features/reports/reportsSlice';

import {
    copyIcon,
    trashIcon,
    linkIcon,
} from '@progress/kendo-svg-icons';

interface ReportActionsRendererProps extends ICellRendererParams<ReportRow> {
    onCopy?: (reportId: number) => void;
    onLink?: (reportId: number) => void;
    onDelete?: (reportId: number) => void;
}

const ReportActionsRenderer = ({
    data,
    onCopy,
    onLink,
    onDelete
}: ReportActionsRendererProps) => {
    const dispatch = useDispatch();
    const row = data!;

    const handleCopyClick = (e: MouseEvent) => {
        e.stopPropagation();
        dispatch(clearSelectedReportIds());
        dispatch(setSelectedReportId(null));
        onCopy?.(Number(row.id));
    };

    const handleLinkClick = (e: MouseEvent) => {
        e.stopPropagation();
        dispatch(clearSelectedReportIds());
        dispatch(setSelectedReportId(null));
        onLink?.(Number(row.id));
    };

    const handleDeleteClick = (e: MouseEvent) => {
        e.stopPropagation();
        dispatch(clearSelectedReportIds());
        dispatch(setSelectedReportId(null));
        onDelete?.(Number(row.id));
    };

    return (
        <div className="flex items-center gap-1.5">
            <ActionButton
                icon={copyIcon}
                title="Copy"
                onClick={handleCopyClick}
            />
            <ActionButton
                icon={linkIcon}
                title="Link"
                onClick={handleLinkClick}
            />
            <ActionButton
                icon={trashIcon}
                title="Delete"
                onClick={handleDeleteClick}
            />
        </div>
    );
};

export default ReportActionsRenderer;