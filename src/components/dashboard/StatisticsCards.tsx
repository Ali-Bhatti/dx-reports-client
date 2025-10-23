import { useSelector } from 'react-redux';
import { useGetReportStatisticsQuery } from '../../services/report';
import BaseCard from '../shared/BaseCard';
import { selectCurrentCompany } from '../../features/reports/reportsSelectors';

interface StatisticsCardsProps {
    onClick?: () => void;
}

const StatisticsCards = ({ onClick }: StatisticsCardsProps) => {
    // Get current company from Redux store
    const currentCompany = useSelector(selectCurrentCompany);

    const {
        data: statistics = [],
        isLoading: loading,
        isFetching: fetching,
    } = useGetReportStatisticsQuery(
        currentCompany?.toString() || '',
        { skip: !currentCompany }
    );

    // Handle loading state
    if (loading || fetching) {
        return (
            <div className="grid grid-cols-3 gap-6 mb-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Handle empty state
    if (!currentCompany) {
        return (
            <BaseCard className='p-6 mb-5'>
                <p className="text-gray-500 text-center">No statistics available</p>
            </BaseCard>
        );
    }

    const baseClasses = "bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200";
    const interactiveClasses = onClick ? "cursor-pointer hover:border-gray-300" : "";
    return (
        <div className="bg-transparent">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 max-w-4xl">
                {statistics.map((s, index) => (
                    <BaseCard
                        dividers={false}
                        className={`${baseClasses} ${interactiveClasses}`}
                        key={`${s.label}_${index}`}
                    >
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500 font-medium">
                                {s.label}
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {s.count}
                            </p>
                        </div>
                    </BaseCard>
                ))}
            </div>
        </div>
    );
};

export default StatisticsCards;
