import { useGetCompaniesQuery } from '../services/report';
import type { Company } from '../types';

interface UseCompaniesReturn {
    companies: Company[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useCompanies = (): UseCompaniesReturn => {
    const {
        data: companies = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useGetCompaniesQuery();

    console.log('useCompanies - companies:', companies);
    return {
        companies,
        loading: isLoading,
        error: isError ? (error as any)?.message || 'Failed to fetch companies' : null,
        refetch: () => refetch(),
    };
};