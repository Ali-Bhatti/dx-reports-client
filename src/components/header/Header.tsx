
import { gearIcon, homeIcon } from '@progress/kendo-svg-icons';
import { SvgIcon } from '@progress/kendo-react-common';
import BaseButton from '../shared/BaseButton';
import AuthButton from '../auth/AuthButton';
import { EnvironmentSelector } from '../dashboard/EnvironmentSelector';
import { useAppDispatch } from '../../app/hooks';
import { setCurrentEnvironment, clearCurrentEnvironment } from '../../features/app/appSlice';
import { resetReportState } from '../../features/reports/reportsSlice';
import { reportsApi } from '../../services/reportsApi';
import type { Environment } from '../../types';

// Default User type for the component
interface User {
  id: string;
  name: string;
  email: string;
}

interface HeaderProps {
  user?: User;
  onSettingsClick?: () => void;
  onUserClick?: () => void;
  disableEnvironmentSelector?: boolean;
}

export const Header = ({
  onSettingsClick = () => console.log('Settings clicked'),
  disableEnvironmentSelector = false,
}: HeaderProps) => {
  const dispatch = useAppDispatch();

  const handleEnvironmentChange = (environment: Environment | null) => {
    dispatch(resetReportState());

    localStorage.removeItem('selectedCompanyId');

    // Reset the entire API state to clear all cached data
    dispatch(reportsApi.util.resetApiState());

    if (environment) {
      localStorage.setItem('selectedEnvironment', JSON.stringify(environment));
      dispatch(setCurrentEnvironment(environment));
    } else {
      localStorage.removeItem('selectedEnvironment');
      dispatch(clearCurrentEnvironment());
    }
  };
  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3">
      <div className="flex items-center justify-between max-w-full gap-2">
        {/* Left - Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <img
            src="https://fleetgo.com/wp-content/uploads/2023/06/RGB-FleetGO-Logo.svg"
            alt="FleetGO Logo"
            className="h-6 sm:h-8 w-auto flex-shrink-0"
          />
          <span
            className="text-xl font-bold fg-primary:hover hidden"
            style={{ display: 'none' }}
          >
            FleetGO
          </span>

          <EnvironmentSelector
            onEnvironmentChange={handleEnvironmentChange}
            restoreSavedEnvironment={true}
            className="w-24 sm:w-30 lg:w-50"
            disabled={disableEnvironmentSelector}
          />

          <nav className="sm:block sm:pl-4 sm:border-l sm:border-gray-200">
            <a
              href="/"
              className="px-2 sm:px-4 py-2 fg-primary hover:fg-primary:hover font-medium transition-colors rounded-md hover:bg-gray-50 flex items-center gap-2"
              title="Home"
            >
              <SvgIcon icon={homeIcon} size="small" className="sm:hidden" />
              <span className="hidden sm:inline">Home</span>
            </a>
          </nav>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          {false && (<BaseButton
            svgIcon={gearIcon}
            title='Settings'
            typeVariant='iconButton'
            onClick={onSettingsClick}
          />)}
          <AuthButton />
        </div>
      </div>
    </header>
  );
};