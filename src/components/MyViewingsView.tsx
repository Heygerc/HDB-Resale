import React, { useState } from 'react';
import { Viewing, TabType } from '../types';

interface MyViewingsViewProps {
  viewings: Viewing[];
  onTabChange: (tab: TabType) => void;
  onCancelViewing: (id: string) => void;
}

export const MyViewingsView: React.FC<MyViewingsViewProps> = ({
  viewings,
  onTabChange,
  onCancelViewing,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);

  const filteredViewings = viewings.filter((v) => {
    if (filterStatus === 'All') return true;
    return v.status === filterStatus;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      maximumFractionDigits: 0,
    }).format(val).replace('SGD', '$').trim();
  };

  return (
    <div className="flex flex-col w-full max-w-[1280px] mx-auto gap-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-2 tracking-tight font-bold">
            My Viewings
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Track and coordinate scheduled on-site inspections accompanied by your PropTrust licensed consultant.
          </p>
        </div>

        <button
          onClick={() => onTabChange('market-search')}
          className="bg-primary text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
          <span>Book Another Viewing</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 border-b border-outline-variant/30 pb-2 text-xs font-medium">
        {['All', 'Confirmed', 'Pending', 'Completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg transition-all ${
              filterStatus === status
                ? 'bg-primary-container text-white font-semibold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {status} ({status === 'All' ? viewings.length : viewings.filter((v) => v.status === status).length})
          </button>
        ))}
      </div>

      {/* Viewings List */}
      <div className="space-y-4">
        {filteredViewings.length === 0 ? (
          <div className="bg-surface-container-lowest p-12 text-center rounded-xl border border-surface-variant">
            <span className="material-symbols-outlined text-[48px] text-outline mb-2">calendar_today</span>
            <h3 className="font-semibold text-base text-on-surface">No viewings found</h3>
            <p className="text-xs text-on-surface-variant mt-1 mb-4">
              Explore available listings on the map to schedule on-site walkthroughs.
            </p>
            <button
              onClick={() => onTabChange('market-search')}
              className="bg-primary text-white px-5 py-2 rounded-lg text-xs font-semibold"
            >
              Browse Tampines & Bedok Listings
            </button>
          </div>
        ) : (
          filteredViewings.map((viewing) => (
            <div
              key={viewing.id}
              className="bg-surface-container-lowest p-6 rounded-xl border border-surface-variant shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all"
            >
              {/* Left Column info */}
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      viewing.status === 'Confirmed'
                        ? 'bg-green-100 text-green-800'
                        : viewing.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {viewing.status}
                  </span>
                  <span className="text-xs text-on-surface-variant font-mono">
                    Asking {formatCurrency(viewing.price)}
                  </span>
                </div>

                <h3 className="font-headline-lg text-title-md text-on-surface font-bold">
                  {viewing.propertyTitle}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {viewing.estate} • {viewing.flatType}
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-on-surface pt-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-[16px] text-primary">calendar_month</span>
                    <span>{viewing.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                    <span>{viewing.timeSlot}</span>
                  </div>
                </div>

                {viewing.notes && (
                  <p className="text-xs text-on-surface-variant bg-surface-container-low p-2.5 rounded-lg italic">
                    "{viewing.notes}"
                  </p>
                )}
              </div>

              {/* Right Column Consultant & Actions */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-outline-variant/20">
                <div className="text-left md:text-right">
                  <p className="text-xs text-on-surface-variant">Accompanying Consultant</p>
                  <p className="text-sm font-bold text-on-surface">{viewing.consultantName}</p>
                  <p className="text-xs text-primary font-mono">{viewing.consultantPhone}</p>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`tel:${viewing.consultantPhone.replace(/\s+/g, '')}`}
                    className="px-3 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-xs font-semibold text-on-surface flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    <span>Call</span>
                  </a>
                  {viewing.status !== 'Completed' && (
                    <button
                      onClick={() => setCancelModalId(viewing.id)}
                      className="px-3 py-2 rounded-lg border border-outline-variant/40 hover:bg-red-50 hover:text-error text-xs font-medium text-on-surface-variant transition-colors"
                    >
                      Cancel / Reschedule
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModalId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-sm w-full p-6 shadow-2xl border border-outline-variant/30">
            <h3 className="text-title-md font-bold text-on-surface mb-2">Cancel Viewing</h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Are you sure you want to cancel this scheduled property inspection? Your consultant will be notified.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCancelModalId(null)}
                className="px-4 py-2 text-xs font-medium rounded-lg hover:bg-surface-container text-on-surface"
              >
                Keep Appointment
              </button>
              <button
                onClick={() => {
                  onCancelViewing(cancelModalId);
                  setCancelModalId(null);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-error text-white hover:bg-error/90"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
