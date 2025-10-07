import { type ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import BaseButton from '../shared/BaseButton';
import { useMsal } from '@azure/msal-react';
import BaseLoader from '../shared/BaseLoader';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { isAuthenticated, login } = useAuth();
  const { inProgress } = useMsal();

  // Show loader while MSAL is processing authentication
  if (inProgress !== 'none') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <BaseLoader loadingText="Processing..." />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        {fallback || (
          <div className="max-w-lg w-full mx-4">
            <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
              {/* FleetGo Logo */}
              <div className="mb-10 flex justify-center">
                <img
                  src="/fleetGo.png"
                  alt="FleetGo Logo"
                  className="h-28 w-auto"
                />
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                Welcome to Reporting Tool
              </h2>

              {/* Description */}
              <p className="text-gray-600 mb-12 text-lg">
                Sign in to access your reporting dashboard and manage your reports.
              </p>

              {/* Sign In Button */}
              <BaseButton
                onClick={login}
                color="blue"
                className="w-full !py-4 !text-lg"
              >
                Sign In
              </BaseButton>


            </div>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;