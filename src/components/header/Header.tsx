
import { gearIcon } from '@progress/kendo-svg-icons';
import BaseButton from '../shared/BaseButton';
import AuthButton from '../auth/AuthButton';

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
}

export const Header = ({
  onSettingsClick = () => console.log('Settings clicked'),
}: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between max-w-full">
        {/* Left - Brand Logo */}
        <div className="flex items-center">
          <img
            src="https://fleetgo.com/wp-content/uploads/2023/06/RGB-FleetGO-Logo.svg"
            alt="FleetGO Logo"
            className="h-8 w-auto"
          />
          <span
            className="text-xl font-bold fg-primary:hover hidden"
            style={{ display: 'none' }}
          >
            FleetGO
          </span>

          <nav className="pl-10">
            <a
              href="/"
              className="px-4 py-2 fg-primary hover:fg-primary:hover font-medium transition-colors rounded-md hover:bg-gray-50"
            >
              Home
            </a>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
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