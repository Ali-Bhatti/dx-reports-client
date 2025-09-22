import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import BaseButton from '../shared/BaseButton';
import BaseCard from '../shared/BaseCard';
import DownloadConfirmationModal from '../modals/DownloadConfirmationModal ';
import SaveConfirmationModal from '../modals/SaveConfirmationModal';
import BaseChip from '../shared/BaseChip';
import { useNotifications } from '../../hooks/useNotifications';

import {
    saveIcon,
    plusIcon,
    downloadIcon,
} from '@progress/kendo-svg-icons';

function ActionBar() {
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);

    const { showNotification } = useNotifications();

    // Get data from Redux store
    const { reports, history, selectedReportId, actionContext } = useSelector((state: RootState) => ({
        reports: state.reports.reports,
        history: state.reports.history,
        selectedReportId: state.reports.selectedReportId,
        actionContext: state.reports.actionContext
    }));

    // Find selected report and version
    const selectedReport = reports.find(report => report.id === actionContext.reportId);
    const selectedVersion = selectedReportId
        ? history.find(version => version.id === actionContext.versionId)
        : null;

    // Determine action button text and icon
    const isNewVersion = actionContext.type === 'new_version';
    const actionButtonText = isNewVersion ? 'Add Version' : 'Save';
    const ActionIcon = isNewVersion ? plusIcon : saveIcon;
    const publishStatusColor = selectedVersion?.isPublished ? 'green' : 'yellow';
    const publishText = `${!selectedVersion?.isPublished ? 'Not' : ``} Published`

    const handleSaveAction = () => {
        setShowSaveModal(true);
    };

    const handleDownload = () => {
        setShowDownloadModal(true);
    };

    const confirmSaveAction = () => {
        showNotification('success',
            isNewVersion
                ? `New version created successfully for <strong>${selectedReport?.reportName}</strong>`
                : `Report <strong>${selectedReport?.reportName}</strong> saved successfully`
        );
        setShowSaveModal(false);
        // You can dispatch appropriate actions here
    };

    const confirmDownload = () => {
        // Handle download logic here
        showNotification('success', `Report <strong>${selectedReport?.reportName}</strong> is being downloaded...`);
        setShowDownloadModal(false);
    };


    return (
        <>
            <BaseCard>
                <div className="flex items-center justify-between">
                    {/* Left side - Report info */}
                    <div className="flex items-center space-x-6">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                Report Name
                            </span>
                            <span className="text-lg font-semibold text-gray-900 mt-1">
                                {selectedReport?.reportName || 'No Report Selected'}
                            </span>
                        </div>

                        <div className="h-8 w-px bg-gray-300"></div>

                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                Version
                            </span>
                            <div className="flex items-center mt-1">
                                <span className="text-lg font-semibold text-gray-900">
                                    {selectedVersion?.version || 'N/A'}
                                </span>
                                <BaseChip
                                    type={publishStatusColor}
                                    text={publishText}
                                    className="ml-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right side - Action buttons */}
                    <div className="flex items-center space-x-3">
                        <BaseButton
                            color="gray"
                            onClick={handleDownload}
                            disabled={!selectedReport}
                            className="flex items-center space-x-2 px-4 py-2"
                            svgIcon={downloadIcon}
                        >
                            Download
                        </BaseButton>

                        <BaseButton
                            color="blue"
                            onClick={handleSaveAction}
                            disabled={!selectedReport}
                            className="flex items-center space-x-2 px-4 py-2"
                            svgIcon={ActionIcon}
                        >
                            {actionButtonText}
                        </BaseButton>
                    </div>
                </div>

                {/* Additional info row */}
                {selectedReport && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                                <span>
                                    <span className="font-medium">Created:</span> {selectedReport.createdOn}
                                </span>
                                <span>
                                    <span className="font-medium">Modified:</span> {selectedReport.modifiedOn}
                                </span>
                                <span>
                                    <span className="font-medium">By:</span> {selectedReport.modifiedBy}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <BaseChip
                                    type={selectedReport.active ? "green" : "red"}
                                    text={selectedReport.active ? "Active" : "Inactive"}
                                />
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