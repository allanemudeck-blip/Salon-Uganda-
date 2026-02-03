
import React from 'react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { view: AppView.HOME, label: 'Home', icon: '🏠' },
    { view: AppView.FIND_SALONS, label: 'Find', icon: '🔍' },
    { view: AppView.AI_PREVIEW, label: 'Designer', icon: '✨' },
    { view: AppView.PROFILE, label: 'Profile', icon: '👤' },
    { view: AppView.CONTACT, label: 'Support', icon: '💬' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex justify-center">
      <div className="w-full max-w-[480px] flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`flex flex-col items-center justify-center flex-1 transition-colors ${
              currentView === item.view ? 'text-teal-600' : 'text-gray-400'
            }`}
          >
            <span className="text-xl mb-0.5">{item.icon}</span>
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
