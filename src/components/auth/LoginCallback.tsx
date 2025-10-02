import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseLoader from '../shared/BaseLoader';

const LoginCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Since redirect handling is done in main.tsx, just redirect to home
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <BaseLoader loadingText="Processing login..." />
      </div>
    </div>
  );
};

export default LoginCallback;