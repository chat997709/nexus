import React from 'react';
import { TabRoute } from '../types';
import { ShoppingBag, Wallet, Library, Users, User, LogOut } from 'lucide-react';
import { Icon3D } from './Icon3D';

interface NavigationProps {
  activeTab: TabRoute;
  onTabChange: (tab: TabRoute) => void;
  orientation?: 'horizontal' | 'vertical';
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, orientation = 'horizontal' }) => {
  const isVertical = orientation === 'vertical';

  const containerClasses = isVertical 
    ? "h-full w-24 flex flex-col items-center justify-start pt-8 pb-4 bg-white/80 dark:bg-black/80 border-r border-gray-200 dark:border-white/5 backdrop-blur-md transition-all duration-300"
    : "h-24 w-full bg-gradient-to-t from-white via-white/80 dark:from-black dark:via-black/80 to-transparent border-t border-gray-200 dark:border-white/5 flex items-end justify-around pb-4 px-2 backdrop-blur-sm transition-colors duration-300";

  const buttonClasses = isVertical
    ? "relative flex flex-col items-center justify-center w-full h-20 group perspective-container mb-2"
    : "relative flex flex-col items-center justify-center w-1/5 h-full group perspective-container";

  const textClasses = (isActive: boolean) => 
    `text-[9px] font-medium transition-all duration-300 mt-2 ${
      isActive 
        ? 'text-cyan-600 dark:text-nexus-cyan translate-y-0 opacity-100' 
        : 'text-gray-500 dark:text-nexus-nav translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0'
    }`;

  const renderButton = (route: TabRoute, Icon: any, label: string) => (
    <button onClick={() => onTabChange(route)} className={buttonClasses}>
        {/* Active Indicator Line for Sidebar */}
        {isVertical && activeTab === route && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-nexus-cyan rounded-r-full shadow-[0_0_10px_#00FFFF]"></div>
        )}
        
        <Icon3D 
          icon={Icon} 
          isActive={activeTab === route} 
          color={activeTab === route ? '#00FFFF' : undefined}
          size={isVertical ? 24 : 24}
        />
        <span className={textClasses(activeTab === route)}>{label}</span>
    </button>
  );

  return (
    <div className={containerClasses}>
      {isVertical && (
          <div className="mb-8 opacity-50 hover:opacity-100 transition-opacity">
               {/* Logo placeholder or spacer for sidebar */}
          </div>
      )}

      {renderButton('Store', ShoppingBag, 'Store')}
      {renderButton('Library', Library, 'Library')}
      {renderButton('Community', Users, 'Social')}
      {renderButton('Wallet', Wallet, 'Wallet')}
      {renderButton('Profile', User, 'Profile')}

      {isVertical && (
          <div className="mt-auto mb-4">
             {/* Space for Settings or Logout in sidebar if needed later */}
          </div>
      )}
    </div>
  );
};