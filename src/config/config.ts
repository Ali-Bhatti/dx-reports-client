const config = {
    apiBaseUrl: String(import.meta.env.VITE_API_BASE_URL || 'https://localhost:7074'),
    timeout: 5000,
    dxHost: String(import.meta.env.VITE_DX_HOST || 'https://localhost:7074'),
    azureClientId: String(import.meta.env.VITE_AZURE_CLIENT_ID || ''),
    azureAuthorityUrl: String(import.meta.env.VITE_AZURE_AUTHORITY_URL || ''),
    azureAuthFallBackUrl: String(import.meta.env.VITE_AZURE_AUTH_FALL_BACK_URL || 'http://localhost:5173/login-callback'),
};
export default config;