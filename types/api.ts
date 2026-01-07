// World Bank API data type
export interface WorldBankIndicator {
  country: { id: string; value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
  indicator: { id: string; value: string };
}

// ACLED data type
export interface ACLEDEvent {
  event_id_cnty: string;
  event_date: string;
  year: number;
  event_type: string;
  sub_event_type: string;
  country: string;
  region: string;
  latitude: number;
  longitude: number;
  fatalities: number;
  notes: string;
}

// UNHCR data type
export interface UNHCRData {
  year: number;
  country_of_origin: string;
  country_of_asylum: string;
  coo_iso?: string;
  coa_iso?: string;
  refugees: number;
  asylum_seekers: number;
  idps: number;
  returned_refugees?: number;
  returned_idps?: number;
  stateless?: number;
  ooc?: number;
}

// FEWS NET data type
export interface FEWSData {
  country: string;
  region: string;
  ipc_phase: number; // 1-5 (1=minimal, 5=famine)
  population_affected: number;
  projected_period: string;
}

// FEWS NET market price data
export interface FEWSMarketPrice {
  country: string;
  market: string;
  commodity: string; // rice, wheat, corn, beans, etc.
  currency: string;
  price: number;
  unit: string; // kg, lb, etc.
  date: string;
  price_change_percentage: number; // month-over-month change rate
}

// FEWS NET crop condition
export interface FEWSCropCondition {
  country: string;
  region: string;
  crop_type: string; // rice, wheat, corn, etc.
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'failed';
  season: string;
  yield_estimate: number | null; // tons per hectare
  rainfall_status: 'above_normal' | 'normal' | 'below_normal';
  soil_moisture: 'adequate' | 'moderate' | 'deficit';
  date: string;
}

// FEWS NET trade and supply flow
export interface FEWSTradeFlow {
  origin_country: string;
  destination_country: string;
  commodity: string;
  quantity: number; // metric tons
  trade_route: string;
  border_point: string;
  date: string;
  flow_status: 'normal' | 'restricted' | 'blocked';
  price_differential: number; // price difference (%)
}

// GDACS disaster data type
export interface GDACSAlert {
  eventid: string;
  eventtype: string;
  country: string;
  fromdate: string;
  todate: string;
  severity: string;
  population: number;
  vulnerability: number;
}

// Enhanced regional data type
export interface EnhancedRegionData {
  id: string;
  name: string;
  country: string;
  coordinates: [number, number];
  
  // Economic indicators
  economy: {
    gdpPerCapita: number | null;
    gdpGrowth: number | null;
    povertyRate: number | null;
    unemploymentRate: number | null;
    giniIndex: number | null;
  };
  
  // Social indicators
  social: {
    population: number | null;
    lifeExpectancy: number | null;
    literacyRate: number | null;
    urbanPopulation: number | null;
  };
  
  // Education indicators
  education: {
    expenditureGDPPercent: number | null;
    primaryEnrollment: number | null;
    secondaryEnrollment: number | null;
  };
  
  // Health indicators
  health: {
    healthExpenditureGDPPercent: number | null;
    physiciansPer1000: number | null;
    hospitalBedsPer1000: number | null;
    maternalMortalityRate: number | null;
  };
  
  // Crisis situations
  crises: {
    conflicts: ACLEDEvent[];
    disasters: GDACSAlert[];
    foodInsecurity: FEWSData | null;
    refugees: {
      origin: number;
      asylum: number;
      idps: number;
    };
  };
  
  // Categories (for filtering)
  categories: CrisisCategory[];
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low';
  
  lastUpdated: string;
}

export type CrisisCategory = 
  | 'War/Conflict' 
  | 'Hunger/Food Shortage' 
  | 'Poverty' 
  | 'Education' 
  | 'Health/Medical'
  | 'Refugees'
  | 'Natural Disasters'
  | 'Environment';

// Charity financial analysis type
export interface CharityFinancials {
  ein: string; // Employer Identification Number
  name: string;
  year: number;
  
  revenue: {
    total: number;
    contributions: number;
    programService: number;
    investment: number;
  };
  
  expenses: {
    total: number;
    program: number;
    administration: number;
    fundraising: number;
  };
  
  assets: {
    total: number;
    net: number;
  };
  
  // Efficiency metrics
  metrics: {
    programExpenseRatio: number; // Program expense ratio
    administrativeExpenseRatio: number; // Administrative expense ratio
    fundraisingExpenseRatio: number; // Fundraising expense ratio
    operatingExpenseRatio: number; // Operating efficiency: expense/revenue ratio
    workingCapitalRatio: number; // Working capital ratio
    revenueGrowth: number; // Year-over-year revenue growth
    expenseGrowth: number; // Year-over-year expense growth
  };
}

export interface EnhancedCharityOrganization {
  id: string;
  ein?: string; // IRS EIN (US organizations only)
  name: string;
  description: string;
  
  // Core fields
  transparencyScore: number;
  rating: number;
  focusAreas: CrisisCategory[];
  website: string;
  donationLink: string;
  
  // Active regions (with coordinates)
  regions: {
    id: string;
    name: string;
    coordinates: [number, number];
  }[];
  
  // Financial information
  financials?: CharityFinancials;
  
  // Impact metrics
  impactMetrics: {
    peopleBenefited: number;
    projectsCompleted: number;
    countriesActive: number;
  };
  
  certifications: string[];
  foundedYear: number;
  
  lastUpdated: string;
}

