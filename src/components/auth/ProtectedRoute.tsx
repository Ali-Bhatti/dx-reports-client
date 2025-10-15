import { type ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import BaseButton from '../shared/BaseButton';
import BaseCard from '../shared/BaseCard';
import { useMsal } from '@azure/msal-react';
import BaseLoader from '../shared/BaseLoader';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { isAuthenticated, login } = useAuth();
  const { inProgress } = useMsal();

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        {fallback || (
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
            <BaseCard>
              <BaseCard.Body className="p-6 sm:p-10 md:p-16 text-center">
                {/* FleetGo Logo */}
                <div className="mb-6 sm:mb-8 md:mb-10 flex justify-center">
                  <img
                    src="/fleetGo.png"
                    alt="FleetGo Logo"
                    className="h-16 sm:h-20 md:h-28 w-auto"
                  />
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-5">
                  Welcome to Reporting Tool
                </h2>

                {/* Description */}
                <p className="text-gray-600 mb-6 sm:mb-8 md:mb-12 text-sm sm:text-base md:text-lg px-2">
                  Sign in to access your reporting dashboard and manage your reports.
                </p>

                {/* Sign In Button */}
                <BaseButton
                  onClick={login}
                  color="blue"
                  className="w-3/4 sm:w-full !py-3 sm:!py-4 !text-base sm:!text-lg mx-auto"
                >
                  Sign In
                </BaseButton>
              </BaseCard.Body>
            </BaseCard>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;