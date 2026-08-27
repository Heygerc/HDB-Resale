import React, { useState } from 'react';
import { HdbListing } from '../types';

interface ListingDetailModalProps {
  listing: HdbListing | null;
  onClose: () => void;
  onBookViewing: (listing: HdbListing) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  onBookViewing,
  onToggleFavorite,
  isFavorite,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'valuation' | 'amenities' | 'past-records'>('overview');

  if (!listing) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      maximumFractionDigits: 0,
    }).format(val).replace('SGD', '$').trim();
  };

  const psf = Math.round(listing.price / (listing.areaSqm * 10.7639));
  const estMonthly = Math.round((listing.price * 0.75 * 0.026) / 12 + ((listing.price * 0.75) / (25 * 12)));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-surface-container-lowest rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-outline-variant/30 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="relative h-64 sm:h-80 bg-surface-container overflow-hidden">
          <img
            src={listing.imageUrl}
            alt={`${listing.block} ${listing.street}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Top buttons */}
          <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10">
            <div className="flex gap-2">
              {listing.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-primary/80 backdrop-blur text-white text-label-sm font-label-sm px-3 py-1 rounded-full text-xs shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onToggleFavorite(listing.id)}
                className={`w-10 h-10 rounded-full backdrop-blur flex items-center justify-center transition-transform hover:scale-110 shadow-md ${
                  isFavorite ? 'bg-red-50 text-error' : 'bg-surface/80 text-on-surface-variant'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Save property'}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  favorite
                </span>
              </button>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center text-on-surface hover:bg-surface transition-colors shadow-md"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Bottom Title Bar on Image */}
          <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 text-white z-10">
            <p className="text-label-sm uppercase tracking-widest text-secondary-container font-medium">
              Official HDB Resale Listing • {listing.district}
            </p>
            <h2 className="text-display-lg sm:text-headline-lg font-bold text-white leading-tight">
              {listing.block} {listing.street}
            </h2>
            <div className="flex items-center gap-3 mt-1 text-sm text-white/90">
              <span>{listing.town.toUpperCase()}</span>
              <span>•</span>
              <span>Postal {listing.postalCode}</span>
              <span>•</span>
              <span>{listing.mrtStation} ({listing.mrtDistanceMins} mins walk)</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-outline-variant/30 px-6 bg-surface-container-low/40">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Overview & Specs
          </button>
          <button
            onClick={() => setActiveTab('valuation')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'valuation'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            HDB Valuation & Costs
          </button>
          <button
            onClick={() => setActiveTab('past-records')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'past-records'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Block Past Transactions
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <span className="text-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">
                Asking Price
              </span>
              <span className="text-title-md font-bold text-primary">
                {formatCurrency(listing.price)}
              </span>
              <span className="text-[11px] text-on-surface-variant block mt-0.5">
                ~${psf} psf
              </span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <span className="text-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">
                Floor Area
              </span>
              <span className="text-title-md font-bold text-on-surface">
                {listing.areaSqm} sqm
              </span>
              <span className="text-[11px] text-on-surface-variant block mt-0.5">
                ({Math.round(listing.areaSqm * 10.7639)} sqft)
              </span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <span className="text-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">
                Lease Remaining
              </span>
              <span className="text-title-md font-bold text-on-surface">
                {listing.leaseRemainingYears} yrs
              </span>
              <span className="text-[11px] text-on-surface-variant block mt-0.5">
                Built in {listing.builtYear}
              </span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <span className="text-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">
                Floor & Orientation
              </span>
              <span className="text-title-md font-bold text-on-surface truncate block">
                {listing.floorLevel}
              </span>
              <span className="text-[11px] text-on-surface-variant block mt-0.5">
                {listing.unitType || 'Corner Stack'}
              </span>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-title-md text-[16px] font-semibold text-on-surface mb-2">
                  Property Description
                </h4>
                <p className="text-body-md text-[14px] text-on-surface-variant leading-relaxed">
                  {listing.description}
                </p>
              </div>

              <div className="p-4 bg-secondary-container/10 border border-secondary-container/30 rounded-xl">
                <div className="flex items-center gap-2 text-secondary font-semibold text-sm mb-1">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>PropTrust Verified Consultant Advantage</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Fixed flat consulting fee of only <strong>$2,888</strong> on this purchase compared to <strong>${Math.round(listing.price * 0.02).toLocaleString()}</strong> with traditional 2% agencies. Saving you ${Math.round((listing.price * 0.02) - 2888).toLocaleString()}!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'valuation' && (
            <div className="space-y-4 text-sm">
              <div className="p-4 bg-surface-container-low rounded-xl space-y-2 border border-outline-variant/20">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Indicative HDB Valuation:</span>
                  <span className="font-semibold text-primary">{formatCurrency(listing.valuationPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Estimated COV (Cash-Over-Valuation):</span>
                  <span className="font-semibold text-green-700">
                    {listing.price - listing.valuationPrice <= 0 ? '$0 (Valuation Parity)' : formatCurrency(listing.price - listing.valuationPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Est. Monthly Repayment (25yr HDB Loan):</span>
                  <span className="font-semibold text-on-surface">~${estMonthly.toLocaleString()} / month</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'past-records' && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-on-surface">
                Recent HDB Resale Records in {listing.block} {listing.street}
              </h4>
              <div className="border border-outline-variant/30 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-high/60 text-on-surface-variant">
                    <tr>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Storey</th>
                      <th className="p-2.5">Floor Area</th>
                      <th className="p-2.5 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/15">
                    <tr>
                      <td className="p-2.5">Jul 2026</td>
                      <td className="p-2.5">{listing.flatType}</td>
                      <td className="p-2.5">07 to 09</td>
                      <td className="p-2.5">{listing.areaSqm} sqm</td>
                      <td className="p-2.5 text-right font-semibold text-primary">{formatCurrency(listing.lastTransactedInBlock || listing.price - 5000)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Mar 2026</td>
                      <td className="p-2.5">{listing.flatType}</td>
                      <td className="p-2.5">04 to 06</td>
                      <td className="p-2.5">{listing.areaSqm} sqm</td>
                      <td className="p-2.5 text-right font-semibold text-primary">{formatCurrency((listing.lastTransactedInBlock || listing.price) - 12000)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Nov 2025</td>
                      <td className="p-2.5">{listing.flatType}</td>
                      <td className="p-2.5">10 to 12</td>
                      <td className="p-2.5">{listing.areaSqm} sqm</td>
                      <td className="p-2.5 text-right font-semibold text-primary">{formatCurrency((listing.lastTransactedInBlock || listing.price) - 8000)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-outline-variant/30 bg-surface-container-low/60 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-on-surface-variant block uppercase font-label-sm">
              PropTrust Consultant Fee
            </span>
            <span className="text-headline-lg-mobile text-primary font-bold">
              $2,888 <span className="text-xs font-normal text-on-surface-variant">flat</span>
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-outline-variant/50 text-sm font-medium hover:bg-surface-container transition-colors"
            >
              Back to Search
            </button>
            <button
              onClick={() => onBookViewing(listing)}
              className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-md flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>Book Viewing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
