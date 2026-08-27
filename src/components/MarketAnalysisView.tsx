import React, { useState } from 'react';
import { HDB_ESTATE_STATS } from '../data/mockData';
import { TabType } from '../types';

interface MarketAnalysisViewProps {
  onTabChange: (tab: TabType) => void;
  consultantMode: boolean;
}

export const MarketAnalysisView: React.FC<MarketAnalysisViewProps> = ({
  onTabChange,
  consultantMode,
}) => {
  const [selectedTown, setSelectedTown] = useState<string>('Tampines');
  const [selectedFlatType, setSelectedFlatType] = useState<string>('4-Room');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      maximumFractionDigits: 0,
    }).format(val).replace('SGD', '$').trim();
  };

  // Sample quarterly index data
  const indexTrends = [
    { quarter: '2024 Q4', index: 178.4, avgPsf: 512 },
    { quarter: '2025 Q1', index: 181.0, avgPsf: 524 },
    { quarter: '2025 Q2', index: 183.2, avgPsf: 536 },
    { quarter: '2025 Q3', index: 185.8, avgPsf: 549 },
    { quarter: '2025 Q4', index: 187.1, avgPsf: 558 },
    { quarter: '2026 Q1', index: 188.4, avgPsf: 564 },
    { quarter: '2026 Q2', index: 189.9, avgPsf: 572 },
  ];

  const mopClusters = [
    { estate: 'Tampines GreenRidges', blocks: 'Blk 601A - 606D', flatTypes: '3/4/5-Room', mopYear: '2026 Q3', estUnits: 1480, status: 'Freshly MOP' },
    { estate: 'Tampines GreenWeave', blocks: 'Blk 608A - 612C', flatTypes: '4/5-Room', mopYear: '2026 Q4', estUnits: 1120, status: 'Upcoming MOP' },
    { estate: 'Bedok Beacon', blocks: 'Blk 201 - 208', flatTypes: '3/4-Room', mopYear: '2026 Q2', estUnits: 890, status: 'Active Resale' },
    { estate: 'Bishan Ridgeline', blocks: 'Blk 510 - 515', flatTypes: '4-Room', mopYear: '2027 Q1', estUnits: 650, status: 'Pipeline 2027' },
  ];

  return (
    <div className="flex flex-col w-full max-w-[1280px] mx-auto gap-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight font-bold">
              Market Analysis
            </h1>
            {consultantMode && (
              <span className="bg-primary text-white text-[11px] font-label-sm px-2.5 py-0.5 rounded-full">
                HDB API Verified
              </span>
            )}
          </div>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Official Singapore HDB Resale Price Index benchmarks, estate median pricing, and 5-Year MOP cluster pipelines.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onTabChange('financial-tools')}
            className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-5 py-2.5 rounded-lg text-sm font-semibold border border-outline-variant/40 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">calculate</span>
            <span>Check Affordability</span>
          </button>
          <button
            onClick={() => onTabChange('market-search')}
            className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span>View Resale Units</span>
          </button>
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-surface-container-lowest rounded-xl border border-surface-variant shadow-xs">
          <span className="text-label-sm uppercase text-on-surface-variant text-[11px] block mb-1">
            HDB Resale Price Index
          </span>
          <p className="text-display-lg text-primary font-bold">189.9</p>
          <p className="text-xs text-green-700 font-semibold mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            +1.3% QoQ (Q2 2026)
          </p>
        </div>

        <div className="p-5 bg-surface-container-lowest rounded-xl border border-surface-variant shadow-xs">
          <span className="text-label-sm uppercase text-on-surface-variant text-[11px] block mb-1">
            Overall Median PSF
          </span>
          <p className="text-display-lg text-primary font-bold">$572</p>
          <p className="text-xs text-on-surface-variant mt-1">Mature Estate Avg: $640 psf</p>
        </div>

        <div className="p-5 bg-surface-container-lowest rounded-xl border border-surface-variant shadow-xs">
          <span className="text-label-sm uppercase text-on-surface-variant text-[11px] block mb-1">
            Average MOP Resale Volume
          </span>
          <p className="text-display-lg text-primary font-bold">7,840</p>
          <p className="text-xs text-on-surface-variant mt-1">Transacted islandwide in Q2</p>
        </div>

        <div className="p-5 bg-surface-container-lowest rounded-xl border border-surface-variant shadow-xs">
          <span className="text-label-sm uppercase text-on-surface-variant text-[11px] block mb-1">
            PropTrust Client Savings
          </span>
          <p className="text-display-lg text-secondary font-bold">$10.8k</p>
          <p className="text-xs text-on-surface-variant mt-1">Avg saved vs 2% commission</p>
        </div>
      </div>

      {/* Index Chart Visual */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-surface-variant shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-outline-variant/20 gap-3">
          <div>
            <h3 className="font-title-md font-semibold text-on-surface text-lg">
              Official HDB Resale Price Index Movement (2024 - 2026)
            </h3>
            <p className="text-xs text-on-surface-variant">Base Quarter: 2009 Q1 = 100</p>
          </div>
          <span className="text-xs font-mono bg-surface-container-low px-3 py-1 rounded-md text-primary border border-outline-variant/30">
            Source: data.gov.sg & HDB Portal
          </span>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-6">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 pt-6">
            {indexTrends.map((point, idx) => {
              const heightPercent = Math.max(20, Math.round(((point.index - 170) / (195 - 170)) * 100));
              const isLatest = idx === indexTrends.length - 1;
              return (
                <div key={point.quarter} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className={`text-[11px] font-mono ${isLatest ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                    {point.index}
                  </span>
                  <div
                    className={`w-full max-w-[48px] rounded-t-lg transition-all duration-300 ${
                      isLatest
                        ? 'bg-primary shadow-sm'
                        : 'bg-surface-container-high group-hover:bg-primary-container/60'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] text-on-surface-variant text-center font-mono whitespace-nowrap">
                    {point.quarter}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MOP (5-Year Minimum Occupation Period) Cluster Radar */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-surface-variant shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-title-md font-semibold text-on-surface">
              Upcoming 5-Year MOP Clusters (High Supply Inflow)
            </h3>
            <p className="text-xs text-on-surface-variant">
              Clusters reaching MOP eligibility offer fresh 94-95 year remaining leases with modern layouts.
            </p>
          </div>
          <span className="text-xs bg-secondary-container/20 text-secondary font-semibold px-2.5 py-1 rounded">
            Prime Targets
          </span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-surface-container-high/50 text-on-surface-variant">
              <tr>
                <th className="p-3">HDB BTO Estate</th>
                <th className="p-3">Block Range</th>
                <th className="p-3">Flat Types</th>
                <th className="p-3">MOP Target</th>
                <th className="p-3">Estimated Supply</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15">
              {mopClusters.map((cluster) => (
                <tr key={cluster.estate} className="hover:bg-surface-container-low/50">
                  <td className="p-3 font-semibold text-primary">{cluster.estate}</td>
                  <td className="p-3 font-mono">{cluster.blocks}</td>
                  <td className="p-3">{cluster.flatTypes}</td>
                  <td className="p-3 font-semibold text-on-surface">{cluster.mopYear}</td>
                  <td className="p-3 font-mono">~{cluster.estUnits.toLocaleString()} units</td>
                  <td className="p-3 text-right">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      {cluster.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
