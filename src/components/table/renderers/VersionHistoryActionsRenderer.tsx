import { type MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import type { ICellRendererParams } from 'ag-grid-community';

import { ActionButton } from './ActionButton';
import type { ReportVersion as HistoryRow } from '../../../types';
import { clearSelectedVersionIds } from '../../../features/reports/reportsSlice';

import {
    trashIcon,
    pencilIcon,
    downloadIcon,
    plusOutlineIcon
} from '@progress/kendo-svg-icons';

type VersionRowWithPublished = HistoryRow & { published: boolean };

interface VersionHistoryActionsRendererProps extends ICellRendererParams<VersionRowWithPublished> {
    onDownload?: (versionId: number) => void;
    onNewVersion?: (versionId: number, reportId: number) => void;
    onEdit?: (versionId: number, reportId: number) => void;
    onDelete?: (versionId: number) => void;
}

const VersionHistoryActionsRenderer = ({
    data,
    onDownload,
    onNewVersion,
    onEdit,
    onDelete
}: VersionHistoryActionsRendererProps) => {
    const dispatch = useDispatch();
    const row = data!;

    const handleDownloadClick = (e: MouseEvent) => {
        e.stopPropagation();
        dispatch(clearSelectedVersionIds());
        onDownload?.(Number(row.id));
    };

    const handleNewVersionClick = (e: MouseEvent) => {
        e.stopPropagation();
        dispatch(clearSelectedVersionIds());
        onNewVersion?.(Number(row.id), Number(row.reportId));
    };

    const handleEditClick = (e: MouseEvent) => {
        e.stopPropagation();
        dispatch(clearSelectedVersionIds());
        onEdit?.(Number(row.id), Number(row.reportId));
    };

    const handleDeleteClick = (e: MouseEvent) => {
        e.stopPropagation();
        dispatch(clearSelectedVersionIds());
        onDelete?.(Number(row.id));
    };

    return (
        <div className="flex items-center gap-1.5">
            <ActionButton
                icon={downloadIcon}
                title="Download"
                onClick={handleDownloadClick}
            />
            <ActionButton
                icon={plusOutlineIcon}
                title="New Version"
                onClick={handleNewVersionClick}
            />
            <ActionButton
                icon={pencilIcon}
                title="Edit"
                onClick={handleEditClick}
            />
            {!row.isDefault && (
                <ActionButton
                    icon={trashIcon}
                    title="Delete"
                    onClick={handleDeleteClick}
                />
            )}
        </div>
    );
};

export default VersionHistoryActionsRenderer;