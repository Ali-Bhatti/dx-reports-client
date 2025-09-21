// components/reports/VersionHistory.tsx
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Pager, type PageChangeEvent } from '@progress/kendo-react-data-tools';

import BaseCard from '../shared/BaseCard';
import BaseButton from '../shared/BaseButton';
import BaseSwitch from '../shared/BaseSwitch';
import BaseTable from '../shared/BaseTable';
import DeleteModal from '../modals/DeleteModal';
import PublishModal from '../modals/PublishModal';
import { ActionButton } from '../table/renderers/CommonRenderers';
import { formatDateTime } from '../../utils/dateFormatters';
import { useNotifications } from '../../hooks/useNotifications';

import type { ReportVersion as HistoryRow } from "../../types";
import {
    setVersionsPagination,
    updateVersionPublishedStatus,
    setSelectedVersionIds,
    clearSelectedVersionIds,
    setActionContext,
} from '../../features/reports/reportsSlice';

import {
    selectVersionsForSelectedReport,
    selectPaginatedVersions,
    selectVersionsPagination,
    selectReports,
    selectSelectedReportId,
    selectSelectedReportIds,
    selectShouldShowVersionHistory,
} from '../../features/reports/reportsSelectors';

import {
    trashIcon,
    pencilIcon,
    downloadIcon,
    plusOutlineIcon
} from '@progress/kendo-svg-icons';

