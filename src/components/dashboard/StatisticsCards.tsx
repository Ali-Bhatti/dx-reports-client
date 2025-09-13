import React from 'react';
import type { ReportStatistics } from '../../types';
import InfoCard from '../shared/InfoCard';

interface StatisticsCardsProps {
    statistics: ReportStatistics[] | [];
    loading?: boolean;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
    statistics = [],
    loading = false
}) => {
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

    return (
        <div className="bg-transparent">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 max-w-4xl">
                {statistics.map((s) => (
                    <InfoCard key={s.label} title={s.label} value={s.total} />
                ))}
            </div>
        </div>
    );
};

export default StatisticsCards;
