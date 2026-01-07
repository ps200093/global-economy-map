// MongoDB country data schema

export interface CountryScore {
  // Basic information
  iso3: string; // ISO 3166-1 alpha-3 code
  name: string; // English name
  nameKo: string; // Korean name
  region: string; // Region (e.g., "Sub-Saharan Africa")
  coordinates: [number, number]; // [latitude, longitude]
  
  // Raw indicator data
  indicators: {
    // Poverty indicators
    povertyRate?: number; // Poverty rate (%)
    giniIndex?: number; // Gini coefficient (0-100)
    
    // Economic indicators
    gdpPerCapita?: number; // GDP per capita (USD)
    unemploymentRate?: number; // Unemployment rate (%)
    
    // Health/Nutrition indicators
    lifeExpectancy?: number; // Life expectancy (years)
    malnutritionRate?: number; // Malnutrition rate (%)
    stuntingRate?: number; // Stunting rate (%)
    healthExpenditure?: number; // Health expenditure (% of GDP)
    
    // Education indicators
    literacyRate?: number; // Literacy rate (%)
    educationExpenditure?: number; // Education expenditure (% of GDP)
    
    // Food security
    foodProductionIndex?: number; // Food production index
    
    // Population
    population?: number;
  };
  
  // Calculated scores
  scores: {
    poverty: number; // Poverty score (0-100)
    economy: number; // Economy score (0-100)
    health: number; // Health score (0-100)
    education: number; // Education score (0-100)
    foodSecurity: number; // Food security score (0-100)
    overall: number; // Overall score (0-100, weighted average)
  };
  
  // Urgency level (based on overall score)
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low' | 'stable';
  
  // Marker color (based on urgency)
  markerColor: string; // hex color code
  
  // Access levels (for UI display)
  accessLevels: {
    education: 'Critical' | 'Low' | 'Medium' | 'High';
    water: 'Critical' | 'Low' | 'Medium' | 'High';
    healthcare: 'Critical' | 'Low' | 'Medium' | 'High';
    foodSecurity: 'Critical' | 'Low' | 'Medium' | 'High';
  };
  
  // Recommended support areas (auto-calculated based on scores)
  recommendedSupport: string[];
  
  // Suggested NGOs
  suggestedNGOs?: {
    id: string;
    name: string;
    transparencyScore: number;
    focusArea?: string;
    focusAreas?: string[];
    donationLink: string;
    website?: string;
  }[];
  
  // Data metadata
  dataQuality: number; // Data quality score (0-100, ratio of available indicators)
  lastUpdated: Date; // Last update time
  source: string; // Data source
}

// Country list (ISO3 code + coordinates)
export interface CountryBasicInfo {
  iso3: string;
  name: string;
  nameKo: string;
  region: string;
  coordinates: [number, number];
}

// Score calculation weights
export const SCORE_WEIGHTS = {
  poverty: 0.40, // 40%
  economy: 0.20, // 20%
  health: 0.20, // 20%
  education: 0.10, // 10%
  foodSecurity: 0.10, // 10%
} as const;

// Urgency thresholds
export const URGENCY_THRESHOLDS = {
  critical: 90, // >= 90 points
  high: 70, // 70-89 points
  medium: 50, // 50-69 points
  low: 30, // 30-49 points
  stable: 0, // < 30 points
} as const;

// 마커 색상
export const MARKER_COLORS = {
  critical: '#DC2626', // red-600
  high: '#EA580C', // orange-600
  medium: '#EAB308', // yellow-500
  low: '#16A34A', // green-600
  stable: '#9CA3AF', // gray-400
} as const;

