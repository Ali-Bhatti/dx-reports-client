import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../config/authConfig';
import config from '../config/config';

export const useAuth = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const login = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      console.error(e);
    });
  };

  const logout = () => {
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