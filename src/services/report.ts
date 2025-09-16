import type { Report, ReportVersion, Company, User, ReportStatistics, PaginatedResponse } from '../types';

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
    ): Promise<T> {
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
            return data as T;
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

        return this.request<PaginatedResponse<Report>>(`/api/reports?${params}`);
    }

    async getReport(id: string): Promise<Report> {
        return this.request<Report>(`/api/reports/${id}`);
    }

    async createReport(report: Partial<Report>): Promise<Report> {
        return this.request<Report>('/api/reports', {
            method: 'POST',
            body: JSON.stringify(report),
        });
    }

    async updateReport(id: string, report: Partial<Report>): Promise<Report> {
        return this.request<Report>(`/api/reports/${id}`, {
            method: 'PUT',
            body: JSON.stringify(report),
        });
    }

    async deleteReport(id: string): Promise<void> {
        await this.request(`/api/reports/${id}`, {
            method: 'DELETE',
        });
    }

    async copyReport(id: string): Promise<Report> {
        return this.request<Report>(`/api/reports/${id}/copy`, {
            method: 'POST',
        });
    }

    // Report Versions API
    async getReportVersions(reportId: string): Promise<ReportVersion[]> {
        return this.request<ReportVersion[]>(`/api/reports/${reportId}/versions`);
    }

    async createReportVersion(reportId: string, version: Partial<ReportVersion>): Promise<ReportVersion> {
        return this.request<ReportVersion>(`/api/reports/${reportId}/versions`, {
            method: 'POST',
            body: JSON.stringify(version),
        });
    }

    async publishVersion(reportId: string, versionId: string): Promise<ReportVersion> {
        return this.request<ReportVersion>(`/api/reports/${reportId}/versions/${versionId}/publish`, {
            method: 'POST',
        });
    }

    async downloadVersion(reportId: string, versionId: string): Promise<Blob> {
        const response = await fetch(`${this.baseURL}/api/reports/${reportId}/versions/${versionId}/download`);
        return response.blob();
    }

    // Companies API
    async getCompanies(): Promise<Company[]> {
        return this.request<Company[]>('/api/companies');
    }

    async getCompany(id: string): Promise<Company> {
        return this.request<Company>(`/api/companies/${id}`);
    }

    // Statistics API
    async getReportStatistics(companyId?: string): Promise<ReportStatistics> {
        const params = companyId ? `?companyId=${companyId}` : '';
        return this.request<ReportStatistics>(`/api/reports/statistics${params}`);
    }

    // Users API
    async getCurrentUser(): Promise<User> {
        return this.request<User>('/api/users/me');
    }

    async getUsers(): Promise<User[]> {
        return this.request<User[]>('/api/users');
    }
}

export const apiService = new ApiService();
export default apiService;
