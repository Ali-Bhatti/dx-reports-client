
import { gearIcon, userIcon } from '@progress/kendo-svg-icons';
import BaseButton from '../shared/BaseButton';

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
  user = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  },
  onSettingsClick = () => console.log('Settings clicked'),
  onUserClick = () => console.log('User clicked')
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
          <BaseButton
            svgIcon={gearIcon}
            title='Settings'
            typeVariant='iconButton'
            onClick={onSettingsClick}
          />

          <BaseButton
            svgIcon={userIcon}
            title={user?.name || 'User Profile'}
            typeVariant='iconButton'
            onClick={onUserClick}
          >
            {/* <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {user && (
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {user.name}
              </span>
            )} */}
          </BaseButton>
        </div>
      </div>
    </header>
  );
};