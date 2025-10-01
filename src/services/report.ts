import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Report, ReportVersion, Company, User, ReportStatistics, ApiResponse, PaginatedResponse } from '../types'
import config from '../config/config';

// API Configuration
const API_BASE_URL = config.apiBaseUrl;

// Custom base query with your existing request logic
const customBaseQuery = fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/`,
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
            query: () => 'report/companies',
            transformResponse: (response: ApiResponse<Company[]>) => response.data,
            providesTags: ['Company'],
        }),

        getCompany: builder.query<Company, string>({
            query: (id) => `companies/${id}`,
            transformResponse: (response: ApiResponse<Company>) => response.data,
            providesTags: (result, error, id) => [{ type: 'Company', id }],
        }),

        // Reports API
        getReports: builder.query<PaginatedResponse<Report>, { companyId?: string; search?: string }>({
            query: ({ companyId, search }) => {
                const params = new URLSearchParams()
                if (search) params.append('search', search)
                return `report/companies/${companyId}/reports?${params}`
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

        getReport: builder.query<Report, string>({
            query: (id) => `reports/${id}`,
            transformResponse: (response: ApiResponse<Report>) => response.data,
            providesTags: (_result, _error, id) => [{ type: 'Report', id }],
        }),

        createReport: builder.mutation<Report, Partial<Report>>({
            query: (report) => ({
                url: 'reports',
                method: 'POST',
                body: report,
            }),
            transformResponse: (response: ApiResponse<Report>) => response.data,
            invalidatesTags: [{ type: 'Report', id: 'LIST' }],
        }),

        updateReport: builder.mutation<Report, { id: string; report: Partial<Report> }>({
            query: ({ id, report }) => ({
                url: `reports/${id}`,
                method: 'PUT',
                body: report,
            }),
            transformResponse: (response: ApiResponse<Report>) => response.data,
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Report', id }],
        }),

        deleteReport: builder.mutation<void, string>({
            query: (id) => ({
                url: `reports/${id}`,
                method: 'DELETE',
            }),
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
            query: (reportId) => `report/${reportId}/versions`,
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

        createReportVersion: builder.mutation<ReportVersion, { reportId: string; version: Partial<ReportVersion> }>({
            query: ({ reportId, version }) => ({
                url: `reports/${reportId}/versions`,
                method: 'POST',
                body: version,
            }),
            transformResponse: (response: ApiResponse<ReportVersion>) => response.data,
            invalidatesTags: (_result, _error, { reportId }) => [
                { type: 'ReportVersion', id: `LIST-${reportId}` }
            ],
        }),

        publishVersion: builder.mutation<ReportVersion, { reportId: string; versionId: string }>({
            query: ({ reportId, versionId }) => ({
                url: `reports/${reportId}/versions/${versionId}/publish`,
                method: 'POST',
            }),
            transformResponse: (response: ApiResponse<ReportVersion>) => response.data,
            invalidatesTags: (_result, _error, { reportId, versionId }) => [
                { type: 'ReportVersion', id: versionId },
                { type: 'ReportVersion', id: `LIST-${reportId}` }
            ],
        }),

        // NEW: Unpublish version mutation
        unpublishVersion: builder.mutation<ReportVersion, { reportId: string; versionId: string }>({
            query: ({ reportId, versionId }) => ({
                url: `reports/${reportId}/versions/${versionId}/unpublish`,
                method: 'POST',
            }),
            transformResponse: (response: ApiResponse<ReportVersion>) => response.data,
            invalidatesTags: (_result, _error, { reportId, versionId }) => [
                { type: 'ReportVersion', id: versionId },
                { type: 'ReportVersion', id: `LIST-${reportId}` }
            ],
        }),

        // NEW: Delete single version mutation
        deleteReportVersion: builder.mutation<void, { reportId: string; versionId: string }>({
            query: ({ reportId, versionId }) => ({
                url: `reports/${reportId}/versions/${versionId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, { reportId, versionId }) => [
                { type: 'ReportVersion', id: versionId },
                { type: 'ReportVersion', id: `LIST-${reportId}` }
            ],
        }),

        // NEW: Delete multiple versions mutation
        deleteMultipleReportVersions: builder.mutation<void, { reportId: string; versionIds: string[] }>({
            query: ({ reportId, versionIds }) => ({
                url: `reports/${reportId}/versions/bulk-delete`,
                method: 'POST',
                body: { versionIds },
            }),
            invalidatesTags: (_result, _error, { reportId, versionIds }) => [
                ...versionIds.map(id => ({ type: 'ReportVersion' as const, id })),
                { type: 'ReportVersion', id: `LIST-${reportId}` }
            ],
        }),

        // Statistics API
        getReportStatistics: builder.query<ReportStatistics[], string>({
            query: (companyId) => `report/companies/${companyId}/report-kpis`,
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
    useGetReportQuery,
    useCreateReportMutation,
    useUpdateReportMutation,
    useDeleteReportMutation,
    useCopyReportMutation,

    // Report Versions
    useGetReportVersionsQuery,
    useCreateReportVersionMutation,
    usePublishVersionMutation,
    useUnpublishVersionMutation,
    useDeleteReportVersionMutation,
    useDeleteMultipleReportVersionsMutation,

    // Statistics
    useGetReportStatisticsQuery,

    // Users
    useGetCurrentUserQuery,
    useGetUsersQuery,
} = reportsApi

// Export the API reducer and middleware
export default reportsApi