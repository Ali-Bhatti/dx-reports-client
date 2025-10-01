import {
    useState,
    useMemo,
    useEffect,
    useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import BaseCard from '../shared/BaseCard';
import BaseButton from '../shared/BaseButton';
import BaseTable from '../shared/BaseTable';
import { EmptyStateRenderer, VersionHistoryActionsRenderer, PublishedToggleRenderer } from '../table/renderers';
import { getVersionHistoryColumnDefs } from '../table/columnDefs';
import DeleteModal from '../modals/DeleteModal';
import PublishModal from '../modals/PublishModal';
import { useNotifications } from '../../hooks/useNotifications';

import type { ReportVersion as HistoryRow } from "../../types";
import {
    setSelectedVersionIds,
    clearSelectedVersionIds,
    setActionContext,
} from '../../features/reports/reportsSlice';

import {
    selectReports,
    selectSelectedReportId,
    selectSelectedReportIds,
    selectCurrentCompany
} from '../../features/reports/reportsSelectors';

import {
    useGetReportVersionsQuery,
} from '../../services/report';

import {
    trashIcon,
} from '@progress/kendo-svg-icons';

import type {
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community';

type VersionRowWithPublished = HistoryRow & { published: boolean };

export default function VersionHistory() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showNotification } = useNotifications();

    // Redux selectors
    const selectedVersionIds = useSelector((state: any) => state.reports.selectedVersionIds);
    const reports = useSelector(selectReports);
    const selectedReportId = useSelector(selectSelectedReportId);
    const selectedReportIds = useSelector(selectSelectedReportIds);
    const currentCompany = useSelector(selectCurrentCompany);

    // Local state to track published status changes
    const [publishedStatusOverrides, setPublishedStatusOverrides] = useState<Record<number, boolean>>({});

    // API call for versions - only fetch when we have a selected report
    const {
        data: versionsResponse,
        isLoading: versionsLoading,
        isError: versionsError,
        error: _versionsErrorDetails,
        refetch: _refetchVersions
    } = useGetReportVersionsQuery(String(selectedReportId), {
        skip: !selectedReportId, // Skip the query if no report is selected
    });

    // Transform API response to match expected structure and apply local overrides
    const versions = useMemo(() => {
        if (!versionsResponse || !currentCompany || versionsError || !selectedReportId) return [];
        if (selectedReportIds.length > 1) return [];

        return versionsResponse.map(version => {
            const versionId = Number(version.id);
            const hasOverride = publishedStatusOverrides.hasOwnProperty(versionId);
            const publishedStatus = hasOverride ? publishedStatusOverrides[versionId] : version.isPublished;

            return {
                ...version,
                reportId: version.reportID || version?.reportId,
                modifiedBy: version.modifiedBy || version?.createdBy || '',
                modifiedOn: version.modifiedOn || version?.createdOn,
                isPublished: publishedStatus,
                published: publishedStatus
            };
        });
    }, [versionsResponse, selectedReportId, selectedReportIds.length, currentCompany, versionsError, publishedStatusOverrides]);

    // Clear local overrides when report changes
    useEffect(() => {
        setPublishedStatusOverrides({});
    }, [selectedReportId]);


    // Modal states
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        versionId: null as number | null,
        isMultiple: false
    });
    const [publishModal, setPublishModal] = useState({
        isOpen: false,
        versionId: null as number | null
    });

    // Clear selections when report changes
    useEffect(() => {
        dispatch(clearSelectedVersionIds());
    }, [selectedReportId, dispatch]);

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

    const currentReportName = useMemo(() => {
        if (!selectedReportId) return 'Unknown Report';
        const report = reports.find(r => r.id === selectedReportId);
        return report?.reportName || 'Unknown Report';
    }, [selectedReportId, reports]);

    const noVersionsMessage = useMemo(() => {
        if (!selectedReportId) {
            return 'Select a report to see its Versions';
        }
        if (selectedReportIds.length > 0) {
            return 'Select a single report to view version history';
        }
        if (versionsLoading) {
            return 'Loading versions...';
        }
        if (versionsError) {
            return 'Error loading versions. Please try again.';
        }
        if(versions.length === 0) {
            return `No versions available`;
        }
        if (currentReportName === 'Unknown Report') {
            return 'No report selected';
        }
        return `No versions available for "${currentReportName}"`;
    }, [selectedReportIds.length, selectedReportId, currentReportName, versionsLoading, versionsError]);

    // Action handlers for the version actions renderer
    const handleVersionDownload = (versionId: number) => {
        showNotification('success', `Downloading version <strong>${getVersionById(versionId)?.version}</strong>...`);
    };

    const handleVersionNewVersion = (versionId: number, reportId: number) => {
        dispatch(setActionContext({
            type: 'new_version',
            versionId: versionId,
            reportId: reportId,
            selectedVersion: getVersionById(versionId)
        }));
        navigate('/report-designer');
    };

    const handleVersionEdit = (versionId: number, reportId: number) => {
        dispatch(setActionContext({
            type: 'edit',
            versionId: versionId,
            reportId: reportId,
            selectedVersion: getVersionById(versionId)
        }));
        navigate('/report-designer');
    };

    const handleVersionDelete = (versionId: number) => {
        setDeleteModal({ isOpen: true, versionId, isMultiple: false });
    };

    // Create renderer with callbacks
    const createVersionActionsRenderer = useCallback((props: ICellRendererParams<VersionRowWithPublished>) => {
        return VersionHistoryActionsRenderer({
            ...props,
            onDownload: handleVersionDownload,
            onNewVersion: handleVersionNewVersion,
            onEdit: handleVersionEdit,
            onDelete: handleVersionDelete,
        });
    }, [handleVersionDownload, handleVersionNewVersion, handleVersionEdit, handleVersionDelete]);


    // Published toggle handlers with local state updates
    const handleVersionPublish = (versionId: number) => {
        setPublishModal({ isOpen: true, versionId });
    };

    const handleVersionUnpublish = (versionId: number) => {
        const version = getVersionById(versionId);
        // Update local state to immediately reflect the change
        setPublishedStatusOverrides(prev => ({
            ...prev,
            [versionId]: false
        }));
        showNotification('success', `Version <strong>${version?.version}</strong> unpublished successfully`);
    };

    const createPublishedToggleRenderer = useCallback((props: ICellRendererParams<VersionRowWithPublished>) => {
        return PublishedToggleRenderer({
            ...props,
            onPublish: handleVersionPublish,
            onUnpublish: handleVersionUnpublish,
        });
    }, [handleVersionPublish, handleVersionUnpublish]);

    // Column definitions using the separate module
    const columnDefs = useMemo(() => {
        return getVersionHistoryColumnDefs({
            createVersionActionsRenderer,
            createPublishedToggleRenderer
        });
    }, [createVersionActionsRenderer, createPublishedToggleRenderer]);

    const tableKey = useMemo(() => {
        return `${selectedReportId}-${selectedReportIds.length}-${currentReportName}`;
    }, [selectedReportId, selectedReportIds.length, currentReportName]);


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

    // Modal handlers - only local state updates, no API calls
    const handleDeleteConfirm = () => {
        if (deleteModal.isMultiple) {
            dispatch(clearSelectedVersionIds());

            const versionCount = selectedVersionIds.length;
            const versionText = versionCount === 1 ? 'version' : 'versions';
            showNotification('success', `Successfully deleted <strong>${versionCount} ${versionText}</strong>`);
        } else if (deleteModal.versionId) {
            const version = getVersionById(deleteModal.versionId);
            showNotification('success', `Version <strong>${version?.version || ''}</strong> deleted successfully`);
        }

        setDeleteModal({ isOpen: false, versionId: null, isMultiple: false });
    };

    const handlePublishConfirm = () => {
        if (publishModal.versionId) {
            const version = getVersionById(publishModal.versionId);
            // Update local state to immediately reflect the change
            setPublishedStatusOverrides(prev => ({
                ...prev,
                [publishModal.versionId!]: true
            }));
            showNotification('success', `Version <strong>${version?.version || ''}</strong> published successfully`);
        }

        setPublishModal({ isOpen: false, versionId: null });
    };

    const handlePublishConfirmCancel = () => {
        setPublishModal({ isOpen: false, versionId: null });
    };

    const isAnyOperationLoading = versionsLoading;

    return (
        <>
            <BaseCard className="mt-5" dividers={false}>
                <BaseCard.Header>
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold">Version History</h3>
                        {isAnyOperationLoading && (
                            <span className="text-sm text-gray-500">Loading...</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <BaseButton
                            color="red"
                            svgIcon={trashIcon}
                            title="Delete"
                            onClick={handleDeleteVersion}
                            disabled={selectedVersionIds.length === 0 || isAnyOperationLoading}
                        >
                            Delete {selectedVersionIds.length > 0 && `(${selectedVersionIds.length})`}
                        </BaseButton>
                    </div>
                </BaseCard.Header>

                <BaseCard.Body>
                    <BaseTable<VersionRowWithPublished>
                        key={tableKey}
                        rowData={versions}
                        columnDefs={columnDefs}
                        getRowId={(p) => String(p.data.id)}
                        onRowClicked={handleRowClicked}
                        onSelectionChanged={handleSelectionChanged}
                        height={400}
                        rowSelection="multiple"
                        suppressRowClickSelection={true}
                        loading={versionsLoading}
                        noRowsOverlayComponent={() => (
                            <EmptyStateRenderer
                                message={noVersionsMessage}
                                subMessage={
                                    versionsError
                                        ? "Please refresh the page or try again later"
                                        : "Version history will appear here once created"
                                }
                            />
                        )}
                    />
                </BaseCard.Body>
            </BaseCard>

            {/* Modals */}
            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, versionId: null, isMultiple: false })}
                onConfirm={handleDeleteConfirm}
                itemNames={deleteModal.isMultiple
                    ? getSelectedVersionNames().map(String)
                    : deleteModal.versionId
                        ? [String(getVersionById(deleteModal.versionId)?.version || '')]
                        : []
                }
                itemType="version"
                versionInfo={
                    !deleteModal.isMultiple && deleteModal.versionId
                        ? {
                            version: String(getVersionById(deleteModal.versionId)?.version ?? ''),
                            reportName: getReportNameForVersion(deleteModal.versionId)
                        }
                        : undefined
                }
            />

            <PublishModal
                isOpen={publishModal.isOpen}
                onClose={handlePublishConfirmCancel}
                onConfirm={handlePublishConfirm}
                version={publishModal.versionId ? `v${String(getVersionById(publishModal.versionId)?.version)}` : ''}
                reportName={publishModal.versionId ? getReportNameForVersion(publishModal.versionId) : ''}
            />
        </>
    );
}