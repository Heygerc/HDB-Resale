import React from 'react';
import { TabType } from '../types';
import { PROPTRUST_LOGO } from '../data/mockData';

interface SidebarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  consultantMode: boolean;
  onToggleConsultantMode: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  consultantMode,
  onToggleConsultantMode,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'market-search', label: 'Market Search', icon: 'search' },
    { id: 'financial-tools', label: 'Financial Tools', icon: 'calculate' },
    { id: 'my-viewings', label: 'My Viewings', icon: 'calendar_today' },
    { id: 'market-analysis', label: 'Market Analysis', icon: 'insights' },
    { id: 'community', label: 'Community Forum', icon: 'forum' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="prop-trust-sidebar"
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col pt-8 pb-8 transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } border-r border-outline-variant/30`}
      >
        {/* Brand Header */}
        <div className="px-8 mb-10 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              onTabChange('dashboard');
              if (onCloseMobile) onCloseMobile();
            }}
          >
            <img
              alt="PropTrust Logo"
              className="h-8 w-auto object-contain"
              src={PROPTRUST_LOGO}
            />
            <span className="font-headline-lg text-title-md text-primary font-semibold tracking-tight">
              PropTrust
            </span>
          </div>

          {isOpenMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-on-surface-variant hover:text-on-surface rounded-md"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  onTabChange(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group text-left ${
                  isActive
                    ? 'bg-primary-container text-white shadow-sm font-medium'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span
                  className={`material-symbols-outlined mr-3 text-[22px] transition-transform ${
                    isActive ? 'text-white scale-105' : 'text-on-surface-variant group-hover:text-on-surface'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="font-body-md text-[15px]">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Consultant Mode Footer Widget */}
        <div className="px-4 mt-auto">
          <div
            id="consultant-mode-widget"
            onClick={onToggleConsultantMode}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
              consultantMode
                ? 'bg-primary-container text-white border-primary-container shadow-md'
                : 'bg-surface-container-highest text-on-surface border-outline-variant/30 hover:bg-surface-container-high'
            }`}
            title="Click to toggle Official HDB Data Consultant Mode"
          >
            <div className="flex items-center justify-between mb-1">
              <p
                className={`text-label-sm font-label-sm uppercase tracking-widest ${
                  consultantMode ? 'text-secondary-container font-semibold' : 'text-on-surface-variant'
                }`}
              >
                Consultant Mode
              </p>
              <span
                className={`w-2 h-2 rounded-full ${
                  consultantMode ? 'bg-secondary-container animate-pulse' : 'bg-outline-variant'
                }`}
              />
            </div>
            <p
              className={`text-body-md font-body-md font-medium text-[14px] ${
                consultantMode ? 'text-white' : 'text-on-surface'
              }`}
            >
              Official HDB Data Access
            </p>
            <p
              className={`text-[11px] mt-1 ${
                consultantMode ? 'text-on-primary-container' : 'text-on-surface-variant'
              }`}
            >
              {consultantMode ? '✓ Verified HDB API Active' : 'Tap to enable verified data'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
