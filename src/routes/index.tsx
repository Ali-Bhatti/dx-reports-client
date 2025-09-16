import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Layout from '../Layout';
import ReportsPage from '../pages/ReportsPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<ReportsPage />} />
    </Route>
  )
);

export default router;
