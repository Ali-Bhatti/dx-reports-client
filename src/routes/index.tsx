import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Layout from '../Layout';
import Dashboard from '../pages/Dashboard';
import ReportDesigner from '../pages/ReportDesigner';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Dashboard />} />
      <Route path='/report-designer' element={<ReportDesigner />} />
    </Route>
  )
)

export default router;