import React from 'react';
import { HdbListing, Viewing, TabType } from '../types';
import { HDB_ESTATE_STATS } from '../data/mockData';

interface DashboardViewProps {
  listings: HdbListing[];
  viewings: Viewing[];
  favorites: string[];
  onSelectListing: (listing: HdbListing) => void;
  onTabChange: (tab: TabType) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  listings,
  viewings,
  favorites,
  onSelectListing,
  onTabChange,
}) => {
  const nextViewing = viewings.find((v) => v.status === 'Confirmed') || viewings[0];
  const favoriteListings = listings.filter((l) => favorites.includes(l.id));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      maximumFractionDigits: 0,
    }).format(val).replace('SGD', '$').trim();
  };

  return (
    <div className="flex flex-col w-full max-w-[1280px] mx-auto gap-8 pb-16">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-primary-container text-white p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-secondary text-white text-[11px] font-label-sm font-semibold uppercase px-2.5 py-0.5 rounded-full">
              Buyer Portal
            </span>
            <span className="text-xs text-white/80">Welcome back, Tan Ah Teck</span>
          </div>
          <h1 className="font-display-lg text-headline-lg sm:text-display-lg font-bold tracking-tight text-white mb-2">
            Your HDB Journey
          </h1>
          <p className="text-body-md text-sm text-white/85 leading-relaxed">
            Your estimated buying power is <strong>$685,000</strong> with up to <strong>$85,000</strong> in CPF Housing Grants. 2 property viewings are queued this weekend.
          </p>
        </div>

        <div className="mt-6 md:mt-0 flex flex-wrap gap-3 relative z-10">
          <button
            onClick={() => onTabChange('financial-tools')}
            className="bg-white text-primary font-semibold text-sm px-5 py-2.5 rounded-lg shadow-sm hover:bg-surface transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">calculate</span>
            <span>Review Affordability</span>
          </button>
          <button
            onClick={() => onTabChange('market-search')}
            className="bg-secondary text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-sm hover:bg-secondary/90 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span>Browse Listings</span>
          </button>
        </div>
      </div>

      {/* Grid Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Next Viewing Card */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-surface-variant shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold text-xs">
                Upcoming Viewing
              </span>
              <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {nextViewing ? nextViewing.status : 'No viewings'}
              </span>
            </div>
            {nextViewing ? (
              <>
                <h3 className="font-headline-lg text-title-md text-on-surface font-semibold">
                  {nextViewing.propertyTitle}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  {nextViewing.estate} • {nextViewing.flatType}
                </p>
                <div className="mt-4 p-3 bg-surface-container-low rounded-lg space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                    <span className="font-medium">{nextViewing.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-primary">timelapse</span>
                    <span>{nextViewing.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant pt-1 border-t border-outline-variant/20">
                    <span className="material-symbols-outlined text-[16px] text-secondary">person</span>
                    <span>Consultant: {nextViewing.consultantName}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-xs text-on-surface-variant py-4">No upcoming viewings scheduled yet.</p>
            )}
          </div>
          <button
            onClick={() => onTabChange('my-viewings')}
            className="mt-4 text-xs font-semibold text-primary hover:underline text-left flex items-center gap-1"
          >
            <span>View all appointments</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        {/* Buying Power Snapshot */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-surface-variant shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold text-xs block mb-3">
              Affordability Summary
            </span>
            <h3 className="font-headline-lg text-display-lg text-primary font-bold">
              $685,000
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Max eligible purchase budget based on $8,500 income & CPF OA.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>Eligible HDB Loan:</span>
                <span className="font-semibold text-on-surface">$480,000</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Total Grants (EHG + Family):</span>
                <span className="font-semibold text-secondary">+$85,000</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Est. Monthly Payment:</span>
                <span className="font-semibold text-on-surface">$2,150 / mo</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onTabChange('financial-tools')}
            className="mt-4 text-xs font-semibold text-primary hover:underline text-left flex items-center gap-1"
          >
            <span>Recalculate Budget</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        {/* Consultant Advantage */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-surface-variant shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-secondary text-[20px]">savings</span>
              <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold text-xs">
                PropTrust Advantage
              </span>
            </div>
            <h3 className="font-headline-lg text-title-md text-on-surface font-semibold">
              $10,812 Saved in Fees
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Flat $2,888 fixed consulting instead of 2% traditional agency commissions.
            </p>

            <div className="mt-4 p-3 bg-secondary-container/15 rounded-lg border border-secondary-container/30 text-xs text-on-surface space-y-1">
              <p className="font-medium text-secondary">Assigned Consultant: Marcus Wong</p>
              <p className="text-on-surface-variant">Includes legal advisory, OTP coordination, and key collection escort.</p>
            </div>
          </div>
          <a
            href="tel:+6591234567"
            className="mt-4 text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>Contact Consultant (+65 9123 4567)</span>
          </a>
        </div>
      </div>

      {/* Recommended & Saved Properties */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-lg text-title-md text-on-surface font-semibold">
              Recommended for Your $685k Budget
            </h2>
            <p className="text-body-md text-xs text-on-surface-variant">
              Curated 4-Room & 5-Room units in East & North-East regions with high lease remaining
            </p>
          </div>
          <button
            onClick={() => onTabChange('market-search')}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>View all 24 matches</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.slice(0, 3).map((listing) => (
            <div
              key={listing.id}
              onClick={() => onSelectListing(listing)}
              className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-xs hover:shadow-md border border-outline-variant/20 hover:border-primary/40 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative h-44 overflow-hidden bg-surface-container">
                <img
                  src={listing.imageUrl}
                  alt={`${listing.block} ${listing.street}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  <span className="bg-tertiary text-white text-[10px] font-label-sm px-2 py-0.5 rounded-full">
                    {listing.flatType}
                  </span>
                  {listing.tags[1] && (
                    <span className="bg-secondary-container text-on-secondary-container text-[10px] font-label-sm px-2 py-0.5 rounded-full">
                      {listing.tags[1]}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-white text-xs font-semibold px-2 py-0.5 rounded">
                  {formatCurrency(listing.price)}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors truncate">
                    {listing.block} {listing.street}
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {listing.town.toUpperCase()} • {listing.district}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-3 mt-3 border-t border-outline-variant/15 text-xs text-on-surface-variant font-mono">
                  <span>{listing.areaSqm} sqm</span>
                  <span>Built {listing.builtYear}</span>
                  <span>{listing.leaseRemainingYears} yrs left</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Stats Quick Table & Live Government Data Feed Callout */}
      <div className="bg-gradient-to-r from-primary to-primary-container p-6 rounded-2xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-secondary text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
              Live Open Data API
            </span>
            <span className="text-xs text-white/80 font-mono">data.gov.sg • Jan 2017 to Present</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            Official Singapore HDB Resale Price Dataset Connected
          </h3>
          <p className="text-xs text-white/85 max-w-2xl mt-0.5">
            Query real registered resale transactions, analyze historical psf records, and inspect official dataset metadata schemas directly from government databases.
          </p>
        </div>
        <button
          onClick={() => onTabChange('market-analysis')}
          className="bg-white text-primary font-semibold text-xs px-4 py-2.5 rounded-lg shadow hover:bg-surface transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">database</span>
          <span>Explore Live Transactions</span>
        </button>
      </div>

      {/* Market Stats Quick Table */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-surface-variant shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-title-md font-semibold text-on-surface">
              Singapore HDB Median Prices by Estate (Q3 2026)
            </h3>
            <p className="text-xs text-on-surface-variant">Official data compiled from HDB Resale Portal</p>
          </div>
          <button
            onClick={() => onTabChange('market-analysis')}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>Full Market Analysis</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-surface-container-high/50 text-on-surface-variant">
              <tr>
                <th className="p-3">Estate / Town</th>
                <th className="p-3">Median 4-Room</th>
                <th className="p-3">Median 5-Room</th>
                <th className="p-3">Quarterly Movement</th>
                <th className="p-3 text-right">Transactions (Q3)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15">
              {HDB_ESTATE_STATS.map((stat) => (
                <tr key={stat.town} className="hover:bg-surface-container-low/50">
                  <td className="p-3 font-semibold text-on-surface">{stat.town}</td>
                  <td className="p-3 font-mono text-primary font-medium">{formatCurrency(stat.median4Room)}</td>
                  <td className="p-3 font-mono text-on-surface">{formatCurrency(stat.median5Room)}</td>
                  <td className="p-3 text-green-700 font-medium">{stat.quarterlyGrowth}</td>
                  <td className="p-3 text-right font-mono">{stat.volume} units</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
