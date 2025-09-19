import { Header } from './components/header/Header';
import { Outlet } from 'react-router-dom';
import BaseNotification from './components/shared/BaseNotification';


const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <BaseNotification />
    </>
  );
};

export default Layout;

