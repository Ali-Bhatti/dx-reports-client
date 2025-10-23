import type { Environment } from '../types';

export const environments: Environment[] = [
    { id: 1, name: 'DEV', url: 'https://et-etrans-svc-reporting-dev-app.azurewebsites.net/' },
    { id: 2, name: 'UAT', url: '' },
    { id: 3, name: 'PROD', url: '' }
];

const config = {
    apiBaseUrl: String(import.meta.env.VITE_API_BASE_URL || 'https://localhost:7074/'),
    timeout: 5000,
    dxHost: String(import.meta.env.VITE_API_BASE_URL || 'https://localhost:7074/'),
    azureClientId: String(import.meta.env.VITE_AZURE_CLIENT_ID || ''),
    azureAuthorityUrl: String(import.meta.env.VITE_AZURE_AUTHORITY_URL || ''),
    azureAuthFallBackUrl: String(import.meta.env.VITE_AZURE_AUTH_FALL_BACK_URL || 'http://localhost:5173/login-callback'),
    enableAzureAuth: import.meta.env.VITE_ENABLE_AZURE_AUTH === 'false' ? false : true,
};
export default config;