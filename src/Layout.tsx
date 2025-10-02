import { Header } from './components/header/Header';
import { Outlet } from 'react-router-dom';
import BaseNotification from './components/shared/BaseNotification';
import ProtectedRoute from './components/auth/ProtectedRoute';


const Layout = () => {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Header />
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
      <BaseNotification />
    </div>
  );
};

export default Layout;