import type {
    ColDef,
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community';

type VersionRowWithPublished = HistoryRow & { published: boolean };

export default function VersionHistory() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showNotification } = useNotifications();

    // Redux selectors
    const shouldShow = useSelector(selectShouldShowVersionHistory);
    const versions = useSelector(selectVersionsForSelectedReport);
    const paginatedVersions = useSelector(selectPaginatedVersions);
    const pagination = useSelector(selectVersionsPagination);
    const selectedVersionIds = useSelector((state: any) => state.reports.selectedVersionIds);
    const reports = useSelector(selectReports);
    const selectedReportId = useSelector(selectSelectedReportId);
    const selectedReportIds = useSelector(selectSelectedReportIds);

    // Modal states
    const [deleteModal, setDeleteModal] = React.useState({
        isOpen: false,
        versionId: null as number | null,
        isMultiple: false
    });
    const [publishModal, setPublishModal] = React.useState({
        isOpen: false,
        versionId: null as number | null
    });

    // Don't render if conditions not met
    if (!shouldShow) {
        return null;
    }

    // Helper functions
    const getVersionById = (id: number) => {
        return versions.find(v => v.id === id);
    };

    const getSelectedVersionNames = () => {
        return versions
            .filter(v => selectedVersionIds.includes(v.id))
            .map(v => `${v.version}`);
    };

    const getReportNameForVersion = (versionId: number) => {
        const version = getVersionById(versionId);
        if (!version) return 'Unknown Report';

        const report = reports.find(r => r.id === version.reportId);
        if (!report) return 'Unknown Report';

        return report.reportName;
    };

    const currentReportName = React.useMemo(() => {
        if (!selectedReportId) return 'Unknown Report';
        const report = reports.find(r => r.id === selectedReportId);
        return report?.reportName || 'Unknown Report';
    }, [selectedReportId, reports]);

    const noVersionsMessage = React.useMemo(() => {
        if (selectedReportIds.length > 0) {
            return 'Select a single report to view version history';
        }

        if (!selectedReportId) {
            return 'No report selected';
        }

        if (currentReportName === 'Unknown Report') {
            return 'No report selected';
        }
        return `No versions available for "${currentReportName}"`;
    }, [selectedReportIds.length, selectedReportId, currentReportName]);

    // Published toggle renderer using BaseSwitch
    const PublishedToggleRenderer = ({ data, value }: ICellRendererParams<VersionRowWithPublished, boolean>) => {
        const versionData = data!;

        const handleSwitchChange = (event: any) => {
            if (event.syntheticEvent && event.syntheticEvent.stopPropagation) {
                event.syntheticEvent.stopPropagation();
            }

            dispatch(clearSelectedVersionIds());

            const checked = event.target.value;

            if (checked) {
                setPublishModal({ isOpen: true, versionId: Number(versionData.id) });
            } else {
                dispatch(updateVersionPublishedStatus({ id: Number(versionData.id), published: false }));
                showNotification('success', `Version <strong>${versionData.version}</strong> unpublished successfully`);
            }
        };

        return (
            <div className="flex w-full justify-center p-2">
                <BaseSwitch
                    checked={!!value}
                    onChange={handleSwitchChange}
                />
            </div>
        );
    };

    // Version actions renderer
    const VersionActionsRenderer: React.FC<ICellRendererParams<VersionRowWithPublished>> = ({ data }) => {
        const row = data!;

        const handleDownloadClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            dispatch(clearSelectedVersionIds());
            console.log('download', row.id);
            showNotification('success', `Downloading version <strong>${row.version}</strong>...`);
        };

        const handleNewVersionClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            dispatch(clearSelectedVersionIds());
            dispatch(setActionContext({
                type: 'new_version',
                versionId: Number(row.id),
                reportId: Number(row.reportId)
            }));
            navigate('/report-designer');
        };

        const handleEditClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            dispatch(clearSelectedVersionIds());
            dispatch(setActionContext({
                type: 'edit',
                versionId: Number(row.id),
                reportId: Number(row.reportId)
            }));
            navigate('/report-designer');
        };

        const handleDeleteClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            dispatch(clearSelectedVersionIds());
            setDeleteModal({ isOpen: true, versionId: Number(row.id), isMultiple: false });
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

    // Column definitions
    const columnDefs = React.useMemo<ColDef<VersionRowWithPublished>[]>(() => [
        {
            headerName: undefined,
            width: 50,
            minWidth: 50,
            maxWidth: 50,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            sortable: false,
            filter: false,
            suppressMenu: true,
            pinned: 'left',
        },
        {
            headerName: 'Version',
            field: 'version',
            flex: 1,
            minWidth: 100
        },
        {
            headerName: 'Creation Date',
            field: 'createdOn',
            flex: 1,
            minWidth: 140,
            valueFormatter: (p) => formatDateTime(p.value)
        },
        {
            headerName: 'Modified On',
            field: 'modifiedOn',
            flex: 1,
            minWidth: 140,
            valueFormatter: (p) => formatDateTime(p.value)
        },
        {
            headerName: 'Modified By',
            field: 'modifiedBy',
            flex: 1,
            minWidth: 140
        },
        {
            headerName: 'Published',
            field: 'isPublished',
            flex: 0,
            width: 100,
            minWidth: 100,
            maxWidth: 100,
            cellRenderer: PublishedToggleRenderer,
            sortable: false
        },
        {
            headerName: 'Actions',
            flex: 0,
            width: 200,
            minWidth: 180,
            maxWidth: 250,
            cellRenderer: VersionActionsRenderer,
            sortable: false,
            pinned: 'right',
        }
    ], []);

    const tableKey = React.useMemo(() => {
        return `${selectedReportId}-${selectedReportIds.length}-${currentReportName}`;
    }, [selectedReportId, selectedReportIds.length, currentReportName]);

    // Event handlers
    const handlePageChange = (e: PageChangeEvent) => {
        dispatch(setVersionsPagination({ skip: e.skip, take: e.take }));
    };

    const handleRowClicked = (e: RowClickedEvent<VersionRowWithPublished>) => {
        // Only navigate if not clicking on checkbox, action buttons, or toggle
        if (e.event?.target &&
            !(e.event.target as HTMLElement).closest('.ag-checkbox-input') &&
            !(e.event.target as HTMLElement).closest('button') &&
            !(e.event.target as HTMLElement).closest('label') &&
            !(e.event.target as HTMLElement).closest('.flex.w-full.p-2')) {
            //navigate('/report-designer');
        }
    };

    const handleSelectionChanged = (e: any) => {
        const selectedRows = e.api.getSelectedRows();
        const selectedIds = selectedRows.map((row: any) => Number(row.id));
        dispatch(setSelectedVersionIds(selectedIds));
    };

    const handleDeleteVersion = () => {
        setDeleteModal({ isOpen: true, versionId: null, isMultiple: true });
    };

    // Modal handlers with notifications
    const handleDeleteConfirm = () => {
        if (deleteModal.isMultiple) {
            console.log("Delete Version History", selectedVersionIds);
            dispatch(clearSelectedVersionIds());

            const versionCount = selectedVersionIds.length;
            const versionText = versionCount === 1 ? 'version' : 'versions';
            showNotification('success', `Successfully deleted <strong>${versionCount} ${versionText}</strong>`);
        } else if (deleteModal.versionId) {
            const version = getVersionById(deleteModal.versionId);
            console.log("Delete version", deleteModal.versionId);

            showNotification('success', `Version <strong>${version?.version || ''}</strong> deleted successfully`);
        }
    };

    const handlePublishConfirm = () => {
        if (publishModal.versionId) {
            const version = getVersionById(publishModal.versionId);
            dispatch(updateVersionPublishedStatus({ id: publishModal.versionId, published: true }));
            console.log("Published version", publishModal.versionId);

            showNotification('success', `Version <strong>${version?.version || ''}</strong> published successfully`);
        }
    };

    const handlePublishConfirmCancel = () => {
        if (publishModal.versionId) {
            console.log("Publish cancelled for version", publishModal.versionId);
        }
        setPublishModal({ isOpen: false, versionId: null });
    };

    return (
        <>
            <BaseCard className="mt-5" dividers={false}>
                <BaseCard.Header>
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold">Version History</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <BaseButton
                            color="red"
                            svgIcon={trashIcon}
                            title="Delete"
                            onClick={handleDeleteVersion}
                            disabled={selectedVersionIds.length === 0}
                        >
                            Delete
                        </BaseButton>
                    </div>
                </BaseCard.Header>

                <BaseCard.Body>
                    <BaseTable<VersionRowWithPublished>
                        key={tableKey}
                        rowData={paginatedVersions}
                        columnDefs={columnDefs}
                        getRowId={(p) => String(p.data.id)}
                        onRowClicked={handleRowClicked}
                        onSelectionChanged={handleSelectionChanged}
                        height={400}
                        rowSelection="multiple"
                        suppressRowClickSelection={true}
                        noRowsOverlayComponent={() => (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <svg
                                    className="w-16 h-16 mb-4 text-gray-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                    />
                                </svg>
                                <span className="text-lg font-medium">{noVersionsMessage}</span>
                                <span className="text-sm mt-2">Version history will appear here once created</span>
                            </div>
                        )}
                    />
                </BaseCard.Body>

                <BaseCard.Footer>
                    <span className="text-sm text-gray-500">
                        {versions.length
                            ? `Showing ${pagination.skip + 1}-${Math.min(pagination.skip + pagination.take, versions.length)} of ${versions.length}`
                            : 'Showing 0–0 of 0'}
                    </span>
                    <Pager
                        className="fg-pager"
                        skip={pagination.skip}
                        take={pagination.take}
                        total={versions.length}
                        buttonCount={5}
                        info={false}
                        type="numeric"
                        previousNext
                        onPageChange={handlePageChange}
                    />
                </BaseCard.Footer>
            </BaseCard>

            {/* Modals */}
            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, versionId: null, isMultiple: false })}
                onConfirm={handleDeleteConfirm}
                itemNames={deleteModal.isMultiple
                    ? getSelectedVersionNames()
                    : deleteModal.versionId
                        ? [getVersionById(deleteModal.versionId)?.version || '']
                        : []
                }
                itemType="version"
                versionInfo={
                    !deleteModal.isMultiple && deleteModal.versionId
                        ? {
                            version: getVersionById(deleteModal.versionId)?.version || '',
                            reportName: getReportNameForVersion(deleteModal.versionId)
                        }
                        : undefined
                }
            />

            <PublishModal
                isOpen={publishModal.isOpen}
                onClose={handlePublishConfirmCancel}
                onConfirm={handlePublishConfirm}
                version={publishModal.versionId ? getVersionById(publishModal.versionId)?.version || '' : ''}
                reportName={publishModal.versionId ? getReportNameForVersion(publishModal.versionId) : ''}
            />
        </>
    );
}