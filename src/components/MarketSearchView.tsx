import React, { useState, useMemo } from 'react';
import { HdbListing, TabType } from '../types';
import { TAMPINES_MAP_BG } from '../data/mockData';
import { OfficialHdbTransactionsExplorer } from './OfficialHdbTransactionsExplorer';

interface MarketSearchViewProps {
  listings: HdbListing[];
  onSelectListing: (listing: HdbListing) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
  onNavigateToFinancialTools: () => void;
  onTabChange?: (tab: TabType) => void;
  initialFilters?: { minBudget?: number; maxBudget?: number };
}

export const MarketSearchView: React.FC<MarketSearchViewProps> = ({
  listings,
  onSelectListing,
  onToggleFavorite,
  favorites,
  onNavigateToFinancialTools,
  initialFilters,
}) => {
  // Filter state
  const [selectedTown, setSelectedTown] = useState<string>('');
  const [flatTypes, setFlatTypes] = useState<string[]>(['3-Room', '4-Room']);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    400000,
    initialFilters?.maxBudget ? Math.max(initialFilters.maxBudget, 800000) : 800000,
  ]);
  const [minFloorArea, setMinFloorArea] = useState<number>(90);
  const [remainingLease, setRemainingLease] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('Recommended');
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'listings' | 'official-api'>('listings');

  // Amenity toggles on map
  const [showCafes, setShowCafes] = useState<boolean>(true);
  const [showTransport, setShowTransport] = useState<boolean>(true);

  // Modals for Save Search & Create Alert
  const [showSaveSearchModal, setShowSaveSearchModal] = useState<boolean>(false);
  const [showCreateAlertModal, setShowCreateAlertModal] = useState<boolean>(false);
  const [savedSearchSuccess, setSavedSearchSuccess] = useState<boolean>(false);
  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
  const [searchName, setSearchName] = useState('Tampines 4-Room Family Homes');
  const [alertEmail, setAlertEmail] = useState('ahteck.tan@example.sg');

  const handleToggleFlatType = (type: string) => {
    if (flatTypes.includes(type)) {
      if (flatTypes.length > 1) {
        setFlatTypes(flatTypes.filter((t) => t !== type));
      }
    } else {
      setFlatTypes([...flatTypes, type]);
    }
  };

  const handleResetFilters = () => {
    setSelectedTown('');
    setFlatTypes(['3-Room', '4-Room']);
    setPriceRange([400000, 800000]);
    setMinFloorArea(90);
    setRemainingLease('');
  };

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      if (selectedTown && item.town.toLowerCase() !== selectedTown.toLowerCase()) {
        return false;
      }
      if (flatTypes.length > 0 && !flatTypes.includes(item.flatType)) {
        return false;
      }
      if (item.price < priceRange[0] || item.price > priceRange[1]) {
        return false;
      }
      if (minFloorArea > 0 && item.areaSqm < minFloorArea) {
        return false;
      }
      if (remainingLease && item.leaseRemainingYears < Number(remainingLease)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      if (sortBy === 'Newest') return b.builtYear - a.builtYear;
      return 0; // Recommended default
    });
  }, [listings, selectedTown, flatTypes, priceRange, minFloorArea, remainingLease, sortBy]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      maximumFractionDigits: 0,
    }).format(val).replace('SGD', '$').trim();
  };

  return (
    <div className="flex flex-col w-full h-full pb-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface mb-2 font-semibold">
            Market Search
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Explore HDB resale units with advanced filtering and amenity mapping.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            id="save-search-btn"
            onClick={() => setShowSaveSearchModal(true)}
            className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-6 py-2 rounded-lg font-title-md transition-colors flex items-center gap-2 shadow-xs border border-outline-variant cursor-pointer text-sm"
          >
            <span className="material-symbols-outlined text-[20px]">save</span>
            <span>Save Search</span>
          </button>

          <button
            id="create-alert-btn"
            onClick={() => setShowCreateAlertModal(true)}
            className="bg-primary hover:bg-primary/90 text-on-primary px-6 py-2 rounded-lg font-title-md transition-all shadow-md hover:shadow-lg flex items-center gap-2 hover:-translate-y-0.5 cursor-pointer text-sm"
          >
            <span className="material-symbols-outlined text-[20px]">notifications_active</span>
            <span>Create Alert</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters (Left) + Map & Listings (Right) */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[750px]">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4 overflow-y-auto pr-1 pb-8 custom-scrollbar">
          <div
            id="market-filters-panel"
            className="bg-surface-container-lowest rounded-xl p-6 shadow-xs border border-outline-variant/30 flex flex-col gap-6 relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between">
              <h3 className="text-title-md font-title-md text-on-surface font-semibold">
                Filters
              </h3>
              <button
                id="reset-market-filters-btn"
                onClick={handleResetFilters}
                className="text-label-sm font-label-sm text-primary hover:text-primary-container uppercase tracking-wider cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Town Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
                Town / Estate
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                  location_on
                </span>
                <select
                  id="filter-town-select"
                  value={selectedTown}
                  onChange={(e) => setSelectedTown(e.target.value)}
                  className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary text-body-md font-body-md text-on-surface py-2 pl-10 pr-8 appearance-none rounded-t-md transition-colors outline-none cursor-pointer"
                >
                  <option value="">All Towns</option>
                  <option value="ang-mo-kio">Ang Mo Kio</option>
                  <option value="bedok">Bedok</option>
                  <option value="bishan">Bishan</option>
                  <option value="bukit-merah">Bukit Merah</option>
                  <option value="clementi">Clementi</option>
                  <option value="tampines">Tampines</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Flat Type */}
            <div className="flex flex-col gap-2">
              <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
                Flat Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['3-Room', '4-Room', '5-Room', 'Executive'].map((type) => {
                  const isChecked = flatTypes.includes(type);
                  return (
                    <label
                      key={type}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors border ${
                        isChecked
                          ? 'bg-surface-container-low border-primary/40'
                          : 'hover:bg-surface-container-low border-outline-variant/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleFlatType(type)}
                        className="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary accent-primary"
                      />
                      <span className="text-body-md font-body-md text-on-surface text-sm">
                        {type}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="flex flex-col gap-3">
              <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider flex justify-between">
                <span>Price Range</span>
                <span className="text-primary font-medium">
                  {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                </span>
              </label>
              <div className="space-y-2">
                <input
                  id="price-range-slider"
                  type="range"
                  min="300000"
                  max="1000000"
                  step="25000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-on-surface-variant font-mono">
                  <span>$300k</span>
                  <span>$650k</span>
                  <span>$1.0M+</span>
                </div>
              </div>
            </div>

            {/* Floor Area */}
            <div className="flex flex-col gap-2">
              <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
                Min Floor Area (sqm)
              </label>
              <div className="flex gap-2">
                {[70, 90, 110].map((area) => {
                  const isSelected = minFloorArea === area;
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => setMinFloorArea(area)}
                      className={`flex-1 py-2 rounded-lg font-body-md text-sm transition-all ${
                        isSelected
                          ? 'bg-primary-container text-on-primary-container border border-primary-container font-semibold shadow-xs'
                          : 'border border-outline-variant hover:bg-surface-container-low text-on-surface'
                      }`}
                    >
                      {area === 110 ? '110+' : area}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Remaining Lease */}
            <div className="flex flex-col gap-2">
              <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
                Remaining Lease
              </label>
              <div className="relative">
                <select
                  id="filter-lease-select"
                  value={remainingLease}
                  onChange={(e) => setRemainingLease(e.target.value)}
                  className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary text-body-md font-body-md text-on-surface py-2 px-3 appearance-none rounded-t-md transition-colors outline-none cursor-pointer"
                >
                  <option value="">Any</option>
                  <option value="60">&gt; 60 Years</option>
                  <option value="75">&gt; 75 Years</option>
                  <option value="85">&gt; 85 Years</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Sticky Note Style Resource Card */}
          <div
            id="budget-calculator-sticky-note"
            className="bg-secondary-container/20 rounded-xl p-5 shadow-xs border border-secondary-container/30 relative overflow-hidden rotate-[-1deg] hover:rotate-0 transition-transform duration-300 cursor-pointer"
            onClick={onNavigateToFinancialTools}
          >
            <div className="absolute top-0 right-0 w-8 h-8 bg-surface shadow-[-2px_2px_4px_rgba(0,0,0,0.1)] rounded-bl-lg pointer-events-none" />
            <h4 className="text-title-md font-title-md text-on-secondary-container mb-2 font-semibold">
              Budget Calculator
            </h4>
            <p className="text-body-md font-body-md text-on-surface-variant mb-4 text-xs">
              Determine your affordability before starting your search to narrow down realistic options.
            </p>
            <button
              type="button"
              className="text-label-sm font-label-sm bg-secondary text-on-secondary px-4 py-2 rounded uppercase tracking-wider hover:bg-secondary/90 transition-colors inline-block font-semibold text-xs shadow-xs"
            >
              Calculate Now
            </button>
          </div>
        </div>

        {/* Main Content Area (Interactive Map & Listings) */}
        <div className="flex-1 flex flex-col gap-6 min-h-0 h-full">
          {/* Interactive Map Panel */}
          <div
            id="tampines-interactive-map"
            className="flex-none h-[320px] bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/30 overflow-hidden relative group"
          >
            {/* Top map floating controls */}
            <div className="absolute inset-x-4 top-4 z-10 flex justify-between items-start pointer-events-none">
              <div className="bg-surface/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-md border border-outline-variant/20 pointer-events-auto">
                <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider block mb-0.5 text-[11px]">
                  Location Map
                </span>
                <p className="text-title-md font-title-md text-on-surface font-semibold text-base">
                  {selectedTown ? `${selectedTown.charAt(0).toUpperCase() + selectedTown.slice(1)} Central` : 'Tampines Central'}
                </p>
              </div>

              <div className="flex gap-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setShowCafes(!showCafes)}
                  className={`rounded-lg p-2 shadow-xs border transition-all ${
                    showCafes
                      ? 'bg-surface border-primary text-primary ring-1 ring-primary/20'
                      : 'bg-surface/70 border-outline-variant/30 text-outline'
                  }`}
                  title="Toggle Amenities & Cafes"
                >
                  <span className="material-symbols-outlined text-[20px]">local_cafe</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowTransport(!showTransport)}
                  className={`rounded-lg p-2 shadow-xs border transition-all ${
                    showTransport
                      ? 'bg-surface border-secondary text-secondary ring-1 ring-secondary/20'
                      : 'bg-surface/70 border-outline-variant/30 text-outline'
                  }`}
                  title="Toggle Transport & MRT Stations"
                >
                  <span className="material-symbols-outlined text-[20px]">train</span>
                </button>
              </div>
            </div>

            {/* Map background */}
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700"
              style={{ backgroundImage: `url('${TAMPINES_MAP_BG}')` }}
            />

            {/* Amenity pins overlay */}
            {showTransport && (
              <>
                <div className="absolute top-[48%] left-[42%] -translate-x-1/2 -translate-y-1/2 bg-white/95 px-2 py-1 rounded-md shadow-md border border-secondary text-[11px] font-semibold text-secondary flex items-center gap-1 z-10">
                  <span className="material-symbols-outlined text-[14px]">train</span>
                  <span>Tampines MRT (DT32/EW2)</span>
                </div>
                <div className="absolute top-[28%] left-[75%] -translate-x-1/2 -translate-y-1/2 bg-white/95 px-2 py-1 rounded-md shadow-md border border-secondary text-[11px] font-semibold text-secondary flex items-center gap-1 z-10">
                  <span className="material-symbols-outlined text-[14px]">train</span>
                  <span>Tampines East (DT33)</span>
                </div>
              </>
            )}

            {showCafes && (
              <div className="absolute top-[65%] left-[55%] -translate-x-1/2 -translate-y-1/2 bg-white/95 px-2 py-0.5 rounded-md shadow-xs border border-outline-variant text-[10px] text-on-surface-variant flex items-center gap-1 z-10">
                <span className="material-symbols-outlined text-[12px] text-primary">storefront</span>
                <span>Our Tampines Hub</span>
              </div>
            )}

            {/* Map Price Pins matching prompt */}
            <div
              onClick={() => {
                const target = listings.find((l) => l.id === 'tampines-284');
                if (target) onSelectListing(target);
                setSelectedPinId('tampines-284');
              }}
              className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-primary text-on-primary px-3 py-1 rounded-full text-label-sm font-label-sm shadow-md border border-white cursor-pointer hover:scale-110 transition-transform z-20 flex items-center gap-1"
            >
              <span className="font-bold">$520k</span>
            </div>

            <div
              onClick={() => {
                const target = listings.find((l) => l.id === 'tampines-151');
                if (target) onSelectListing(target);
                setSelectedPinId('tampines-151');
              }}
              className="absolute top-[60%] left-[30%] -translate-x-1/2 -translate-y-1/2 bg-surface text-primary px-3 py-1 rounded-full text-label-sm font-label-sm shadow-md border border-primary cursor-pointer hover:scale-110 transition-transform font-semibold z-20"
            >
              $480k
            </div>

            <div
              onClick={() => {
                const target = listings.find((l) => l.id === 'tampines-492');
                if (target) onSelectListing(target);
                setSelectedPinId('tampines-492');
              }}
              className="absolute top-[35%] left-[70%] -translate-x-1/2 -translate-y-1/2 bg-surface text-primary px-3 py-1 rounded-full text-label-sm font-label-sm shadow-md border border-primary cursor-pointer hover:scale-110 transition-transform font-semibold z-20"
            >
              $610k
            </div>
          </div>

          {/* Results List or Official Live Feed */}
          <div className="flex-1 flex flex-col bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant/30 flex flex-wrap justify-between items-center bg-surface-container-low/50 gap-3">
              <div className="flex items-center gap-2">
                <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/30">
                  <button
                    id="switch-curated-listings-btn"
                    onClick={() => setViewMode('listings')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      viewMode === 'listings'
                        ? 'bg-white text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">apartment</span>
                    <span>Curated Listings ({filteredListings.length})</span>
                  </button>
                  <button
                    id="switch-official-feed-btn"
                    onClick={() => setViewMode('official-api')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      viewMode === 'official-api'
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">cloud_sync</span>
                    <span>data.gov.sg Live Feed</span>
                  </button>
                </div>
              </div>

              {viewMode === 'listings' ? (
                <div className="flex items-center gap-3">
                  <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-xs">
                    Sort By:
                  </span>
                  <select
                    id="sort-listings-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-surface border border-outline-variant/30 text-body-md font-body-md text-primary font-medium py-1 px-3 rounded-md cursor-pointer outline-none focus:ring-1 focus:ring-primary/50 text-xs"
                  >
                    <option value="Recommended">Recommended</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                    <option value="Newest">Newest</option>
                  </select>
                </div>
              ) : (
                <span className="text-xs font-mono text-primary font-medium bg-primary/10 px-2.5 py-1 rounded">
                  Official HDB Records Jan 2017 - Present
                </span>
              )}
            </div>

            {viewMode === 'official-api' ? (
              <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                <OfficialHdbTransactionsExplorer
                  initialTown={selectedTown || 'TAMPINES'}
                  initialFlatType={flatTypes[0] || '4 ROOM'}
                />
              </div>
            ) : (
            /* Cards Grid */
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 custom-scrollbar">
              {filteredListings.map((listing) => {
                const isFav = favorites.includes(listing.id);
                return (
                  <div
                    key={listing.id}
                    id={`listing-card-${listing.id}`}
                    onClick={() => onSelectListing(listing)}
                    className="group bg-surface rounded-xl overflow-hidden shadow-xs hover:shadow-md border border-outline-variant/20 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
                  >
                    {/* Top Image + Badges */}
                    <div className="relative h-48 overflow-hidden bg-surface-container">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={`${listing.block} ${listing.street}`}
                        src={listing.imageUrl}
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        <span className="bg-tertiary text-on-tertiary text-label-sm font-label-sm px-2 py-1 rounded-full shadow-xs text-xs">
                          {listing.flatType}
                        </span>
                        {listing.tags.includes('High Floor') && (
                          <span className="bg-secondary-container/90 backdrop-blur text-on-secondary-container text-label-sm font-label-sm px-2 py-1 rounded-full shadow-xs border border-secondary-container text-xs">
                            High Floor
                          </span>
                        )}
                        {listing.unitType === 'Corner Unit' && (
                          <span className="bg-surface-container-high/90 backdrop-blur text-on-surface text-label-sm font-label-sm px-2 py-1 rounded-full shadow-xs border border-outline-variant/30 text-xs">
                            Corner Unit
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(listing.id);
                        }}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur flex items-center justify-center transition-colors shadow-xs ${
                          isFav ? 'bg-red-50 text-error' : 'bg-surface/80 text-on-surface-variant hover:text-error'
                        }`}
                        aria-label="Save listing"
                      >
                        <span
                          className="material-symbols-outlined text-[20px]"
                          style={isFav ? { fontVariationSettings: "'FILL' 1" } : {}}
                        >
                          favorite
                        </span>
                      </button>
                    </div>

                    {/* Bottom Details */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-title-md font-title-md text-on-surface line-clamp-1 group-hover:text-primary transition-colors font-semibold text-base">
                            {listing.block} {listing.street}
                          </h3>
                          <p className="text-label-sm font-label-sm text-on-surface-variant">
                            {listing.town.charAt(0).toUpperCase() + listing.town.slice(1)} • {listing.district}
                          </p>
                        </div>
                        <p className="text-headline-lg-mobile font-headline-lg-mobile text-primary font-bold">
                          {formatCurrency(listing.price)}
                        </p>
                      </div>

                      {/* Specs Row */}
                      <div className="flex gap-4 mt-auto pt-4 border-t border-outline-variant/20">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-label-sm">
                            Area
                          </span>
                          <span className="text-body-md font-body-md text-on-surface font-medium font-label-sm text-sm">
                            {listing.areaSqm} sqm
                          </span>
                        </div>
                        <div className="w-[1px] bg-outline-variant/30"></div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-label-sm">
                            Built
                          </span>
                          <span className="text-body-md font-body-md text-on-surface font-medium font-label-sm text-sm">
                            {listing.builtYear}
                          </span>
                        </div>
                        <div className="w-[1px] bg-outline-variant/30"></div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-label-sm">
                            Lease Left
                          </span>
                          <span className="text-body-md font-body-md text-on-surface font-medium font-label-sm text-sm">
                            {listing.leaseRemainingYears} yrs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Search Modal */}
      {showSaveSearchModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30">
            <h3 className="text-title-md font-bold text-on-surface mb-2">Save This Search</h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Get instant updates when new HDB units matching your filters hit the resale market.
            </p>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-sm text-on-surface outline-none focus:border-primary mb-4"
              placeholder="Search Name"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSaveSearchModal(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg hover:bg-surface-container text-on-surface"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSavedSearchSuccess(true);
                  setTimeout(() => {
                    setSavedSearchSuccess(false);
                    setShowSaveSearchModal(false);
                  }, 1000);
                }}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90"
              >
                {savedSearchSuccess ? 'Saved!' : 'Save Search'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Alert Modal */}
      {showCreateAlertModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30">
            <h3 className="text-title-md font-bold text-on-surface mb-2">Create Price & Grant Alert</h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Receive WhatsApp / Email notifications for price drops and verified HDB listings.
            </p>
            <input
              type="email"
              value={alertEmail}
              onChange={(e) => setAlertEmail(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-sm text-on-surface outline-none focus:border-primary mb-4"
              placeholder="Your email address"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCreateAlertModal(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg hover:bg-surface-container text-on-surface"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setAlertSuccess(true);
                  setTimeout(() => {
                    setAlertSuccess(false);
                    setShowCreateAlertModal(false);
                  }, 1000);
                }}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90"
              >
                {alertSuccess ? 'Alert Active!' : 'Activate Alert'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
