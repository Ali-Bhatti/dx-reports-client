import { Route, Navigate } from 'react-router-dom';
import AppShell from './AppShell';
import { componentRegistry } from './componentRegistry';

export const FGDesignDemoRoutes = (
  <Route path="/fg-demo" element={<AppShell />}>
    {componentRegistry.map((item) => (
      <Route key={item.key} path={item.key} element={item.element} />
    ))}
    <Route index element={<Navigate to={componentRegistry[0].key} replace />} />
  </Route>
);
