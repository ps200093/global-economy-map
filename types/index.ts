// Economic issue type
export type EconomicIssueType = 
  | 'Poverty' 
  | 'Unemployment' 
  | 'Food Shortage' 
  | 'Education' 
  | 'Health' 
  | 'Infrastructure' 
  | 'Environment';

// Support area type
export type SupportAreaType = 
  | 'Clean Water Infrastructure'
  | 'Education Programs'
  | 'Healthcare Services'
  | 'Food Security'
  | 'Economic Development'
  | 'Emergency Relief';

// Access level
export type AccessLevel = 'High' | 'Medium' | 'Low' | 'Critical';

// Country data (new structure)
export interface CountryData {
  id: string;
  name: string;
  nameKo: string; // Korean name
  iso3: string; // ISO 3166-1 alpha-3 code
  coordinates: [number, number]; // [latitude, longitude]
  
  // Key indicators - compatible with CountryScore indicators
  indicators: {
    poverty?: number; // Poverty rate (%) - converted from povertyRate
    povertyRate?: number; // Original field name from MongoDB
    giniIndex?: number;
    gdpPerCapita?: number;
    unemploymentRate?: number;
    lifeExpectancy?: number;
    malnutritionRate?: number;
    stuntingRate?: number;
    healthExpenditure?: number;
    literacyRate?: number;
    educationExpenditure?: number;
    foodProductionIndex?: number;
    population?: number;
    // For UI display (optional)
    educationAccess?: AccessLevel;
    waterStability?: AccessLevel;
    healthcareAccess?: AccessLevel;
    foodSecurity?: AccessLevel;
  };
  
  // Calculated scores (optional - from CountryScore)
  scores?: {
    poverty: number;
    economy: number;
    health: number;
    education: number;
    foodSecurity: number;
    overall: number;
  };
  
  // Recommended support areas
  recommendedSupport: SupportAreaType[] | string[];
  
  // Suggested NGOs
  suggestedNGOs?: {
    id: string;
    name: string;
    transparencyScore: number;
    focusArea?: SupportAreaType;
    focusAreas?: string[];
    donationLink: string;
    website?: string;
  }[];
  
  // Urgency level
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low' | 'stable';
  
  // Population
  population: number;
  
  // Other economic indicators
  gdpPerCapita?: number;
  unemploymentRate?: number;
}

// Regional economic data (legacy - for regional aggregation)
export interface RegionData {
  id: string;
  name: string;
  coordinates: [number, number];
  country: string;
  population: number;
  povertyRate: number; // Poverty rate (%)
  unemploymentRate: number; // Unemployment rate (%)
  gdpPerCapita: number; // GDP per capita (USD)
  issues: EconomicIssue[];
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low';
}

// Economic issue details
export interface EconomicIssue {
  type: EconomicIssueType;
  severity: number; // 1-10
  description: string;
  affectedPopulation: number;
  fundingNeeded: number; // USD
}

// Charity organization info
export interface CharityOrganization {
  id: string;
  name: string;
  description: string;
  transparencyScore: number; // 0-100
  rating: number; // 0-5
  focusAreas: EconomicIssueType[];
  website: string;
  donationLink: string;
  regions: string[]; // Active region IDs
  totalDonations: number; // USD
  impactMetrics: {
    peopleBenefited: number;
    projectsCompleted: number;
  };
  certifications: string[];
}

// Statistics data
export interface GlobalStats {
  totalPopulationInPoverty: number;
  averagePovertyRate: number;
  totalFundingNeeded: number;
  regionsInCrisis: number;
}

