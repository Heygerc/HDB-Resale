import React, { useState, useRef, useEffect } from 'react';
import { USER_PROFILE_AVATAR } from '../data/mockData';
import { AlertNotification } from '../types';

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  notifications: AlertNotification[];
  onMarkNotificationRead: (id: string) => void;
  onOpenMobileMenu?: () => void;
  consultantMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  searchQuery = '',
  notifications,
  onMarkNotificationRead,
  onOpenMobileMenu,
  consultantMode,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(localSearch);
  };

  return (
    <header
      id="prop-trust-header"
      className="fixed top-0 left-0 lg:left-72 right-0 h-20 bg-surface/85 backdrop-blur-xl z-40 px-4 sm:px-8 lg:px-12 flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/20 transition-all"
    >
      {/* Left Area: Mobile menu & Search */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-xl">
        <button
          id="mobile-sidebar-toggle"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full max-w-sm">
          <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">
            search
          </span>
          <input
            id="global-hdb-search"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            className="bg-surface-container-low border border-transparent focus:border-primary/40 rounded-full py-2 pl-10 pr-4 w-full text-body-md text-[14px] text-on-surface focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none placeholder:text-on-surface-variant/70 shadow-xs"
            placeholder="Search HDB districts, estates..."
            type="text"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch('');
                if (onSearch) onSearch('');
              }}
              className="absolute right-3 text-on-surface-variant hover:text-on-surface text-xs"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </form>
      </div>

      {/* Right Area: Status badge, Notification & User Account */}
      <div className="flex items-center gap-2 sm:gap-4">
        {consultantMode && (
          <div className="hidden md:flex items-center bg-primary-container/15 border border-primary-container/30 px-3 py-1 rounded-full text-xs text-primary font-medium">
            <span className="material-symbols-outlined text-[14px] mr-1 text-primary">verified</span>
            Official HDB Sync Active
          </div>
        )}

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            id="notifications-button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors relative"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-secondary rounded-full ring-2 ring-surface animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div
              id="notifications-dropdown"
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-3 z-50 overflow-hidden"
            >
              <div className="px-4 py-2 border-b border-outline-variant/20 flex items-center justify-between">
                <span className="font-headline-lg text-title-md text-[16px] text-on-surface font-semibold">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="text-label-sm font-label-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[11px]">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/15 custom-scrollbar">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => onMarkNotificationRead(notif.id)}
                    className={`p-3.5 hover:bg-surface-container-low cursor-pointer transition-colors ${
                      !notif.isRead ? 'bg-surface-container/40' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`material-symbols-outlined text-[18px] mt-0.5 ${
                          notif.type === 'viewing'
                            ? 'text-primary'
                            : notif.type === 'grant'
                            ? 'text-secondary'
                            : 'text-outline'
                        }`}
                      >
                        {notif.type === 'viewing'
                          ? 'calendar_month'
                          : notif.type === 'grant'
                          ? 'payments'
                          : 'notifications'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-body-md text-[13px] font-semibold text-on-surface truncate">
                          {notif.title}
                        </p>
                        <p className="text-body-md text-[12px] text-on-surface-variant line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                        <p className="text-label-sm font-label-sm text-[10px] text-on-surface-variant/70 mt-1">
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-7 w-[1px] bg-outline-variant/40 mx-1"></div>

        {/* Profile Card */}
        <div className="relative" ref={profileRef}>
          <div
            id="user-profile-menu-button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 cursor-pointer hover:bg-surface-container-low p-1.5 sm:px-2 sm:py-1.5 rounded-lg transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-body-md text-[14px] font-medium text-on-surface leading-tight">
                Tan Ah Teck
              </p>
              <p className="text-label-sm font-label-sm text-[11px] text-on-surface-variant leading-tight">
                Buyer Account
              </p>
            </div>
            <img
              alt="Profile avatar for Tan Ah Teck"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-surface-variant shadow-sm"
              src={USER_PROFILE_AVATAR}
            />
          </div>

          {showProfileMenu && (
            <div
              id="user-profile-dropdown"
              className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-2 z-50"
            >
              <div className="px-4 py-3 border-b border-outline-variant/20">
                <p className="font-semibold text-on-surface text-[14px]">Tan Ah Teck</p>
                <p className="text-xs text-on-surface-variant">ahteck.tan@example.sg</p>
                <div className="mt-2 inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[11px] px-2 py-0.5 rounded-md font-medium">
                  <span className="material-symbols-outlined text-[13px]">verified_user</span>
                  Singpass Verified Buyer
                </div>
              </div>
              <div className="py-1 text-sm text-on-surface-variant">
                <div className="px-4 py-2 hover:bg-surface-container-low cursor-pointer flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">account_balance</span>
                  <span>CPF OA & Grant Portfolio</span>
                </div>
                <div className="px-4 py-2 hover:bg-surface-container-low cursor-pointer flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                  <span>Assigned Consultant: Marcus Wong</span>
                </div>
                <div className="px-4 py-2 hover:bg-surface-container-low cursor-pointer flex items-center gap-2 text-primary font-medium">
                  <span className="material-symbols-outlined text-[18px]">help</span>
                  <span>HDB Resale Guidelines 2026</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
