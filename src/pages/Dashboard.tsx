import { useSelector } from 'react-redux';

import StatisticsCards from '../components/dashboard/StatisticsCards';
import ReportsList from '../components/dashboard/ReportList';
import VersionHistory from '../components/dashboard/VersionHistory';

import { selectSelectedReportId } from '../features/reports/reportsSelectors';

export default function ReportsPage() {
    // Get statistics and selected report from Redux store
    const selectedReport = useSelector(selectSelectedReportId);


    return (
        <div className="p-5 px-25">
            {/* KPIs */}
            <StatisticsCards />

            {/* Reports List */}
            <div className="mt-5">
                <ReportsList />
            </div>

            {/* Version History - Only shows when single report is selected */}
            {selectedReport && (
                <VersionHistory />
            )}
        </div>
    );
}