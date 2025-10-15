import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Layout from '../Layout';
import Dashboard from '../pages/Dashboard';
import ReportDesigner from '../pages/ReportDesigner';
import LoginCallback from '../components/auth/LoginCallback';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login-callback" element={<LoginCallback />} />
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Dashboard />} />
        <Route path='/report-designer' element={<ReportDesigner />} />
      </Route>
    </>
  )
)

export default router;