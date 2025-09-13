// Core data types for the Web Report Designer

export interface Report {
    id: string;
    name: string;
    creationDate: string;
    modifiedOn: string;
    modifiedBy: string;
    status: boolean; // active/inactive
    companyId: string;
    companyName: string;
}

export interface ReportVersion {
    id: string;
    reportId: string;
    version: string;
    creationDate: string;
    modifiedOn: string;
    modifiedBy: string;
    isPublished: boolean;
    content?: any; // Report content/configuration
}

export interface Company {
    id: number;
    name: string;
    status: string;
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
