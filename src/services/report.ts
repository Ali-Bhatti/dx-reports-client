import type { Report, ReportVersion, Company, User, ReportStatistics, ApiResponse, PaginatedResponse } from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.fleetgo.com';

class ApiService {
    private baseURL: string;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;

        const defaultHeaders = {
            'Content-Type': 'application/json',
            // Add authentication headers here
            // 'Authorization': `Bearer ${getToken()}`,
        };

        const config: RequestInit = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Reports API
    async getReports(companyId?: string, search?: string): Promise<PaginatedResponse<Report>> {
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        if (search) params.append('search', search);

        const response = await this.request<PaginatedResponse<Report>>(`/api/reports?${params}`);
        return response.data;
    }

    async getReport(id: string): Promise<Report> {
        const response = await this.request<Report>(`/api/reports/${id}`);
        return response.data;
    }

    async createReport(report: Partial<Report>): Promise<Report> {
        const response = await this.request<Report>('/api/reports', {
            method: 'POST',
            body: JSON.stringify(report),
        });
        return response.data;
    }

    async updateReport(id: string, report: Partial<Report>): Promise<Report> {
        const response = await this.request<Report>(`/api/reports/${id}`, {
            method: 'PUT',
            body: JSON.stringify(report),
        });
        return response.data;
    }

    async deleteReport(id: string): Promise<void> {
        await this.request<void>(`/api/reports/${id}`, {
            method: 'DELETE',
        });
        // No return needed for void
    }

    async copyReport(id: string): Promise<Report> {
        const response = await this.request<Report>(`/api/reports/${id}/copy`, {
            method: 'POST',
        });
        return response.data;
    }

    // Report Versions API
    async getReportVersions(reportId: string): Promise<ReportVersion[]> {
        const response = await this.request<ReportVersion[]>(`/api/reports/${reportId}/versions`);
        return response.data;
    }

    async createReportVersion(reportId: string, version: Partial<ReportVersion>): Promise<ReportVersion> {
        const response = await this.request<ReportVersion>(`/api/reports/${reportId}/versions`, {
            method: 'POST',
            body: JSON.stringify(version),
        });
        return response.data;
    }

    async publishVersion(reportId: string, versionId: string): Promise<ReportVersion> {
        const response = await this.request<ReportVersion>(`/api/reports/${reportId}/versions/${versionId}/publish`, {
            method: 'POST',
        });
        return response.data;
    }

    async downloadVersion(reportId: string, versionId: string): Promise<Blob> {
        const response = await fetch(`${this.baseURL}/api/reports/${reportId}/versions/${versionId}/download`);
        return response.blob();
    }

    // Companies API
    async getCompanies(): Promise<Company[]> {
        const response = await this.request<Company[]>('/api/companies');
        return response.data;
    }

    async getCompany(id: string): Promise<Company> {
        const response = await this.request<Company>(`/api/companies/${id}`);
        return response.data;
    }

    // Statistics API
    async getReportStatistics(companyId?: string): Promise<ReportStatistics> {
        const params = companyId ? `?companyId=${companyId}` : '';
        const response = await this.request<ReportStatistics>(`/api/reports/statistics${params}`);
        return response.data;
    }

    // Users API
    async getCurrentUser(): Promise<User> {
        const response = await this.request<User>('/api/users/me');
        return response.data;
    }

    async getUsers(): Promise<User[]> {
        const response = await this.request<User[]>('/api/users');
        return response.data;
    }
}

export const apiService = new ApiService();
export default apiService;
