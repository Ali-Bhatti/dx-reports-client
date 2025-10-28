import { useAuth } from '../../hooks/useAuth';
import BaseButton from '../shared/BaseButton';
import { logoutIcon } from '@progress/kendo-svg-icons';

const AuthButton = () => {
  const { login, logout, isAuthenticated, account } = useAuth();

  if (isAuthenticated && account) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 hidden sm:inline">
          Welcome, <span className="font-bold">{account.name || account.username}</span>
        </span>
        <BaseButton
          onClick={logout}
          svgIcon={logoutIcon}
          size="small"
          title="Sign Out"
        >
          <span className="hidden sm:inline">Sign Out</span>
        </BaseButton>
      </div>
    );
  }

  return (
    <BaseButton
      onClick={login}
      size="small"
    >
      Sign In
    </BaseButton>
  );
};

export default AuthButton;