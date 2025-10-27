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
import BaseBanner from '../shared/BaseBanner';
import {
    EmptyStateRenderer,
    VersionHistoryActionsRenderer,
    PublishedToggleRenderer
} from '../table/renderers';
import { getVersionHistoryColumnDefs } from '../table/columnDefs';
import DeleteModal from '../modals/DeleteModal';
import PublishModal from '../modals/PublishModal';
import WarningModal from '../modals/WarningModal';
import { useNotifications } from '../../hooks/useNotifications';
import { pluralize } from '../../utils/pluralize';

import type { ReportVersion as HistoryRow, PublishModalState } from "../../types";
import {
    setSelectedVersionIds,
    clearSelectedVersionIds,
    setActionContext,
} from '../../features/reports/reportsSlice';

import {
    selectReportSelected,
    selectSelectedReportIds,
    selectCurrentCompany
} from '../../features/reports/reportsSelectors';

import {
    useGetReportVersionsQuery,
    usePublishVersionMutation,
    useUnpublishVersionMutation,
    useDownloadReportVersionMutation,
    useDeleteReportVersionMutation,
} from '../../services/reportsApi';

import {
    trashIcon,
} from '@progress/kendo-svg-icons';

import type {
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community';


export default function VersionHistory() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showNotification } = useNotifications();

    const selectedVersionIds = useSelector((state: any) => state.reports.selectedVersionIds);
    const selectedReport = useSelector(selectReportSelected);
    const selectedReportIds = useSelector(selectSelectedReportIds);
    const currentCompany = useSelector(selectCurrentCompany);
    const selectedReportId = useMemo(() => selectedReport?.id || null, [selectedReport]);


    const {
        data: versionsResponse,
        isLoading: versionsLoading,
        isFetching: versionsFetching,
        isError: versionsError,
        error: _versionsErrorDetails,
        refetch: refetchVersions
    } = useGetReportVersionsQuery(String(selectedReportId), {
        skip: !selectedReportId,
    });

    const [publishVersion, { isLoading: isPublishing }] = usePublishVersionMutation();
    const [unpublishVersion, { isLoading: isUnpublishing }] = useUnpublishVersionMutation();
    const [downloadVersion] = useDownloadReportVersionMutation();
    const [deleteVersions, { isLoading: isDeleting }] = useDeleteReportVersionMutation();

    const isLoadingVersions = versionsLoading || versionsFetching;

    // Transform API response
    const versions = useMemo(() => {
        // Return empty array if no report is selected (even if cache exists)
        if (!selectedReportId) return [];
        if (!versionsResponse) return [];
        if (!currentCompany || versionsError) return [];
        if (selectedReportIds.length > 1) return [];

        return versionsResponse.map(version => {
            return {
                ...version,
                reportLayoutID: version.reportLayoutID || version?.reportId,
                modifiedBy: version.editorId || version?.creatorId || '',
                modifiedOn: version.modificationDate || version?.creationDate || '',
            };
        });
    }, [versionsResponse, selectedReportId, selectedReportIds.length, currentCompany, versionsError]);

    const currentPublishedVersion = useMemo(() => {
        return versions.find(v => v.isPublished);
    }, [versions]);


    // Modal states
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        versionId: null as number | null,
        isMultiple: false
    });
    const [publishModal, setPublishModal] = useState<PublishModalState>({
        isOpen: false,
        versionId: null,
    });
    const [warningModal, setWarningModal] = useState({
        isOpen: false,
        message: ''
    });

    // Clear selections when report changes
    useEffect(() => {
        dispatch(clearSelectedVersionIds());
    }, [selectedReportId, dispatch]);

    const getVersionById = (id: number) => {
        return versions.find(v => v.id === id);
    };

    const getSelectedVersionNames = () => {
        return versions
            .filter(v => selectedVersionIds.includes(v.id))
            .map(v => `${v.version}`);
    };

    const currentReportName = useMemo(() => {
        if (!selectedReport?.reportName) return 'Unknown Report';
        return selectedReport.reportName;
    }, [selectedReport]);

    const noVersionsMessage = useMemo(() => {
        if (!selectedReportId) {
            return 'Select a report to see its Versions';
        }
        if (selectedReportIds.length > 0) {
            return 'Select a single report to view version history';
        }
        if (isLoadingVersions) {
            return 'Loading versions...';
        }
        if (versionsError) {
            return 'Error loading versions. Please try again.';
        }
        if (versions.length === 0) {
            return `No versions available`;
        }
        if (currentReportName === 'Unknown Report') {
            return 'No report selected';
        }
        return `No versions available for "${currentReportName}"`;
    }, [selectedReportIds.length, selectedReportId, currentReportName, isLoadingVersions, versionsError]);

    // Action handlers for the version actions renderer
    const handleVersionDownload = async (versionId: number) => {
        if (!selectedReportId) return;

        const version = getVersionById(versionId);
        try {
            showNotification('info', `Downloading version <strong>${version?.version}</strong>...`);

            const blob = await downloadVersion({
                reportId: String(selectedReportId),
                versionId: String(versionId)
            }).unwrap();

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${currentReportName}_v${version?.version}.repx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            showNotification('success', `Version <strong>${version?.version}</strong> downloaded successfully`);
        } catch (error) {
            showNotification('error', `Failed to download version <strong>${version?.version}</strong>`);
        }
    };

    const handleVersionNewVersion = (versionId: number, _reportId: number) => {
        dispatch(setActionContext({
            type: 'new_version',
            versionId: versionId,
            selectedVersion: getVersionById(versionId)
        }));
        navigate('/report-designer');
    };

    const handleVersionEdit = (versionId: number, _reportId: number) => {
        dispatch(setActionContext({
            type: 'edit',
            versionId: versionId,
            selectedVersion: getVersionById(versionId)
        }));
        navigate('/report-designer');
    };

    const handleVersionDelete = (versionId: number) => {
        const version = getVersionById(versionId);

        if (version?.isPublished && version?.isDefault) {
            setWarningModal({
                isOpen: true,
                message: 'Published or Default version cannot be deleted.'
            });
            return;
        }

        if (version?.isPublished) {
            setWarningModal({
                isOpen: true,
                message: 'Published version cannot be deleted.'
            });
            return;
        }

        if (version?.isDefault) {
            setWarningModal({
                isOpen: true,
                message: 'Default version cannot be deleted.'
            });
            return;
        }

        setDeleteModal({ isOpen: true, versionId, isMultiple: false });
    };

    // Create renderer with callbacks
    const createVersionActionsRenderer = useCallback((props: ICellRendererParams<HistoryRow>) => {
        return VersionHistoryActionsRenderer({
            ...props,
            onDownload: handleVersionDownload,
            onNewVersion: handleVersionNewVersion,
            onEdit: handleVersionEdit,
            onDelete: handleVersionDelete,
        });
    }, [handleVersionDownload, handleVersionNewVersion, handleVersionEdit, handleVersionDelete]);


    const handleVersionPublish = (versionId: number) => {
        setPublishModal({ isOpen: true, versionId });
    };

    const handleVersionUnpublish = (versionId: number) => {
        setPublishModal({ isOpen: true, versionId, isResetPublished: true });
    };

    const createPublishedToggleRenderer = useCallback((props: ICellRendererParams<HistoryRow>) => {
        return PublishedToggleRenderer({
            ...props,
            onPublish: handleVersionPublish,
            onUnpublish: handleVersionUnpublish,
        });
    }, [handleVersionPublish, handleVersionUnpublish]);

    const columnDefs = useMemo(() => {
        return getVersionHistoryColumnDefs({
            createVersionActionsRenderer,
            createPublishedToggleRenderer
        });
    }, [createVersionActionsRenderer, createPublishedToggleRenderer]);

    const tableKey = useMemo(() => {
        return `${selectedReportId}-${selectedReportIds.length}-${currentReportName}`;
    }, [selectedReportId, selectedReportIds.length, currentReportName]);


    const handleRowClicked = (e: RowClickedEvent<HistoryRow>) => {
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
        const selectedVersions = versions.filter(v => selectedVersionIds.includes(v.id));
        const hasPublishedOrDefault = selectedVersions.some(v => v.isPublished || v.isDefault);

        if (hasPublishedOrDefault) {
            setWarningModal({
                isOpen: true,
                message: 'Published or Default versions cannot be deleted.'
            });
            return;
        }

        setDeleteModal({ isOpen: true, versionId: null, isMultiple: true });
    };

    const handleDeleteConfirm = async () => {
        const { isMultiple, versionId } = deleteModal;

        const versionIdsToDelete = isMultiple
            ? selectedVersionIds.map(String)
            : versionId
                ? [String(versionId)]
                : null;

        if (!versionIdsToDelete || !versionIdsToDelete?.length) return;

        try {
            await deleteVersions({ versionIds: versionIdsToDelete }).unwrap();

            const count = versionIdsToDelete.length;
            const message = isMultiple
                ? `Successfully deleted <strong>${count} ${pluralize(count, 'version')}</strong>`
                : `Version <strong>${getVersionById(versionId!)?.version || ''}</strong> deleted successfully`;

            if (isMultiple) dispatch(clearSelectedVersionIds());

            showNotification('success', message);
            setDeleteModal({ isOpen: false, versionId: null, isMultiple: false });
            refetchVersions();
        } catch (error: any) {
            const count = versionIdsToDelete.length;
            const errorMessage = error?.data?.message || 'Please try again.';
            showNotification('error', `Failed to delete ${pluralize(count, 'version')}. ${errorMessage}`);
        }
    };

    const handlePublishConfirm = async () => {
        const { versionId, isResetPublished } = publishModal;

        if (!versionId || !selectedReportId) {
            setPublishModal({ isOpen: false, versionId: null });
            return;
        }

        const version = getVersionById(versionId);
        const action = isResetPublished ? 'unpublish' : 'publish';
        const actionPastTense = isResetPublished ? 'unpublished' : 'published';
        const mutationFn = isResetPublished ? unpublishVersion : publishVersion;

        try {
            await mutationFn({
                reportId: String(selectedReportId),
                versionId: Number(versionId)
            }).unwrap();

            refetchVersions();
            showNotification('success', `Version <strong>${version?.version || ''}</strong> ${actionPastTense} successfully`);
        } catch (error) {
            showNotification('error', `Failed to ${action} version <strong>${version?.version || ''}</strong>`);
        } finally {
            setPublishModal({ isOpen: false, versionId: null });
        }
    };

    const handlePublishConfirmCancel = () => {
        setPublishModal({ isOpen: false, versionId: null });
    };

    const isAnyOperationLoading = isLoadingVersions;

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
                            disabled={selectedVersionIds.length === 0 || isAnyOperationLoading}
                        >
                            <span className="hidden sm:inline">Delete</span>
                        </BaseButton>
                    </div>
                </BaseCard.Header>

                <BaseCard.Body>
                    {versions.length > 0 && !currentPublishedVersion && (
                        <BaseBanner
                            type="warning"
                            message="Be aware that no versions are currently published. Please publish a version."
                            className=' text-sm'
                        />
                    )}

                    <BaseTable<HistoryRow>
                        key={tableKey}
                        rowData={versions}
                        columnDefs={columnDefs}
                        getRowId={(p) => String(p.data.id)}
                        onRowClicked={handleRowClicked}
                        onSelectionChanged={handleSelectionChanged}
                        height={400}
                        rowSelection="multiple"
                        suppressRowClickSelection={true}
                        loading={isLoadingVersions}
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
                isLoading={isDeleting}
                versionInfo={
                    !deleteModal.isMultiple && deleteModal.versionId
                        ? {
                            version: String(getVersionById(deleteModal.versionId)?.version ?? ''),
                            reportName: currentReportName
                        }
                        : undefined
                }
            />

            <PublishModal
                isOpen={publishModal.isOpen}
                onClose={handlePublishConfirmCancel}
                onConfirm={handlePublishConfirm}
                version={publishModal.versionId ? String(getVersionById(publishModal.versionId)?.version) : ''}
                reportName={currentReportName}
                isLoading={isPublishing || isUnpublishing}
                currentPublishedVersion={currentPublishedVersion ? currentPublishedVersion.version : undefined}
                isResetPublished={publishModal.isResetPublished}
            />

            <WarningModal
                isOpen={warningModal.isOpen}
                onClose={() => setWarningModal({ isOpen: false, message: '' })}
                message={warningModal.message}
            />
        </>
    );
}