// Core data types for the Web Report Designer

export interface Report {
    id: string | number;
    reportName: string;
    createdOn?: string;
    modifiedOn?: string;
    modifiedBy?: string;
    merged: boolean; // active/inactive
    companyId: string | number;
}

export interface ReportVersion {
    id: string | number;
    reportId?: string | number;
    reportLayoutID?: string | number;
    version: string | number;
    createdOn: string;
    createdBy?: string;
    modifiedOn?: string | null;
    modifiedBy?: string;
    isPublished: boolean;
    isDefault: boolean;
    content?: any;
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
    label: string;
    count: number;
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
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
}


export interface ActionContext {
    type: 'edit' | 'new_version' | null;
    reportLayoutID?: number;
    versionId?: number;
    selectedVersion?: ReportVersion | null;
}

export interface PublishModalState {
    isOpen: boolean;
    versionId: number | null;
    isResetPublished?: boolean;
}

export interface LinkedPage {
    pageId: number;
    name: string;
    isLinked: boolean;
}