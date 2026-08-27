import { DataGovHdbRecord, DataGovSearchResult, DataGovMetadata } from '../types';

export const DATASET_RESOURCE_ID = 'd_8b84c4ee58e3cfc0ece0d773c8ca6abc';
export const DATA_GOV_SEARCH_API = `https://data.gov.sg/api/action/datastore_search?resource_id=${DATASET_RESOURCE_ID}`;
export const DATA_GOV_METADATA_API = `https://api-production.data.gov.sg/v2/public/api/datasets/${DATASET_RESOURCE_ID}/metadata`;

// Fallback seed records if offline or network restricted
export const FALLBACK_RECORDS: DataGovHdbRecord[] = [
  {
    _id: 1,
    month: '2017-01',
    town: 'ANG MO KIO',
    flat_type: '2 ROOM',
    block: '406',
    street_name: 'ANG MO KIO AVE 10',
    storey_range: '10 TO 12',
    floor_area_sqm: '44',
    flat_model: 'Improved',
    lease_commence_date: '1979',
    remaining_lease: '61 years 04 months',
    resale_price: '232000',
  },
  {
    _id: 2,
    month: '2017-01',
    town: 'ANG MO KIO',
    flat_type: '3 ROOM',
    block: '108',
    street_name: 'ANG MO KIO AVE 4',
    storey_range: '01 TO 03',
    floor_area_sqm: '67',
    flat_model: 'New Generation',
    lease_commence_date: '1978',
    remaining_lease: '60 years 07 months',
    resale_price: '250000',
  },
  {
    _id: 3,
    month: '2017-01',
    town: 'ANG MO KIO',
    flat_type: '3 ROOM',
    block: '602',
    street_name: 'ANG MO KIO AVE 5',
    storey_range: '01 TO 03',
    floor_area_sqm: '67',
    flat_model: 'New Generation',
    lease_commence_date: '1980',
    remaining_lease: '62 years 05 months',
    resale_price: '262000',
  },
  {
    _id: 4,
    month: '2017-01',
    town: 'ANG MO KIO',
    flat_type: '3 ROOM',
    block: '465',
    street_name: 'ANG MO KIO AVE 10',
    storey_range: '04 TO 06',
    floor_area_sqm: '68',
    flat_model: 'New Generation',
    lease_commence_date: '1980',
    remaining_lease: '62 years 01 month',
    resale_price: '265000',
  },
  {
    _id: 5,
    month: '2017-01',
    town: 'ANG MO KIO',
    flat_type: '3 ROOM',
    block: '601',
    street_name: 'ANG MO KIO AVE 5',
    storey_range: '01 TO 03',
    floor_area_sqm: '67',
    flat_model: 'New Generation',
    lease_commence_date: '1980',
    remaining_lease: '62 years 05 months',
    resale_price: '265000',
  },
  {
    _id: 940,
    month: '2017-01',
    town: 'TAMPINES',
    flat_type: '4 ROOM',
    block: '458',
    street_name: 'TAMPINES ST 42',
    storey_range: '10 TO 12',
    floor_area_sqm: '84',
    flat_model: 'Simplified',
    lease_commence_date: '1988',
    remaining_lease: '70 years 01 month',
    resale_price: '370000',
  },
  {
    _id: 941,
    month: '2017-01',
    town: 'TAMPINES',
    flat_type: '4 ROOM',
    block: '714',
    street_name: 'TAMPINES ST 71',
    storey_range: '01 TO 03',
    floor_area_sqm: '100',
    flat_model: 'Model A',
    lease_commence_date: '1997',
    remaining_lease: '79 years 02 months',
    resale_price: '385000',
  },
  {
    _id: 942,
    month: '2017-01',
    town: 'TAMPINES',
    flat_type: '4 ROOM',
    block: '489A',
    street_name: 'TAMPINES ST 45',
    storey_range: '10 TO 12',
    floor_area_sqm: '104',
    flat_model: 'Model A',
    lease_commence_date: '1989',
    remaining_lease: '71 years 05 months',
    resale_price: '394000',
  },
  {
    _id: 943,
    month: '2017-01',
    town: 'TAMPINES',
    flat_type: '4 ROOM',
    block: '369',
    street_name: 'TAMPINES ST 34',
    storey_range: '01 TO 03',
    floor_area_sqm: '100',
    flat_model: 'Model A',
    lease_commence_date: '1997',
    remaining_lease: '79 years 02 months',
    resale_price: '395000',
  },
  {
    _id: 944,
    month: '2017-01',
    town: 'TAMPINES',
    flat_type: '4 ROOM',
    block: '832',
    street_name: 'TAMPINES ST 82',
    storey_range: '04 TO 06',
    floor_area_sqm: '84',
    flat_model: 'Simplified',
    lease_commence_date: '1984',
    remaining_lease: '66 years 11 months',
    resale_price: '398000',
  },
];

