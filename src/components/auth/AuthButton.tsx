import { useAuth } from '../../hooks/useAuth';
import BaseButton from '../shared/BaseButton';

const AuthButton = () => {
  const { login, logout, isAuthenticated, account } = useAuth();

  if (isAuthenticated && account) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 ">
          Welcome, <span className="font-bold">{account.name || account.username}</span>
        </span>
        <BaseButton
          onClick={logout}
          size="small"
        >
          Sign Out
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