import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Checkbox } from '@progress/kendo-react-inputs';
import { SvgIcon } from '@progress/kendo-react-common';
import { infoCircleIcon, xCircleIcon } from '@progress/kendo-svg-icons';
import BaseModal from '../shared/BaseModal';
import BaseButton from '../shared/BaseButton';
import CompanySelector from '../dashboard/CompanySelector';
import EnvironmentSelector from '../dashboard/EnvironmentSelector';
import { useGetReportVersionsQuery } from '../../services/reportsApi';
import { selectCurrentEnvironment } from '../../features/app/appSelectors';
import { setCopyModalEnvironment } from '../../features/app/appSlice';
import type { Company, Report, Environment } from '../../types';

export interface CopyReportData {
    ReportId: number;
    ReportVersionId: number;
    ReportName: string;
    RenderWhenNoData: boolean;
}

interface CopyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (destinationCompany: Company, reports: CopyReportData[]) => void;
    reports?: Report[];
    isMultiple?: boolean;
    isLoading?: boolean;
}

export default function CopyModal({
    isOpen,
    onClose,
    onConfirm,
    reports = [],
    isMultiple = false,
    isLoading = false
}: CopyModalProps) {
    const dispatch = useDispatch();
    const currentGlobalEnvironment = useSelector(selectCurrentEnvironment);
    const [selectedEnvironment, setSelectedEnvironment] = useState<Environment | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [reportData, setReportData] = useState<Map<number, CopyReportData>>(new Map());

    const firstReport = reports[0];
    const { data: versions = [], isLoading: versionsLoading, isFetching: versionsFetching } = useGetReportVersionsQuery(
        String(firstReport?.id),
        { skip: !isOpen || !firstReport || isMultiple }
    );

    // Initialize environment and report data when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedEnvironment(currentGlobalEnvironment);
            dispatch(setCopyModalEnvironment(currentGlobalEnvironment));

            if (reports.length > 0) {
                const newReportData = new Map<number, CopyReportData>();
                reports.forEach(report => {
                    newReportData.set(Number(report.id), {
                        ReportId: Number(report.id),
                        ReportVersionId: 0,
                        ReportName: report.reportName,
                        RenderWhenNoData: report.renderWhenNoData || false
                    });
                });
                setReportData(newReportData);
            }
        } else {
            // Clear all state when modal closes
            setReportData(new Map());
            setSelectedCompany(null);
            setSelectedEnvironment(null);
            dispatch(setCopyModalEnvironment(null));
        }
    }, [isOpen]);

    // Set the latest version when versions are loaded or modal opens
    useEffect(() => {
        if (isOpen && !versionsLoading && !versionsFetching && versions.length > 0 && firstReport && !isMultiple) {
            const latestVersion = versions[versions.length - 1];
            setReportData(prev => {
                const newData = new Map(prev);
                const existing = newData.get(Number(firstReport.id));

                if (existing && (existing.ReportVersionId === 0 || !existing.ReportVersionId)) {
                    newData.set(Number(firstReport.id), {
                        ...existing,
                        ReportVersionId: Number(latestVersion.id)
                    });
                }
                return newData;
            });
        }
    }, [isOpen, versions, firstReport, isMultiple, versionsLoading, versionsFetching]);

    const handleEnvironmentChange = (environment: Environment | null) => {
        setSelectedEnvironment(environment);
        dispatch(setCopyModalEnvironment(environment));
        setSelectedCompany(null);
    };

    const handleCompanyChange = (company: Company | null) => {
        setSelectedCompany(company);
    };

    const handleReportDataChange = (reportId: number, updatedData: Partial<CopyReportData>) => {
        setReportData(prev => {
            const newData = new Map(prev);
            const existing = newData.get(reportId);
            if (existing) {
                newData.set(reportId, { ...existing, ...updatedData });
            }
            return newData;
        });
    };

    const handleConfirm = () => {
        if (selectedCompany) {
            const reportsToSubmit = Array.from(reportData.values());
            onConfirm(selectedCompany, reportsToSubmit);
        }
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    const currentReport = firstReport ? reportData.get(Number(firstReport.id)) : null;
    const selectedVersion = versions.find(v => v.id === currentReport?.ReportVersionId);

    return (
        <BaseModal
            title={`Copy Report${isMultiple ? 's' : ''}`}
            onClose={handleClose}
            size="lg"
            customWidth={500}
            autoHeight={true}
            body={
                <div className="space-y-6">
                    {/* Environment Selector */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            Destination Environment <span className="text-red-500">*</span>
                        </label>
                        <EnvironmentSelector
                            onEnvironmentChange={handleEnvironmentChange}
                            restoreSavedEnvironment={false}
                            selectedEnvironment={selectedEnvironment}
                        />
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                            <SvgIcon icon={infoCircleIcon} className="text-gray-400 flex-shrink-0" size="small" />
                            <span>Select the environment for the destination company</span>
                        </p>
                    </div>

                    {/* Company Selector */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            Destination Company <span className="text-red-500">*</span>
                        </label>
                        <CompanySelector
                            onCompanyChange={handleCompanyChange}
                            restoreSavedCompany={true}
                            currentEnvironment={selectedEnvironment}
                            disabled={!selectedEnvironment}
                            showEnvironmentMessage={!selectedEnvironment}
                            useCopyModalEnvironment={true}
                        />
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                            <SvgIcon icon={infoCircleIcon} className="text-gray-400 flex-shrink-0" size="small" />
                            <span>Select the company where you want to copy the report{isMultiple ? 's' : ''}</span>
                        </p>
                    </div>

                    {/* Single Report Configuration */}
                    {!isMultiple && firstReport && currentReport ? (
                        <div className="space-y-5">
                            <div className="border-t border-gray-200 pt-5">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Report Configuration</h3>

                                <div className="space-y-4">
                                    {/* Report Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Report Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            value={currentReport.ReportName}
                                            onChange={(e) => handleReportDataChange(Number(firstReport.id), { ReportName: e.value || '' })}
                                            className="w-full"
                                            disabled={isLoading}
                                            placeholder="Enter report name"
                                        />
                                    </div>

                                    {/* Version */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Version <span className="text-red-500">*</span>
                                        </label>
                                        <DropDownList
                                            data={versions}
                                            textField="version"
                                            dataItemKey="id"
                                            value={selectedVersion}
                                            onChange={(e) => handleReportDataChange(Number(firstReport.id), { ReportVersionId: Number(e.value.id) })}
                                            className="w-full"
                                            disabled={versions.length === 0 || isLoading}
                                        />
                                        {versions.length === 0 && (
                                            <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                                                <SvgIcon icon={xCircleIcon} className="text-red-600" size="small" />
                                                No versions available for this report
                                            </p>
                                        )}
                                        {selectedVersion && (
                                            <p className="text-xs text-gray-500 mt-1.5">
                                                {selectedVersion.isPublished ? '✓ Published • ' : '✗ Unpublished • '}
                                                Created: {new Date(selectedVersion.creationDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>

                                    {/* Render Options */}
                                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={currentReport.RenderWhenNoData}
                                                disabled={isLoading}
                                                onChange={(e) => handleReportDataChange(Number(firstReport.id), { RenderWhenNoData: e.value || false })}
                                            />
                                            <label className="text-sm text-gray-900 cursor-pointer" onClick={() => !isLoading && handleReportDataChange(Number(firstReport.id), { RenderWhenNoData: !currentReport.RenderWhenNoData })}>
                                                Render with no Data
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-2 ml-6">
                                            Enable this to generate the report even when no data is available
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            }
            actions={
                <>
                    <BaseButton color="gray" onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </BaseButton>
                    <BaseButton
                        color="blue"
                        onClick={handleConfirm}
                        disabled={!selectedCompany || (!isMultiple && (!currentReport || currentReport.ReportVersionId === 0))
                            || versions.length === 0 || isLoading}
                        typeVariant={isLoading ? 'loader' : 'default'}
                    >
                        Copy
                    </BaseButton>
                </>
            }
        />
    );
}