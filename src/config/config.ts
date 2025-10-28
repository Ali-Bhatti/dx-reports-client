import type { Environment } from '../types';

export const environments: Environment[] = [
    { id: 1, name: 'DEV', url: import.meta.env.VITE_API_DEV_BASE_URL },
    { id: 2, name: 'UAT1', url: import.meta.env.VITE_API_UAT1_01_BASE_URL },
    { id: 3, name: 'UAT2', url: import.meta.env.VITE_API_UAT1_02_BASE_URL },
    { id: 4, name: 'PROD1', url: import.meta.env.VITE_API_PROD1_01_BASE_URL },
    { id: 5, name: 'PROD2', url: import.meta.env.VITE_API_PROD1_02_BASE_URL }
];

const config = {
    apiBaseUrl: String(import.meta.env.VITE_API_DEV_BASE_URL || 'https://localhost:7074/'),
    timeout: 5000,
    dxHost: String(import.meta.env.VITE_API_DEV_BASE_URL || 'https://localhost:7074/'),
    azureClientId: String(import.meta.env.VITE_AZURE_CLIENT_ID || ''),
    azureAuthorityUrl: String(import.meta.env.VITE_AZURE_AUTHORITY_URL || ''),
    azureAuthFallBackUrl: String(import.meta.env.VITE_AZURE_AUTH_FALL_BACK_URL || 'http://localhost:5173/login-callback'),
    enableAzureAuth: import.meta.env.VITE_ENABLE_AZURE_AUTH === 'false' ? false : true,
};
export default config;