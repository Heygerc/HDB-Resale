import React, { useState } from 'react';
import { DisqusThread } from './DisqusThread';
import { TabType } from '../types';

interface CommunityForumViewProps {
  onTabChange: (tab: TabType) => void;
}

interface ForumCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge: string;
  topicCount: number;
  latestActivity: string;
}

export const CommunityForumView: React.FC<CommunityForumViewProps> = ({ onTabChange }) => {
  const categories: ForumCategory[] = [
    {
      id: 'hdb-resale-trends',
      title: 'HDB Resale Market & Price Trends (2026)',
      description: 'Discuss recent transaction price trends, cash-over-valuation (COV) observations, and market forecasts across mature & non-mature estates.',
      icon: 'trending_up',
      badge: 'Trending',
      topicCount: 142,
      latestActivity: '12 mins ago',
    },
    {
      id: 'cpf-grants-financing',
      title: 'CPF Housing Grants & Financial Planning Advice',
      description: 'Q&A on Enhanced CPF Housing Grant (EHG), Proximity Housing Grant (PHG), Step-Up Grant, and HDB Loan vs Bank Loan comparisons.',
      icon: 'account_balance_wallet',
      badge: 'Popular',
      topicCount: 238,
      latestActivity: '3 mins ago',
    },
    {
      id: 'estate-spotlights',
      title: 'Estate Spotlights & Neighborhood Discussions',
      description: 'Community reviews on Tampines, Bishan, Punggol, Queenstown, Bukit Merah, Woodlands, and upcoming MRT Cross Island Line developments.',
      icon: 'location_city',
      badge: 'Local',
      topicCount: 95,
      latestActivity: '28 mins ago',
    },
    {
      id: 'standard-plus-prime-classification',
      title: 'Standard, Plus & Prime HDB Model Rules',
      description: 'Debate and clarity on the 10-year MOP restrictions, subsidy clawback clawback rates, and resale eligibility conditions for Plus/Prime flats.',
      icon: 'verified_user',
      badge: 'Policy',
      topicCount: 64,
      latestActivity: '1 hour ago',
    },
    {
      id: 'renovation-inspection-tips',
      title: 'HDB Renovation, Defects & Home Inspection',
      description: 'Sharing recommended interior designers, defect checklists, HDB permit guidelines, and cost-saving renovation strategies.',
      icon: 'construction',
      badge: 'Homeowner',
      topicCount: 180,
      latestActivity: '45 mins ago',
    },
  ];

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0].id);
  const activeCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary-container via-primary to-primary-container p-6 sm:p-8 rounded-2xl text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-secondary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">forum</span>
              <span>Disqus Integrated Forum</span>
            </span>
            <span className="text-xs text-white/80 font-mono">Real-Time Community Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Singapore HDB Buyer & Seller Community
          </h1>
          <p className="text-xs sm:text-sm text-white/85 max-w-2xl mt-1.5 leading-relaxed">
            Engage with fellow buyers, homeowners, and verified PropTrust property consultants. Share real-time market insights, grant experiences, and neighborhood reviews.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onTabChange('financial-tools')}
            className="bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">calculate</span>
            <span>Check Grant Eligibility</span>
          </button>
          <button
            onClick={() => onTabChange('market-search')}
            className="bg-white text-primary hover:bg-surface text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[16px]">search</span>
            <span>Browse Active Listings</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Channels on Left, Disqus Feed on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Discussion Categories Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-variant shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider font-label-sm">
                Discussion Channels
              </h2>
              <span className="text-xs font-mono text-on-surface-variant">5 Channels</span>
            </div>

            <div className="space-y-2">
              {categories.map((cat) => {
                const isSelected = cat.id === selectedCategoryId;
                return (
                  <button
                    key={cat.id}
                    id={`channel-${cat.id}`}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all flex items-start gap-3 border ${
                      isSelected
                        ? 'bg-primary-container text-white border-primary shadow-xs'
                        : 'bg-surface hover:bg-surface-container text-on-surface border-outline-variant/30'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-on-surface'}`}>
                          {cat.title}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono uppercase ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-surface-container-high text-on-surface-variant'
                          }`}
                        >
                          {cat.badge}
                        </span>
                      </div>
                      <p className={`text-[11px] line-clamp-2 ${isSelected ? 'text-white/85' : 'text-on-surface-variant'}`}>
                        {cat.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] opacity-80">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">chat_bubble</span>
                          <span>{cat.topicCount} comments</span>
                        </span>
                        <span>•</span>
                        <span>Active {cat.latestActivity}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CEA Compliance & Guidelines Card */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/20 space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Community Standards</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              PropTrust comments are powered by Disqus universal authentication. All advice is shared for informational purposes under Singapore CEA real estate advisory standards.
            </p>
            <ul className="text-[11px] text-on-surface-variant space-y-1.5 list-disc list-inside">
              <li>Keep conversations respectful and constructive</li>
              <li>Do not post personal contact details publicly</li>
              <li>Consultants are verified with official CEA registration numbers</li>
            </ul>
          </div>
        </div>

        {/* Disqus Live Feed Column */}
        <div className="lg:col-span-8">
          <DisqusThread
            identifier={`proptrust-forum-${activeCategory.id}`}
            title={activeCategory.title}
            category={activeCategory.description}
            url={typeof window !== 'undefined' ? `${window.location.origin}/#forum-${activeCategory.id}` : undefined}
          />
        </div>
      </div>
    </div>
  );
};
