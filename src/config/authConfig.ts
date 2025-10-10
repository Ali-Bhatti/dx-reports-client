import type { Configuration } from '@azure/msal-browser';
import config from './config';

export const msalConfig: Configuration = {
  auth: {
    clientId: config.azureClientId,
    authority: config.azureAuthorityUrl,
    redirectUri: config.azureAuthFallBackUrl,
    postLogoutRedirectUri: config.azureAuthFallBackUrl,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true,
  },
};

export const loginRequest = {
  scopes: ['User.Read'],
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};