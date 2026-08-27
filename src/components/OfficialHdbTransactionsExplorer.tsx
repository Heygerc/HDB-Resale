import React, { useState, useEffect, useCallback } from 'react';
import { DataGovHdbRecord, DataGovMetadata } from '../types';
import {
  fetchHdbResaleTransactions,
  fetchHdbDatasetMetadata,
  DATASET_RESOURCE_ID,
  DATA_GOV_SEARCH_API,
  DATA_GOV_METADATA_API,
} from '../services/dataGovService';

interface OfficialHdbTransactionsExplorerProps {
  initialTown?: string;
  initialFlatType?: string;
  className?: string;
}

export const OfficialHdbTransactionsExplorer: React.FC<OfficialHdbTransactionsExplorerProps> = ({
  initialTown = '',
  initialFlatType = '',
  className = '',
}) => {
  const [town, setTown] = useState<string>(initialTown);
  const [flatType, setFlatType] = useState<string>(initialFlatType);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [limit, setLimit] = useState<number>(5);
  const [activePreset, setActivePreset] = useState<'first5' | 'tampines4rm' | 'metadata' | 'custom'>('first5');

  const [records, setRecords] = useState<DataGovHdbRecord[]>([]);
  const [metadata, setMetadata] = useState<DataGovMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [currentUrl, setCurrentUrl] = useState<string>(`${DATA_GOV_SEARCH_API}&limit=5`);
  const [showRawJson, setShowRawJson] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  // Load data callback
  const loadTransactions = useCallback(async (
    targetTown: string,
    targetFlatType: string,
    targetLimit: number,
    queryText: string = ''
  ) => {
    setLoading(true);
    try {
      const res = await fetchHdbResaleTransactions({
        limit: targetLimit,
        town: targetTown,
        flatType: targetFlatType,
        query: queryText,
      });
      setRecords(res.records);
      setIsLive(res.isLive);
      setCurrentUrl(res.rawUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMetadata = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchHdbDatasetMetadata();
      setMetadata(res.metadata);
      setIsLive(res.isLive);
      setCurrentUrl(DATA_GOV_METADATA_API);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger default preset on mount
  useEffect(() => {
    loadTransactions('', '', 5, '');
    fetchHdbDatasetMetadata().then(res => setMetadata(res.metadata));
  }, [loadTransactions]);

  // Preset Handlers
  const handlePresetFirst5 = () => {
    setActivePreset('first5');
    setTown('');
    setFlatType('');
    setSearchQuery('');
    setLimit(5);
    loadTransactions('', '', 5, '');
  };

  const handlePresetTampines4Room = () => {
    setActivePreset('tampines4rm');
    setTown('TAMPINES');
    setFlatType('4 ROOM');
    setSearchQuery('');
    setLimit(5);
    loadTransactions('TAMPINES', '4 ROOM', 5, '');
  };

  const handlePresetMetadata = () => {
    setActivePreset('metadata');
    loadMetadata();
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActivePreset('custom');
    loadTransactions(town, flatType, limit, searchQuery);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const formatCurrency = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '$0';
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      maximumFractionDigits: 0,
    }).format(num).replace('SGD', '$').trim();
  };

  const calculatePsf = (priceStr: string, areaStr: string) => {
    const price = parseFloat(priceStr);
    const area = parseFloat(areaStr);
    if (!price || !area) return 0;
    const sqft = area * 10.7639;
    return Math.round(price / sqft);
  };

  return (
    <div id="data-gov-transactions-explorer" className={`bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm overflow-hidden flex flex-col ${className}`}>
      {/* Top Banner with official badge */}
      <div className="p-6 bg-gradient-to-r from-primary-container via-primary to-primary-container text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-secondary text-white text-[11px] font-label-sm font-semibold uppercase px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">cloud_sync</span>
              <span>Official Singapore Government API</span>
            </span>
            <span className="text-xs text-white/80 font-mono">
              Dataset ID: {DATASET_RESOURCE_ID.slice(0, 10)}...
            </span>
          </div>
          <h2 className="font-headline-lg text-title-md sm:text-headline-lg font-bold text-white tracking-tight">
            HDB Resale Prices Real-Time Feed (Jan 2017 Onwards)
          </h2>
          <p className="text-xs text-white/85 max-w-2xl mt-1">
            Directly connected to Singapore's national open data portal (<code>data.gov.sg</code>) for certified resale transactions, floor area specs, and remaining lease durations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-xs">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="font-medium text-white">{isLive ? 'Live API Connected' : 'Cached Feed'}</span>
          </div>
          <button
            onClick={() => setShowRawJson(!showRawJson)}
            className="bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 transition-all flex items-center gap-1"
            title="Inspect raw JSON endpoint response"
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            <span>{showRawJson ? 'Hide JSON' : 'Raw API'}</span>
          </button>
        </div>
      </div>

      {/* Preset Action Bar */}
      <div className="px-6 py-4 bg-surface-container-low/60 border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-label-sm mr-1">
            Quick Endpoints:
          </span>
          <button
            id="preset-first-5-btn"
            onClick={handlePresetFirst5}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activePreset === 'first5'
                ? 'bg-primary text-white font-semibold shadow-xs'
                : 'bg-surface hover:bg-surface-container text-on-surface border border-outline-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">filter_1</span>
            <span>First 5 Resale Transactions</span>
          </button>

          <button
            id="preset-tampines-4rm-btn"
            onClick={handlePresetTampines4Room}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activePreset === 'tampines4rm'
                ? 'bg-primary text-white font-semibold shadow-xs'
                : 'bg-surface hover:bg-surface-container text-on-surface border border-outline-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">location_city</span>
            <span>Filtered: Tampines 4-Room</span>
          </button>

          <button
            id="preset-metadata-btn"
            onClick={handlePresetMetadata}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activePreset === 'metadata'
                ? 'bg-primary text-white font-semibold shadow-xs'
                : 'bg-surface hover:bg-surface-container text-on-surface border border-outline-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>Dataset Metadata & Schema</span>
          </button>
        </div>

        <button
          onClick={handleCopyUrl}
          className="text-xs text-primary hover:text-primary-container font-mono flex items-center gap-1 py-1 px-2.5 rounded bg-surface border border-outline-variant/30 hover:bg-surface-container transition-colors"
          title="Copy exact data.gov.sg API endpoint URL"
        >
          <span className="material-symbols-outlined text-[14px]">
            {copiedUrl ? 'check' : 'content_copy'}
          </span>
          <span>{copiedUrl ? 'Copied URL!' : 'Copy API URL'}</span>
        </button>
      </div>

      {/* Query Filter Form */}
      <form onSubmit={handleCustomSearch} className="p-6 border-b border-outline-variant/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-surface">
        {/* Town Select */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
            Town / Estate
          </label>
          <select
            value={town}
            onChange={(e) => {
              setTown(e.target.value);
              setActivePreset('custom');
            }}
            className="w-full bg-surface-container-low border border-outline-variant/40 focus:border-primary text-xs rounded-lg py-2 px-2.5 text-on-surface outline-none"
          >
            <option value="">All Singapore Towns</option>
            <option value="TAMPINES">TAMPINES</option>
            <option value="ANG MO KIO">ANG MO KIO</option>
            <option value="BEDOK">BEDOK</option>
            <option value="BISHAN">BISHAN</option>
            <option value="BUKIT BATOK">BUKIT BATOK</option>
            <option value="BUKIT MERAH">BUKIT MERAH</option>
            <option value="BUKIT PANJANG">BUKIT PANJANG</option>
            <option value="CHOA CHU KANG">CHOA CHU KANG</option>
            <option value="CLEMENTI">CLEMENTI</option>
            <option value="GEYLANG">GEYLANG</option>
            <option value="HOUGANG">HOUGANG</option>
            <option value="JURONG EAST">JURONG EAST</option>
            <option value="JURONG WEST">JURONG WEST</option>
            <option value="KALLANG/WHAMPOA">KALLANG/WHAMPOA</option>
            <option value="PASIR RIS">PASIR RIS</option>
            <option value="PUNGGOL">PUNGGOL</option>
            <option value="QUEENSTOWN">QUEENSTOWN</option>
            <option value="SEMBAWANG">SEMBAWANG</option>
            <option value="SENGKANG">SENGKANG</option>
            <option value="SERANGOON">SERANGOON</option>
            <option value="TOA PAYOH">TOA PAYOH</option>
            <option value="WOODLANDS">WOODLANDS</option>
            <option value="YISHUN">YISHUN</option>
          </select>
        </div>

        {/* Flat Type Select */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
            Flat Type
          </label>
          <select
            value={flatType}
            onChange={(e) => {
              setFlatType(e.target.value);
              setActivePreset('custom');
            }}
            className="w-full bg-surface-container-low border border-outline-variant/40 focus:border-primary text-xs rounded-lg py-2 px-2.5 text-on-surface outline-none"
          >
            <option value="">All Flat Types</option>
            <option value="2 ROOM">2 ROOM</option>
            <option value="3 ROOM">3 ROOM</option>
            <option value="4 ROOM">4 ROOM</option>
            <option value="5 ROOM">5 ROOM</option>
            <option value="EXECUTIVE">EXECUTIVE</option>
            <option value="MULTI-GENERATION">MULTI-GENERATION</option>
          </select>
        </div>

        {/* Keyword Search */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
            Block / Street Name
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActivePreset('custom');
            }}
            placeholder="e.g. 284, Tampines St 22..."
            className="w-full bg-surface-container-low border border-outline-variant/40 focus:border-primary text-xs rounded-lg py-2 px-2.5 text-on-surface outline-none"
          />
        </div>

        {/* Limit Select */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
            Records Limit
          </label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setActivePreset('custom');
            }}
            className="w-full bg-surface-container-low border border-outline-variant/40 focus:border-primary text-xs rounded-lg py-2 px-2.5 text-on-surface outline-none"
          >
            <option value={5}>5 records (Default)</option>
            <option value={10}>10 records</option>
            <option value={20}>20 records</option>
            <option value={50}>50 records</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold text-xs py-2 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 h-[34px] disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">
              {loading ? 'progress_activity' : 'search'}
            </span>
            <span>{loading ? 'Querying API...' : 'Fetch Official Data'}</span>
          </button>
        </div>
      </form>

      {/* Active API URL Bar */}
      <div className="px-6 py-2 bg-surface-container-low/40 border-b border-outline-variant/15 flex items-center justify-between text-[11px] text-on-surface-variant font-mono">
        <div className="truncate flex items-center gap-2">
          <span className="text-primary font-bold">GET</span>
          <span className="truncate max-w-xl">{currentUrl}</span>
        </div>
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline flex items-center gap-0.5 font-sans text-xs ml-2 flex-shrink-0"
        >
          <span>Open API Endpoint</span>
          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
        </a>
      </div>

      {/* Raw JSON viewer */}
      {showRawJson && (
        <div className="p-4 bg-gray-900 text-green-400 font-mono text-xs overflow-x-auto max-h-64 border-b border-gray-800">
          <pre>{JSON.stringify(activePreset === 'metadata' ? metadata : { success: true, result: { records } }, null, 2)}</pre>
        </div>
      )}

      {/* Content Area */}
      <div className="p-6">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-[36px] text-primary animate-spin">
              autorenew
            </span>
            <p className="text-xs font-medium">Fetching real-time records from data.gov.sg datastore...</p>
          </div>
        ) : activePreset === 'metadata' && metadata ? (
          /* Metadata Display */
          <div className="space-y-6">
            <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant/20 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-on-surface">{metadata.name}</h3>
                <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Format: {metadata.format}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {metadata.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-outline-variant/20 text-xs">
                <div>
                  <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">Managed By</span>
                  <span className="font-semibold text-on-surface">{metadata.managedBy}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">Coverage Period</span>
                  <span className="font-semibold text-on-surface">Jan 2017 – Present</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">Last Synchronized</span>
                  <span className="font-semibold text-on-surface">{new Date(metadata.lastUpdatedAt).toLocaleString('en-SG')}</span>
                </div>
              </div>
            </div>

            {/* Field Schema Table */}
            <div>
              <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2 font-label-sm">
                Dataset Schema & Field Definitions
              </h4>
              <div className="border border-outline-variant/20 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-high/60 text-on-surface-variant">
                    <tr>
                      <th className="p-2.5">Field Name</th>
                      <th className="p-2.5">Data Type</th>
                      <th className="p-2.5">Example Value</th>
                      <th className="p-2.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/15 font-mono text-[11px]">
                    <tr>
                      <td className="p-2.5 font-bold text-primary">month</td>
                      <td className="p-2.5 text-on-surface-variant">Text (YYYY-MM)</td>
                      <td className="p-2.5 text-on-surface">"2017-01"</td>
                      <td className="p-2.5 font-sans text-on-surface-variant">Registration month of transaction</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-primary">town</td>
                      <td className="p-2.5 text-on-surface-variant">Text</td>
                      <td className="p-2.5 text-on-surface">"TAMPINES"</td>
                      <td className="p-2.5 font-sans text-on-surface-variant">HDB Town / Estate name</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-primary">flat_type</td>
                      <td className="p-2.5 text-on-surface-variant">Text</td>
                      <td className="p-2.5 text-on-surface">"4 ROOM"</td>
                      <td className="p-2.5 font-sans text-on-surface-variant">Flat room configuration</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-primary">block</td>
                      <td className="p-2.5 text-on-surface-variant">Text</td>
                      <td className="p-2.5 text-on-surface">"458"</td>
                      <td className="p-2.5 font-sans text-on-surface-variant">HDB Block identifier</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-primary">street_name</td>
                      <td className="p-2.5 text-on-surface-variant">Text</td>
                      <td className="p-2.5 text-on-surface">"TAMPINES ST 42"</td>
                      <td className="p-2.5 font-sans text-on-surface-variant">Official street address</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-primary">storey_range</td>
                      <td className="p-2.5 text-on-surface-variant">Text</td>
                      <td className="p-2.5 text-on-surface">"10 TO 12"</td>
                      <td className="p-2.5 font-sans text-on-surface-variant">Floor level bracket</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-primary">floor_area_sqm</td>
                      <td className="p-2.5 text-on-surface-variant">Numeric (sqm)</td>
                      <td className="p-2.5 text-on-surface">"84"</td>
                      <td className="p-2.5 font-sans text-on-surface-variant">Approximate floor area</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-primary">flat_model</td>
                      <td className="p-2.5 text-on-surface-variant">Text</td>
                      <td className="p-2.5 text-on-surface">"Simplified / Model A"</td>
                      <td className="p-2.5 font-sans text-on-surface-variant">Architectural flat model</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-primary">remaining_lease</td>
                      <td className="p-2.5 text-on-surface-variant">Text</td>
                      <td className="p-2.5 text-on-surface">"70 years 01 month"</td>
                      <td className="p-2.5 font-sans text-on-surface-variant">Remaining tenure duration</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-primary">resale_price</td>
                      <td className="p-2.5 text-on-surface-variant">Numeric ($SGD)</td>
                      <td className="p-2.5 text-on-surface">"370000"</td>
                      <td className="p-2.5 font-sans text-on-surface-variant">Transacted purchase price agreed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Records Table & Cards */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface">
                Showing {records.length} Resale Transactions
              </span>
              <span className="text-[11px] text-on-surface-variant font-mono">
                Source: data.gov.sg
              </span>
            </div>

            {records.length === 0 ? (
              <div className="text-center py-10 bg-surface-container-low rounded-xl border border-outline-variant/20">
                <span className="material-symbols-outlined text-[36px] text-outline mb-1">
                  search_off
                </span>
                <p className="text-xs text-on-surface-variant font-medium">
                  No resale transactions matched your query filter.
                </p>
              </div>
            ) : (
              <div className="border border-outline-variant/30 rounded-xl overflow-hidden text-xs shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-high/60 text-on-surface-variant font-label-sm">
                      <tr>
                        <th className="p-3">#ID</th>
                        <th className="p-3">Registration</th>
                        <th className="p-3">Town</th>
                        <th className="p-3">Address & Model</th>
                        <th className="p-3">Flat Type</th>
                        <th className="p-3">Storey</th>
                        <th className="p-3">Floor Area</th>
                        <th className="p-3">Remaining Lease</th>
                        <th className="p-3 text-right">Transacted Price</th>
                        <th className="p-3 text-right">Est. PSF</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/15">
                      {records.map((r) => {
                        const psf = calculatePsf(r.resale_price, r.floor_area_sqm);
                        return (
                          <tr key={r._id} className="hover:bg-surface-container-low/50 transition-colors">
                            <td className="p-3 font-mono text-on-surface-variant">{r._id}</td>
                            <td className="p-3 font-mono font-medium text-on-surface">{r.month}</td>
                            <td className="p-3 font-semibold text-primary">{r.town}</td>
                            <td className="p-3">
                              <span className="font-semibold text-on-surface block">
                                Blk {r.block} {r.street_name}
                              </span>
                              <span className="text-[10px] text-on-surface-variant font-mono">
                                Model: {r.flat_model} (Built ~{r.lease_commence_date})
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="bg-tertiary/10 text-tertiary font-semibold px-2 py-0.5 rounded text-[11px]">
                                {r.flat_type}
                              </span>
                            </td>
                            <td className="p-3 text-on-surface-variant font-mono">{r.storey_range}</td>
                            <td className="p-3 font-mono">
                              {r.floor_area_sqm} sqm
                              <span className="text-[10px] text-on-surface-variant block">
                                (~{Math.round(parseFloat(r.floor_area_sqm) * 10.7639)} sqft)
                              </span>
                            </td>
                            <td className="p-3 font-mono text-xs text-on-surface">
                              {r.remaining_lease}
                            </td>
                            <td className="p-3 text-right font-bold text-primary font-mono text-sm">
                              {formatCurrency(r.resale_price)}
                            </td>
                            <td className="p-3 text-right font-mono text-xs text-on-surface-variant">
                              ${psf} psf
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
