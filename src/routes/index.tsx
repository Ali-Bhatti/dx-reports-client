import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Layout from '../Layout';
import ReportsPage from '../pages/ReportsPage';
import ReportsPageCopy from '../pages/ReportsPage copy';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<ReportsPage />} />
      <Route path="/report" element={<ReportsPageCopy />} />
    </Route>
  )
)

export default router;