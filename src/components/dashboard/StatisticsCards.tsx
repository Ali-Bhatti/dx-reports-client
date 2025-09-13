import type { ReportStatistics } from '../../types';
import BaseCard from '../shared/BaseCard';

interface StatisticsCardsProps {
    statistics: ReportStatistics[] | [];
    loading?: boolean;
    onClick?: () => void;
}

const StatisticsCards = ({
    statistics = [],
    loading = false,
    onClick
}: StatisticsCardsProps) => {
    if (loading) {
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

    if (!statistics?.length) {
        return null;
    }

    const baseClasses = "bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200";
    const interactiveClasses = onClick ? "cursor-pointer hover:border-gray-300" : "";
    return (
        <div className="bg-transparent">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 max-w-4xl">
                {statistics.map((s) => (
                    <BaseCard
                        dividers={false}
                        className={`${baseClasses} ${interactiveClasses}`}
                    >
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500 font-medium">
                                {s.label}
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {s.total}
                            </p>
                        </div>
                    </BaseCard>
                ))}
            </div>
        </div>
    );
};

export default StatisticsCards;
