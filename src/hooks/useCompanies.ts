import { useSelector } from 'react-redux';
import { useGetCompaniesQuery } from '../services/report';
import { selectCurrentEnvironment } from '../features/app/appSelectors';
import type { Company, Environment } from '../types';

interface UseCompaniesReturn {
    companies: Company[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

interface UseCompaniesOptions {
    environment?: Environment | null;
    useCopyModalEnvironment?: boolean;
}

export const useCompanies = (options?: UseCompaniesOptions): UseCompaniesReturn => {
    const globalEnvironment = useSelector(selectCurrentEnvironment);
    const currentEnvironment = options?.environment !== undefined ? options.environment : globalEnvironment;

    const {
        data: companies = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useGetCompaniesQuery(
        { useCopyModalEnvironment: options?.useCopyModalEnvironment || false },
        {
            skip: !currentEnvironment,
        }
    );

    return {
        companies: currentEnvironment ? companies : [],
        loading: isLoading,
        error: isError ? (error as any)?.message || 'Failed to fetch companies' : null,
        refetch: () => refetch(),
    };
};