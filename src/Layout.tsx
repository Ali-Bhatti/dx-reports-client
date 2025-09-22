import { Header } from './components/header/Header';
import { Outlet } from 'react-router-dom';
import BaseNotification from './components/shared/BaseNotification';


const Layout = () => {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Header />
      <Outlet />
      <BaseNotification />
    </div>
  );
};

export default Layout;

