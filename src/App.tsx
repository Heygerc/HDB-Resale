/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, HdbListing, Viewing, AlertNotification } from './types';
import { INITIAL_LISTINGS, INITIAL_VIEWINGS, INITIAL_NOTIFICATIONS } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FinancialToolsView } from './components/FinancialToolsView';
import { MarketSearchView } from './components/MarketSearchView';
import { DashboardView } from './components/DashboardView';
import { MyViewingsView } from './components/MyViewingsView';
import { MarketAnalysisView } from './components/MarketAnalysisView';
import { CommunityForumView } from './components/CommunityForumView';
import { ListingDetailModal } from './components/ListingDetailModal';
import { BookViewingModal } from './components/BookViewingModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('financial-tools');
  const [listings, setListings] = useState<HdbListing[]>(INITIAL_LISTINGS);
  const [viewings, setViewings] = useState<Viewing[]>(INITIAL_VIEWINGS);
  const [favorites, setFavorites] = useState<string[]>(['tampines-151', 'bishan-178']);
  const [notifications, setNotifications] = useState<AlertNotification[]>(INITIAL_NOTIFICATIONS);
  const [consultantMode, setConsultantMode] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchFilterOverride, setSearchFilterOverride] = useState<{ minBudget?: number; maxBudget?: number } | undefined>(undefined);

  // Modals
  const [selectedListing, setSelectedListing] = useState<HdbListing | null>(null);
  const [bookingListing, setBookingListing] = useState<HdbListing | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(exists ? 'Removed from favorites' : 'Saved to favorites');
      return next;
    });
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleConfirmViewing = (newViewing: Viewing) => {
    setViewings((prev) => [newViewing, ...prev]);
    setBookingListing(null);
    setSelectedListing(null);
    showToast(`Viewing booked for ${newViewing.propertyTitle}!`);
    // Add notification
    const newNotif: AlertNotification = {
      id: `notif-${Date.now()}`,
      title: 'Viewing Request Received',
      message: `Appointment scheduled for ${newViewing.propertyTitle} on ${newViewing.date}.`,
      time: 'Just now',
      isRead: false,
      type: 'viewing',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleCancelViewing = (id: string) => {
    setViewings((prev) => prev.filter((v) => v.id !== id));
    showToast('Viewing appointment cancelled.');
  };

  const handleNavigateToSearchWithBudget = (filters?: { minBudget?: number; maxBudget?: number }) => {
    if (filters) {
      setSearchFilterOverride(filters);
    }
    setCurrentTab('market-search');
  };

  const handleToggleConsultantMode = () => {
    const nextState = !consultantMode;
    setConsultantMode(nextState);
    showToast(
      nextState
        ? 'Consultant Mode Active: Official HDB data & legal advisory enabled.'
        : 'Consultant Mode Deactivated.'
    );
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface flex flex-col">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        consultantMode={consultantMode}
        onToggleConsultantMode={handleToggleConsultantMode}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Container Area */}
      <div className="pl-0 lg:pl-72 flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Top Sticky Header */}
        <Header
          searchQuery={searchQuery}
          onSearch={(query) => {
            setSearchQuery(query);
            if (query && currentTab !== 'market-search') {
              setCurrentTab('market-search');
            }
          }}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          consultantMode={consultantMode}
        />

        {/* Content Views */}
        <main
          id="main-content-view"
          className="relative pt-24 bg-surface min-h-[calc(100vh-80px)] px-4 sm:px-8 lg:px-12 py-8 flex-1"
        >
          {currentTab === 'financial-tools' && (
            <FinancialToolsView
              onNavigateToSearch={handleNavigateToSearchWithBudget}
              onTabChange={setCurrentTab}
            />
          )}

          {currentTab === 'market-search' && (
            <MarketSearchView
              listings={listings}
              onSelectListing={(listing) => setSelectedListing(listing)}
              onToggleFavorite={handleToggleFavorite}
              favorites={favorites}
              onNavigateToFinancialTools={() => setCurrentTab('financial-tools')}
              onTabChange={setCurrentTab}
              initialFilters={searchFilterOverride}
            />
          )}

          {currentTab === 'dashboard' && (
            <DashboardView
              listings={listings}
              viewings={viewings}
              favorites={favorites}
              onSelectListing={(listing) => setSelectedListing(listing)}
              onTabChange={setCurrentTab}
            />
          )}

          {currentTab === 'my-viewings' && (
            <MyViewingsView
              viewings={viewings}
              onTabChange={setCurrentTab}
              onCancelViewing={handleCancelViewing}
            />
          )}

          {currentTab === 'market-analysis' && (
            <MarketAnalysisView
              onTabChange={setCurrentTab}
              consultantMode={consultantMode}
            />
          )}

          {currentTab === 'community' && (
            <CommunityForumView
              onTabChange={setCurrentTab}
            />
          )}
        </main>
      </div>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onBookViewing={(listing) => {
            setSelectedListing(null);
            setBookingListing(listing);
          }}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={favorites.includes(selectedListing.id)}
        />
      )}

      {/* Book Viewing Appointment Modal */}
      {bookingListing && (
        <BookViewingModal
          listing={bookingListing}
          onClose={() => setBookingListing(null)}
          onConfirmViewing={handleConfirmViewing}
        />
      )}

      {/* Feedback Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-primary text-white text-xs font-medium px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-white/20">
          <span className="material-symbols-outlined text-[16px] text-secondary-container">
            info
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
