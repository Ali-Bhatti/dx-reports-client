import { useState, useEffect } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Checkbox } from '@progress/kendo-react-inputs';
import { SvgIcon } from '@progress/kendo-react-common';
import { infoCircleIcon, fileIcon, xCircleIcon } from '@progress/kendo-svg-icons';
import BaseModal from '../shared/BaseModal';
import BaseButton from '../shared/BaseButton';
import CompanySelector from '../dashboard/CompanySelector';
import { useGetReportVersionsQuery } from '../../services/report';
import type { Company, Report, ReportVersion } from '../../types';

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
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [reportData, setReportData] = useState<Map<number, CopyReportData>>(new Map());

    // Fetch versions for the first report (for single report case)
    const firstReport = reports[0];
    const { data: versions = [] } = useGetReportVersionsQuery(
        String(firstReport?.id),
        { skip: !isOpen || !firstReport || isMultiple }
    );

    useEffect(() => {
        if (isOpen && reports.length > 0 && reportData.size === 0) {
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
        } else if (!isOpen) {
            setReportData(new Map());
            setSelectedCompany(null);
        }
    }, [isOpen, reports]);

    // Set the latest version when versions are loaded
    useEffect(() => {
        if (versions.length > 0 && firstReport && !isMultiple) {
            //const latestVersion = versions.find(v => v.isPublished) || versions[0];
            const latestVersion = versions[versions.length - 1];
            setReportData(prev => {
                const newData = new Map(prev);
                const existing = newData.get(Number(firstReport.id));
                if (existing && existing.ReportVersionId === 0) {
                    newData.set(Number(firstReport.id), {
                        ...existing,
                        ReportVersionId: Number(latestVersion.id)
                    });
                }
                return newData;
            });
        }
    }, [versions, firstReport, isMultiple]);

    const handleCompanyChange = (company: Company | null) => {
        setSelectedCompany(company);
    };

    const handleReportNameChange = (reportId: number, newName: string) => {
        setReportData(prev => {
            const newData = new Map(prev);
            const existing = newData.get(reportId);
            if (existing) {
                newData.set(reportId, { ...existing, ReportName: newName });
            }
            return newData;
        });
    };

    const handleVersionChange = (reportId: number, version: ReportVersion) => {
        setReportData(prev => {
            const newData = new Map(prev);
            const existing = newData.get(reportId);
            if (existing) {
                newData.set(reportId, { ...existing, ReportVersionId: Number(version.id) });
            }
            return newData;
        });
    };

    const handleRenderCheckboxChange = (reportId: number, checked: boolean) => {
        setReportData(prev => {
            const newData = new Map(prev);
            const existing = newData.get(reportId);
            if (existing) {
                newData.set(reportId, { ...existing, RenderWhenNoData: checked });
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
            body={
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            Destination Company <span className="text-red-500">*</span>
                        </label>
                        <CompanySelector
                            onCompanyChange={handleCompanyChange}
                            restoreSavedCompany={true}
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
                                            onChange={(e) => handleReportNameChange(Number(firstReport.id), e.value || '')}
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
                                            onChange={(e) => handleVersionChange(Number(firstReport.id), e.value)}
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
                                                {selectedVersion.isPublished && '✓ Published • '}
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
                                                onChange={(e) => handleRenderCheckboxChange(Number(firstReport.id), e.value || false)}
                                            />
                                            <label className="text-sm text-gray-900 cursor-pointer" onClick={() => !isLoading && handleRenderCheckboxChange(Number(firstReport.id), !currentReport.RenderWhenNoData)}>
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
                    ) : isMultiple && reports.length > 0 ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <SvgIcon icon={infoCircleIcon} className="text-blue-600 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-blue-900 mb-2">
                                        Copying {reports.length} Report{reports.length > 1 ? 's' : ''}
                                    </p>
                                    <div className="bg-white rounded-lg border border-blue-200 p-3 mb-3 max-h-32 overflow-y-auto">
                                        <ul className="space-y-1.5">
                                            {reports.map((report) => (
                                                <li key={report.id} className="text-sm text-gray-700 flex items-center gap-2">
                                                    <SvgIcon icon={fileIcon} className="text-blue-600" size="small" />
                                                    {report.reportName}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <p className="text-xs text-blue-700">
                                        The latest published version of each report will be copied with default settings
                                    </p>
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