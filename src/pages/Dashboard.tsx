//import * as React from 'react';
import { useSelector } from 'react-redux';

import StatisticsCards from '../components/dashboard/StatisticsCards';
import ReportsList from '../components/reports/ReportList';
import VersionHistory from '../components/reports/VersionHistory';

import { selectReportStatistics, selectSelectedReportId } from '../features/reports/reportsSelectors';

export default function ReportsPage() {
    // Get statistics and selected report from Redux store
    const statistics = useSelector(selectReportStatistics);
    const selectedReport = useSelector(selectSelectedReportId);


    return (
        <div className="min-h-screen bg-neutral-100">

            <div className="p-5 px-25">
                {/* KPIs */}
                <StatisticsCards statistics={statistics} />

                {/* Reports List */}
                <div className="mt-5">
                    <ReportsList />
                </div>

                {/* Version History - Only shows when single report is selected */}
                {selectedReport && (
                    <VersionHistory />
                )}
            </div>
        </div>
    );
}