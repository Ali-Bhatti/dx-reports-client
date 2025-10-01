const config = {
    apiBaseUrl: String(import.meta.env.VITE_API_BASE_URL || 'https://localhost:7074'),
    timeout: 5000,
    dxHost: String(import.meta.env.VITE_DX_HOST || 'https://localhost:7074'),
};
export default config;