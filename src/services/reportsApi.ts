import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { Report, ReportVersion, Company, ReportStatistics, ApiResponse, PaginatedResponse, LinkedPage, ReportVersionDetails } from '../types'
import type { RootState } from '../app/store'
import config from '../config/config';

// API Configuration
const API_BASE_URL = config.apiBaseUrl;

// Custom base query with dynamic base URL based on selected environment
const customBaseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const state = api.getState() as RootState;
    const currentEnvironment = state.app.currentEnvironment;
    const copyModalEnvironment = state.app.copyModalEnvironment;
    const useCopyModalEnv = typeof args === 'object' && 'meta' in args && (args.meta as any)?.useCopyModalEnvironment === true;

    // Determine which environment to use for the base URL
    let environmentToUse = currentEnvironment;
    if (useCopyModalEnv && copyModalEnvironment) {
        environmentToUse = copyModalEnvironment;
    }

    let baseUrl = API_BASE_URL;
    if (environmentToUse && environmentToUse.url) {
        baseUrl = environmentToUse.url;
    }

    // Create the base query with the dynamic URL
    const baseQuery = fetchBaseQuery({
        baseUrl: `${baseUrl}api/report/`,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json')
            // Add authentication headers here
            // headers.set('Authorization', `Bearer ${getToken()}`)
            return headers
        },
        // Transform response to match your ApiResponse structure
        responseHandler: async (response) => {
            const data = await response.json()
            return data
        },
    });

    return baseQuery(args, api, extraOptions);
};

