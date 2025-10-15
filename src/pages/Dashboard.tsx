//import { useSelector } from 'react-redux';

import StatisticsCards from '../components/dashboard/StatisticsCards';
import ReportsList from '../components/dashboard/ReportList';
import VersionHistory from '../components/dashboard/VersionHistory';


export default function ReportsPage() {
    // Get statistics and selected report from Redux store


    return (
        <div>
            {/* KPIs */}
            <StatisticsCards />

            {/* Reports List */}
            <div className="mt-5">
                <ReportsList />
            </div>

            {/* Version History */}
            <VersionHistory />
        </div>
    );
}