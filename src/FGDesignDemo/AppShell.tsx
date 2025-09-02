import { NavLink, Outlet } from 'react-router-dom';
import { AppBar, AppBarSection } from '@progress/kendo-react-layout';
import { FGThemeProvider } from '../FGDesign';
import { componentRegistry } from './componentRegistry';
import './shell.css';

const AppShell: React.FC = () => (
  <FGThemeProvider>
    <AppBar>
      <AppBarSection>
        <h1 className="fg-appbar-title">FGDesign Demo</h1>
      </AppBarSection>
    </AppBar>
    <div className="fg-shell">
      <aside className="fg-sidebar">
        {componentRegistry.map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            className={({ isActive }) => `fg-link${isActive ? ' active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </aside>
      <main className="fg-content">
        <Outlet />
      </main>
    </div>
  </FGThemeProvider>
);

export default AppShell;