export const FALLBACK_METADATA: DataGovMetadata = {
  datasetId: DATASET_RESOURCE_ID,
  name: 'Resale flat prices based on registration date from Jan-2017 onwards',
  description: 'Official HDB Resale transactions registered from Jan-2017 onwards across all Singapore towns and flat types. Managed by the Housing & Development Board.',
  managedBy: 'Housing & Development Board (HDB)',
  lastUpdatedAt: '2026-08-27T02:10:23+08:00',
  coverageStart: '2017-01-01',
  coverageEnd: 'Present (Continuous)',
  datasetSize: 23643168,
  format: 'CSV / JSON REST API',
};

/**
 * Fetch HDB Resale Transactions from data.gov.sg
 */
export async function fetchHdbResaleTransactions(options?: {
  limit?: number;
  offset?: number;
  town?: string;
  flatType?: string;
  query?: string;
  filters?: Record<string, string>;
}): Promise<{ records: DataGovHdbRecord[]; total?: number; rawUrl: string; isLive: boolean; error?: string }> {
  const limit = options?.limit ?? 5;
  const offset = options?.offset ?? 0;
  
  const params = new URLSearchParams();
  params.set('resource_id', DATASET_RESOURCE_ID);
  params.set('limit', limit.toString());
  if (offset > 0) {
    params.set('offset', offset.toString());
  }
  if (options?.query) {
    params.set('q', options.query);
  }

  // Construct filters
  const filters: Record<string, string> = { ...(options?.filters || {}) };
  if (options?.town && options.town.trim() !== '') {
    filters['town'] = options.town.toUpperCase().trim();
  }
  if (options?.flatType && options.flatType.trim() !== '') {
    // Normalise e.g. "4-Room" -> "4 ROOM" or "4 ROOM"
    let ft = options.flatType.toUpperCase().replace('-', ' ').trim();
    if (!ft.endsWith('ROOM') && !ft.endsWith('EXECUTIVE') && !ft.endsWith('MULTI-GENERATION')) {
      ft = `${ft} ROOM`;
    }
    filters['flat_type'] = ft;
  }

  if (Object.keys(filters).length > 0) {
    params.set('filters', JSON.stringify(filters));
  }

  const url = `https://data.gov.sg/api/action/datastore_search?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const data: DataGovSearchResult = await res.json();
    if (data.success && data.result) {
      return {
        records: data.result.records || [],
        total: data.result.total,
        rawUrl: url,
        isLive: true,
      };
    } else {
      throw new Error(data.error?.message || 'API responded with success: false');
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown network error';
    console.warn(`[data.gov.sg] Falling back to local dataset: ${errorMsg}`);
    
    // Filter local fallback records
    let filtered = [...FALLBACK_RECORDS];
    if (filters['town']) {
      filtered = filtered.filter(r => r.town.toLowerCase() === filters['town'].toLowerCase());
    }
    if (filters['flat_type']) {
      filtered = filtered.filter(r => r.flat_type.toLowerCase() === filters['flat_type'].toLowerCase());
    }
    if (options?.query) {
      const q = options.query.toLowerCase();
      filtered = filtered.filter(r => 
        r.block.toLowerCase().includes(q) || 
        r.street_name.toLowerCase().includes(q) || 
        r.town.toLowerCase().includes(q)
      );
    }

    return {
      records: filtered.slice(0, limit),
      total: filtered.length,
      rawUrl: url,
      isLive: false,
      error: errorMsg,
    };
  }
}

/**
 * Fetch HDB Resale dataset metadata from data.gov.sg
 */
export async function fetchHdbDatasetMetadata(): Promise<{ metadata: DataGovMetadata; isLive: boolean }> {
  try {
    const res = await fetch(DATA_GOV_METADATA_API, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data && data.data) {
      return {
        metadata: data.data,
        isLive: true,
      };
    }
    return {
      metadata: FALLBACK_METADATA,
      isLive: false,
    };
  } catch {
    return {
      metadata: FALLBACK_METADATA,
      isLive: false,
    };
  }
}
