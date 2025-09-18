import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Layout from '../Layout';
import ReportsPage from '../pages/ReportsPage';
import ReportsPageCopy from '../pages/ReportsPage copy';
// import ReportsPage2 from '../pages/ReportsPage copy 2';
import DiagramTool from '../pages/DiagramTool';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<ReportsPage />} />
      <Route path="/report" element={<ReportsPageCopy />} />
      {/* <Route path="/report1" element={<ReportsPage2 />} /> */}
      <Route path='/diagram' element={<DiagramTool />} />
    </Route>
  )
)

export default router;