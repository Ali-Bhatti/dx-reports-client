import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FGDesignDemoRoutes } from './FGDesignDemo/routes';
import { componentRegistry } from './FGDesignDemo/componentRegistry';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {FGDesignDemoRoutes}
        <Route path="*" element={<Navigate to={componentRegistry[0].path} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
