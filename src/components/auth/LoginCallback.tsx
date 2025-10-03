import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Immediately redirect to home page
    // ProtectedRoute will handle the loading state during authentication
    navigate('/', { replace: true });
  }, [navigate]);

  // Return null since we redirect immediately
  return null;
};

export default LoginCallback;