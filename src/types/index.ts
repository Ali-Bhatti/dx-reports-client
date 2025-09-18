// Core data types for the Web Report Designer

export interface Report {
    id: string | number;
    reportName: string;
    createdOn?: string;
    modifiedOn?: string;
    modifiedBy?: string;
    active: boolean; // active/inactive
    companyId: string | number;
}

export interface ReportVersion {
    id: string | number;
    reportId: string | number;
    version: string;
    createdOn: string;
    modifiedOn: string;
    modifiedBy: string;
    status: string; // Published/Not Published
    isDefault: boolean; // Is this the default version for the report
    content?: any; // Report content/configuration
}

export interface Company {
    id: number;
    name: string;
    status?: string;
    licenseInfo?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface ReportStatistics {
    label: string,
    total: number
}

// API Response types
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    errors?: string[];
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
