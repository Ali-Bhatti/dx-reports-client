import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FGDesignDemoRoutes } from './FGDesignDemo/routes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {FGDesignDemoRoutes}
        <Route path="*" element={<Navigate to="/fg-demo/buttons" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
