import { useSelector } from 'react-redux';
import { useGetCompaniesQuery } from '../services/report';
import { selectCurrentEnvironment } from '../features/app/appSelectors';
import type { Company } from '../types';

interface UseCompaniesReturn {
    companies: Company[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useCompanies = (): UseCompaniesReturn => {
    const currentEnvironment = useSelector(selectCurrentEnvironment);

    const {
        data: companies = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useGetCompaniesQuery(undefined, {
        skip: !currentEnvironment,
    });

    return {
        companies: currentEnvironment ? companies : [],
        loading: isLoading,
        error: isError ? (error as any)?.message || 'Failed to fetch companies' : null,
        refetch: () => refetch(),
    };
};