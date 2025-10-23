import { useState } from 'react';
import { useSelector } from 'react-redux';
import BaseButton from '../shared/BaseButton';
import BaseCard from '../shared/BaseCard';
import DownloadConfirmationModal from '../modals/DownloadConfirmationModal';
import SaveConfirmationModal from '../modals/SaveConfirmationModal';
import BaseChip from '../shared/BaseChip';
import { useNotifications } from '../../hooks/useNotifications';
import { VersionDisplay } from '../dashboard/VersionDisplay';
import { formatDateTime } from '../../utils/dateFormatters';
import { selectActionBarData } from '../../features/reports/reportsSelectors';

import {
    saveIcon,
    plusIcon,
    downloadIcon,
} from '@progress/kendo-svg-icons';

interface ActionBarProps {
    isLoading?: boolean;
    isDesignerModified?: boolean;
    onSave?: () => void;
    onDownload?: () => void;
}

function ActionBar({ isLoading = false, isDesignerModified = false, onSave, onDownload }: ActionBarProps) {
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { showNotification } = useNotifications();

    const { actionContext, selectedReport } = useSelector(selectActionBarData);

    const selectedVersion = actionContext.selectedVersion;

    // Determine action button text and icon
    const isNewVersion = actionContext.type === 'new_version';
    const actionButtonText = isNewVersion ? 'Add Version' : 'Save';
    const ActionIcon = isNewVersion ? plusIcon : saveIcon;
    const publishStatusColor = selectedVersion?.isPublished && !isNewVersion ? 'green' : 'yellow';
    const publishText = isNewVersion ? `Draft` : `${!selectedVersion?.isPublished ? 'Not' : ''} Published`;

    const handleSaveAction = () => {
        setShowSaveModal(true);
    };

    const handleDownload = () => {
        setShowDownloadModal(true);
    };

    const confirmSaveAction = async () => {
        setIsSaving(true);
        try {
            // Call the onSave function passed from parent
            if (onSave) {
                await onSave();
            }

            showNotification('success',
                isNewVersion
                    ? `New version created successfully for <strong>${selectedReport?.reportName}</strong>`
                    : `Report <strong>${selectedReport?.reportName}</strong> saved successfully`
            );
            setShowSaveModal(false);
        } catch (error) {
            showNotification('error', 'Failed to save report. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDownload = () => {
        // Call the onDownload function passed from parent
        if (onDownload) {
            onDownload();
        }

        showNotification('success', `Report <strong>${selectedReport?.reportName}</strong> is being downloaded...`);
        setShowDownloadModal(false);
    };

    // Determine if buttons should be disabled
    const isButtonsDisabled = (!isNewVersion || isLoading) && (isLoading || !selectedReport || !isDesignerModified);

    return (
        <>
            <BaseCard>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center justify-between gap-3 sm:flex-1">
                        {/* Left side - Report info */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:space-x-6 flex-1 min-w-0">
                            <div className="flex flex-col">
                                <span className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">
                                    Report Name
                                </span>
                                <span className="text-base sm:text-lg font-semibold text-gray-900 mt-1 truncate">
                                    {selectedReport?.reportName || 'No Report Selected'}
                                </span>
                            </div>

                            <div className="hidden sm:block h-8 w-px bg-gray-300"></div>

                            <div className="flex flex-col">
                                <span className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">
                                    {isNewVersion ? 'New ' : ''}Version
                                </span>
                                <div className="flex items-center mt-1">
                                    {!isNewVersion && (<span className="text-base sm:text-lg font-semibold text-gray-900">
                                        <VersionDisplay version={selectedVersion?.version || 'N/A'} />
                                    </span>)}
                                    <BaseChip
                                        type={publishStatusColor}
                                        text={publishText}
                                        className="ml-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action buttons - visible on both mobile and desktop */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {false && (<BaseButton
                                color="gray"
                                onClick={handleDownload}
                                disabled={isButtonsDisabled}
                                className="flex items-center space-x-2 px-4 py-2"
                                svgIcon={downloadIcon}
                            >
                                <span className="hidden sm:inline">Download</span>
                            </BaseButton>)}

                            <BaseButton
                                color="blue"
                                onClick={handleSaveAction}
                                disabled={isButtonsDisabled}
                                className="flex items-center space-x-2 px-4 py-2"
                                svgIcon={ActionIcon}
                                title={actionButtonText}
                            >
                                <span className="hidden sm:inline">{actionButtonText}</span>
                            </BaseButton>
                        </div>
                    </div>
                </div>

                {/* Additional info row */}
                {selectedReport && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 gap-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-4">
                                <span className="truncate">
                                    <span className="font-medium">CreatedOn:</span> {isNewVersion ? '---' : formatDateTime(selectedReport.creationDate)}
                                </span>
                                {selectedReport.modificationDate && (
                                    <span className="truncate">
                                        <span className="font-medium">ModifiedOn:</span> {isNewVersion ? '---' : formatDateTime(selectedReport.modificationDate)}
                                    </span>
                                )}
                                {selectedReport.editorId && (
                                    <span className="truncate">
                                        <span className="font-medium">ModifiedBy:</span> {selectedReport.editorId}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </BaseCard>

            {/* Save/Add Confirmation Modal */}
            <SaveConfirmationModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onConfirm={confirmSaveAction}
                reportName={selectedReport?.reportName}
                isNewVersion={isNewVersion}
                isLoading={isSaving}
            />

            {/* Download Confirmation Modal */}
            <DownloadConfirmationModal
                isOpen={showDownloadModal}
                onClose={() => setShowDownloadModal(false)}
                onConfirm={confirmDownload}
                reportName={selectedReport?.reportName}
            />
        </>
    );
}

export default ActionBar;