export const reportsApi = createApi({
    reducerPath: 'reportsApi',
    baseQuery: customBaseQuery,
    tagTypes: ['Report', 'ReportVersion', 'Company', 'ReportStatistics', 'User', 'LinkedPage'],
    endpoints: (builder) => ({

        // Companies API
        getCompanies: builder.query<Company[], { useCopyModalEnvironment?: boolean; environmentId?: number }>({
            query: (params = {}) => ({
                url: 'companies',
                ...(params.useCopyModalEnvironment && {
                    meta: { useCopyModalEnvironment: true }
                })
            }),
            transformResponse: (response: ApiResponse<Company[]>) => response.data,
            providesTags: ['Company'],
            serializeQueryArgs: ({ queryArgs }) => {
                if (queryArgs.useCopyModalEnvironment && queryArgs.environmentId) {
                    return `companies-copyModal-${queryArgs.environmentId}`;
                }
                return queryArgs.useCopyModalEnvironment ? 'companies-copyModal' : 'companies-main';
            },
        }),

        getCompany: builder.query<Company, string>({
            query: (id) => `companies/${id}`,
            transformResponse: (response: ApiResponse<Company>) => response.data,
            providesTags: (_result, _error, id) => [{ type: 'Company', id }],
        }),

        // Reports API
        getReports: builder.query<PaginatedResponse<Report>, { companyId?: string; search?: string }>({
            query: ({ companyId, search }) => {
                const params = new URLSearchParams()
                if (search) params.append('search', search)
                return `companies/${companyId}/reports?${params}`
            },
            transformResponse: (response: ApiResponse<PaginatedResponse<Report>>) => {
                return response.data;
            },
            providesTags: (result) => {
                // Add null checking for result.data and ensure it's an array
                if (result?.data && Array.isArray(result.data)) {
                    return [
                        ...result.data.map(({ id }) => ({ type: 'Report' as const, id })),
                        { type: 'Report', id: 'LIST' },
                    ];
                }
                return [{ type: 'Report', id: 'LIST' }];
            },
        }),


        deleteReports: builder.mutation<void, { reportIds: string[]; companyId?: string }>({
            query: ({ reportIds }) => {
                const params = new URLSearchParams();
                params.append('ids', reportIds.join(','));
                return {
                    url: `reports?${params}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: (_result, _error, { companyId }) => {
                const tags: any[] = [{ type: 'Report', id: 'LIST' }];
                if (companyId) {
                    tags.push({ type: 'ReportStatistics', id: companyId });
                }
                return tags;
            },
        }),

        copyReports: builder.mutation<void, {
            destination_company_ids: number[];
            source_company_id: number;
            reports: Array<{
                ReportId: number;
                ReportVersionId: number;
                ReportName: string;
                RenderWhenNoData: boolean;
            }>;
        }>({
            query: (body) => ({
                url: 'copy',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Report', id: 'LIST' }],
        }),

        copyReportWithMetaData: builder.mutation<
            { message: string },
            { reportDetails: ReportVersionDetails; useCopyModalEnvironment?: boolean }
        >({
            query: ({ reportDetails, useCopyModalEnvironment = true }) => ({
                url: 'copy-with-metadata',
                method: 'POST',
                body: { request: reportDetails },
                ...(useCopyModalEnvironment && {
                    meta: { useCopyModalEnvironment: true }
                })
            }),
            invalidatesTags: [{ type: 'Report', id: 'LIST' }],
        }),

        getLinkedPages: builder.query<LinkedPage[], string>({
            query: (reportId) => `${reportId}/linked-pages`,
            transformResponse: (response: ApiResponse<LinkedPage[]>) => response.data,
            providesTags: (_result, _error, reportId) => [{ type: 'LinkedPage', id: reportId }],
        }),

        saveLinkedPages: builder.mutation<void, { reportId: string; pageIds: number[] }>({
            query: ({ reportId, pageIds }) => ({
                url: `${reportId}/generate-link`,
                method: 'POST',
                body: { pageIds },
            }),
            invalidatesTags: (_result, _error, { reportId }) => [{ type: 'LinkedPage', id: reportId }],
        }),

        // Report Versions API
        getReportVersions: builder.query<ReportVersion[], string>({
            query: (reportId) => `${reportId}/versions`,
            transformResponse: (response: ApiResponse<ReportVersion[]>) => {
                return response.data;
            },
            providesTags: (result, _, reportId) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'ReportVersion' as const, id })),
                        { type: 'ReportVersion', id: `LIST-${reportId}` },
                    ]
                    : [{ type: 'ReportVersion', id: `LIST-${reportId}` }],
        }),

        getVersionDetails: builder.query<ReportVersionDetails, { versionId: string | number; useCopyModalEnvironment?: boolean; environmentId?: number }>({
            query: ({ versionId, useCopyModalEnvironment }) => ({
                url: `versions/${versionId}`,
                ...(useCopyModalEnvironment && {
                    meta: { useCopyModalEnvironment: false }
                })
            }),
            transformResponse: (response: any) => {
                if (response && typeof response === 'object' && 'data' in response) {
                    return response.data;
                }
                return response;
            },
            providesTags: (_result, _error, { versionId }) => [{ type: 'ReportVersion', id: versionId }],
            serializeQueryArgs: ({ queryArgs }) => {
                const { versionId, useCopyModalEnvironment, environmentId } = queryArgs;
                if (useCopyModalEnvironment && environmentId) {
                    return `version-${versionId}-copyModal-${environmentId}`;
                }
                return useCopyModalEnvironment ? `version-${versionId}-copyModal` : `version-${versionId}-main`;
            },
        }),

        publishVersion: builder.mutation<ReportVersion, { reportId: string; versionId: number | string }>({
            query: ({ reportId, versionId }) => ({
                url: `${reportId}/versions/publish`,
                method: 'POST',
                body: { version_id: versionId },
            }),
            transformResponse: (response: ApiResponse<ReportVersion>) => response.data,
            invalidatesTags: (_result, _error, { reportId, versionId }) => [
                { type: 'ReportVersion' as const, id: versionId },
                { type: 'ReportVersion' as const, id: `LIST-${reportId}` }
            ],
        }),

        unpublishVersion: builder.mutation<ReportVersion, { reportId: string; versionId: number | string }>({
            query: ({ reportId, versionId }) => ({
                url: `${reportId}/versions/publish`,
                method: 'POST',
                body: { version_id: versionId, is_reset_published: true },
            }),
            transformResponse: (response: ApiResponse<ReportVersion>) => response.data,
            invalidatesTags: (_result, _error, { reportId, versionId }) => [
                { type: 'ReportVersion' as const, id: versionId },
                { type: 'ReportVersion' as const, id: `LIST-${reportId}` }
            ],
        }),

        deleteReportVersion: builder.mutation<void, { versionIds: string[] }>({
            query: ({ versionIds }) => {
                const params = new URLSearchParams();
                params.append('ids', versionIds.join(', '));
                return {
                    url: `versions?${params}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: (_result, _error, { versionIds }) => [
                ...versionIds.map(id => ({ type: 'ReportVersion' as const, id })),
                { type: 'ReportVersion', id: 'LIST' }
            ],
        }),

        downloadReportVersion: builder.mutation<Blob, { reportId: string; versionId: string }>({
            query: ({ reportId, versionId }) => ({
                url: `${reportId}/versions/${versionId}/download`,
                method: 'GET',
                responseHandler: async (response) => response.blob(),
            }),
        }),

        // Statistics API
        getReportStatistics: builder.query<ReportStatistics[], string>({
            query: (companyId) => `companies/${companyId}/report-kpis`,
            transformResponse: (response: ApiResponse<ReportStatistics[]>) => response.data,
            providesTags: (_result, _error, companyId) => [{ type: 'ReportStatistics', id: companyId }],
        }),

    }),
})

// Export hooks for each endpoint
export const {
    // Companies
    useGetCompaniesQuery,
    useGetCompanyQuery,

    // Reports
    useGetReportsQuery,
    useDeleteReportsMutation,
    useCopyReportsMutation,
    useGetLinkedPagesQuery,
    useSaveLinkedPagesMutation,
    useCopyReportWithMetaDataMutation,

    // Report Versions
    useGetReportVersionsQuery,
    useGetVersionDetailsQuery,
    useLazyGetVersionDetailsQuery,
    useDownloadReportVersionMutation,
    usePublishVersionMutation,
    useUnpublishVersionMutation,
    useDeleteReportVersionMutation,

    // Statistics
    useGetReportStatisticsQuery,
} = reportsApi

// Export the API reducer and middleware
export default reportsApi