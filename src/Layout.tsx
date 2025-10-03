import { Header } from './components/header/Header';
import { Outlet } from 'react-router-dom';
import BaseNotification from './components/shared/BaseNotification';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './hooks/useAuth';


const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-100">
      {isAuthenticated && <Header />}
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
      <BaseNotification />
    </div>
  );
};

export default Layout;

