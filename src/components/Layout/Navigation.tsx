import React from 'react';
import { Timer, Settings, BarChart3, Clock } from 'lucide-react';
import type { AppView } from '../../types';

interface NavigationProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
}) => {
  const navItems = [
    { id: 'timer' as AppView, label: 'Timer', icon: Timer },
    { id: 'settings' as AppView, label: 'Settings', icon: Settings },
    { id: 'analytics' as AppView, label: 'Analytics', icon: BarChart3 },
    { id: 'history' as AppView, label: 'History', icon: Clock },
  ];

  return (
    <nav className='fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-center py-4'>
          <div className='flex space-x-8'>
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors
                  ${
                    currentView === id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }
                `}
              >
                <Icon size={20} />
                <span className='hidden sm:inline'>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
