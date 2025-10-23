import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../config/authConfig';
import config from '../config/config';

export const useAuth = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  if (!config.enableAzureAuth) {
    return {
      login: () => console.log('Azure authentication is disabled'),
      logout: () => {
        localStorage.removeItem('selectedCompanyId');
        console.log('Azure authentication is disabled');
      },
      isAuthenticated: true,
      account: { name: 'Guest User', username: 'guest' },
    };
  }

  const login = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      console.error(e);
    });
  };

  const logout = () => {
    // Clear selected company from localStorage
    localStorage.removeItem('selectedCompanyId');
    localStorage.removeItem('selectedEnvironment');

    instance.logoutRedirect({
      postLogoutRedirectUri: config.azureAuthFallBackUrl,
    });
  };

  const getAccount = () => {
    return accounts[0];
  };

  return {
    login,
    logout,
    isAuthenticated,
    account: getAccount(),
  };
};