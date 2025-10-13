import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Report, ReportVersion, Company, User, ReportStatistics, ApiResponse, PaginatedResponse } from '../types'
import config from '../config/config';

// API Configuration
const API_BASE_URL = config.apiBaseUrl;

// Custom base query with your existing request logic
const customBaseQuery = fetchBaseQuery({
    baseUrl: `${API_BASE_URL}api/report/`,
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
})

export const reportsApi = createApi({
    reducerPath: 'reportsApi',
    baseQuery: customBaseQuery,
    tagTypes: ['Report', 'ReportVersion', 'Company', 'ReportStatistics', 'User'],
    endpoints: (builder) => ({

        // Companies API
        getCompanies: builder.query<Company[], void>({
            query: () => 'companies',
            transformResponse: (response: ApiResponse<Company[]>) => response.data,
            providesTags: ['Company'],
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


        deleteReports: builder.mutation<void, { reportIds: string[] }>({
            query: ({ reportIds }) => {
                const params = new URLSearchParams();
                params.append('ids', reportIds.join(','));
                return {
                    url: `reports?${params}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: [{ type: 'Report', id: 'LIST' }],
        }),

        copyReport: builder.mutation<Report, string>({
            query: (id) => ({
                url: `reports/${id}/copy`,
                method: 'POST',
            }),
            transformResponse: (response: ApiResponse<Report>) => response.data,
            invalidatesTags: [{ type: 'Report', id: 'LIST' }],
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

        // Users API
        getCurrentUser: builder.query<User, void>({
            query: () => 'users/me',
            transformResponse: (response: ApiResponse<User>) => response.data,
            providesTags: ['User'],
        }),

        getUsers: builder.query<User[], void>({
            query: () => 'users',
            transformResponse: (response: ApiResponse<User[]>) => response.data,
            providesTags: ['User'],
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
    useCopyReportMutation,

    // Report Versions
    useGetReportVersionsQuery,
    useDownloadReportVersionMutation,
    usePublishVersionMutation,
    useUnpublishVersionMutation,
    useDeleteReportVersionMutation,

    // Statistics
    useGetReportStatisticsQuery,

    // Users
    useGetCurrentUserQuery,
    useGetUsersQuery,
} = reportsApi

// Export the API reducer and middleware
export default reportsApi