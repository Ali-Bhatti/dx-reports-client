import { type ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import BaseButton from '../shared/BaseButton';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        {fallback || (
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-fg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-fg-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Authentication Required
              </h2>

              {/* Description */}
              <p className="text-gray-600 mb-8">
                You need to sign in with your Microsoft account to access this application.
              </p>

              {/* Sign In Button */}
              <BaseButton
                onClick={login}
                color="blue"
                className="w-full !py-3 !text-base"
              >
                Sign In with Microsoft
              </BaseButton>

              {/* Additional Info */}
              <p className="mt-6 text-sm text-gray-400">
                Secure authentication powered by Azure Entra ID
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;