export type TabType = 'dashboard' | 'market-search' | 'financial-tools' | 'my-viewings' | 'market-analysis' | 'community';

export type ApplicantProfile = 'first-timer-family' | 'first-timer-singles' | 'second-timer-family' | 'joint-singles';

export interface HdbListing {
  id: string;
  block: string;
  street: string;
  town: string;
  district: string;
  postalCode: string;
  flatType: '3-Room' | '4-Room' | '5-Room' | 'Executive';
  price: number;
  areaSqm: number;
  builtYear: number;
  leaseRemainingYears: number;
  floorLevel: 'High Floor' | 'Mid Floor' | 'Low Floor' | 'Ground Floor';
  unitType?: string; // e.g. "Corner Unit", "Model A", "Premium Apartment"
  tags: string[];
  imageUrl: string;
  additionalImages?: string[];
  description: string;
  mrtStation: string;
  mrtDistanceMins: number;
  isFavorite?: boolean;
  mapCoordinates: {
    topPercent: number;
    leftPercent: number;
  };
  valuationPrice: number;
  lastTransactedInBlock?: number;
}

export interface Viewing {
  id: string;
  listingId: string;
  propertyTitle: string;
  estate: string;
  date: string;
  timeSlot: string;
  consultantName: string;
  consultantPhone: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
  notes?: string;
  flatType: string;
  price: number;
}

export interface SavedSearch {
  id: string;
  name: string;
  town: string;
  flatTypes: string[];
  priceRange: [number, number];
  minArea: number;
  createdDate: string;
}

export interface AlertNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'listing' | 'price-drop' | 'grant' | 'viewing';
}

export interface GrantCalculationResult {
  familyGrant: number;
  ehg: number;
  phg: number;
  totalGrants: number;
  familyGrantEligible: boolean;
  ehgEligible: boolean;
  phgEligible: boolean;
  phgStatusText: string;
}

export interface AffordabilityResult {
  maxLoanAmount: number;
  cpfUsage: number;
  grants: number;
  estimatedBuyingPower: number;
  monthlyInstallment: number;
  loanTenure: number;
  interestRate: number;
  msrCap: number; // 30% of income
  agencyFeeTraditional: number;
  propTrustConsultantFee: number;
  transactionSavings: number;
}

export interface DataGovHdbRecord {
  _id: number;
  month: string;
  town: string;
  flat_type: string;
  block: string;
  street_name: string;
  storey_range: string;
  floor_area_sqm: string;
  flat_model: string;
  lease_commence_date: string;
  remaining_lease: string;
  resale_price: string;
}

export interface DataGovSearchResult {
  success: boolean;
  result?: {
    resource_id: string;
    total?: number;
    limit?: number;
    records: DataGovHdbRecord[];
    fields?: Array<{ type: string; id: string }>;
    _links?: Record<string, string>;
  };
  error?: {
    message: string;
  };
}

export interface DataGovMetadata {
  datasetId: string;
  name: string;
  description: string;
  managedBy: string;
  lastUpdatedAt: string;
  coverageStart: string;
  coverageEnd: string;
  datasetSize: number;
  format: string;
  columnMetadata?: {
    order: string[];
    map: Record<string, string>;
    metaMapping: Record<string, {
      name: string;
      columnTitle: string;
      dataType: string;
      description?: string;
    }>;
  };
}
