import { CountryData } from '@/types';

// API Data Types
export interface FoodSecurityAPIData {
  production: {
    cerealProduction: { value: number | null; year: string | null };
    cerealYield: { value: number | null; year: string | null };
    foodProductionIndex: { value: number | null; year: string | null };
  };
  land: {
    agriculturalLand: { value: number | null; year: string | null };
    arableLand: { value: number | null; year: string | null };
    irrigatedLand: { value: number | null; year: string | null };
  };
  trade: {
    foodImports: { value: number | null; year: string | null };
    foodExports: { value: number | null; year: string | null };
  };
  infrastructure: {
    improvedWaterSource: { value: number | null; year: string | null };
    ruralPopulation: { value: number | null; year: string | null };
  };
  nutrition: {
    malnutrition: { value: number | null; year: string | null };
    stunting: { value: number | null; year: string | null };
  };
}

export interface ConflictAPIData {
  summary: {
    country: string;
    iso3: string;
    latestYear: number;
    totalEvents: number;
    totalFatalities: number;
    civilianFatalities: number;
    demonstrations: number;
  };
  eventTypeBreakdown: {
    battles: number;
    violenceAgainstCivilians: number;
    protests: number;
    riots: number;
    explosions: number;
    strategicDevelopments: number;
  } | null;
  trend: {
    years: number[];
    politicalViolence: number[];
    totalFatalities: number[];
    civilianFatalities: number[];
    demonstrations: number[];
  };
  yearlyStats: Array<{
    year: number;
    politicalViolence: number;
    fatalities: number;
    civilianFatalities: number;
    demonstrations: number;
    civilianTargeting: number;
  }>;
  recentEvents: Array<{
    date: string;
    type: string;
    subType: string;
    fatalities: number;
    location: string;
    notes: string;
  }>;
}

export interface RefugeeAPIData {
  summary: {
    year: number;
    refugeesOriginating: number;
    refugeesAsylum: number;
    idps: number;
    returnedRefugees: number;
    returnedIDPs: number;
    asylumSeekers: number;
    stateless: number;
    ooc: number;
    totalDisplaced: number;
  };
  globalStats: {
    refugees: number;
    asylumSeekers: number;
    idps: number;
    stateless: number;
  };
  topDestinations: Array<{
    country: string;
    count: number;
  }>;
  topOrigins: Array<{
    country: string;
    count: number;
  }>;
  hasData: boolean;
}

// Economy API Data Type
export interface EconomyAPIData {
  gdp: {
    total: { value: number | null; year: string | null };
    perCapita: { value: number | null; year: string | null };
    growth: { value: number | null; year: string | null };
    growthTrend: Array<{ year: number; value: number }>;
  };
  income: {
    gniPerCapita: { value: number | null; year: string | null };
    giniIndex: { value: number | null; year: string | null };
    remittances: { value: number | null; year: string | null };
  };
  labor: {
    unemployment: { value: number | null; year: string | null };
    laborParticipation: { value: number | null; year: string | null };
    employmentBySection: {
      agriculture: { value: number | null; year: string | null };
      industry: { value: number | null; year: string | null };
      services: { value: number | null; year: string | null };
    };
  };
  trade: {
    tradePercentGdp: { value: number | null; year: string | null };
    exports: { value: number | null; year: string | null };
    imports: { value: number | null; year: string | null };
    fdiNetInflows: { value: number | null; year: string | null };
  };
  finance: {
    inflation: { value: number | null; year: string | null };
    inflationTrend: Array<{ year: number; value: number }>;
    externalDebt: { value: number | null; year: string | null };
  };
  infrastructure: {
    accessElectricity: { value: number | null; year: string | null };
    internetUsers: { value: number | null; year: string | null };
    mobileSubscriptions: { value: number | null; year: string | null };
    urbanPopulation: { value: number | null; year: string | null };
  };
}

// Common Props Types
export interface TabProps {
  country: CountryData;
}

export interface FoodTabProps extends TabProps {
  foodSecurityData: FoodSecurityAPIData | null;
  loading: boolean;
}

export interface ConflictTabProps extends TabProps {
  conflictData: ConflictAPIData | null;
  loading: boolean;
}

export interface RefugeeTabProps extends TabProps {
  refugeeData: RefugeeAPIData | null;
  loading: boolean;
}

export interface EconomyTabProps extends TabProps {
  economyData: EconomyAPIData | null;
  loading: boolean;
}

// Health API Data Type
export interface HealthAPIData {
  lifeExpectancy: {
    current: { value: number | null; year: string | null };
    trend: Array<{ year: number; value: number }>;
  };
  mortality: {
    infant: { value: number | null; year: string | null };
    under5: { value: number | null; year: string | null };
    neonatal: { value: number | null; year: string | null };
    maternal: { value: number | null; year: string | null };
  };
  infrastructure: {
    physicians: { value: number | null; year: string | null };
    nursesMidwives: { value: number | null; year: string | null };
    hospitalBeds: { value: number | null; year: string | null };
    birthsAttended: { value: number | null; year: string | null };
  };
  immunization: {
    measles: { value: number | null; year: string | null };
    dpt: { value: number | null; year: string | null };
  };
  diseases: {
    hivPrevalence: { value: number | null; year: string | null };
    tuberculosis: { value: number | null; year: string | null };
  };
  nutrition: {
    malnutrition: { value: number | null; year: string | null };
    stunting: { value: number | null; year: string | null };
    wasting: { value: number | null; year: string | null };
    lowBirthweight: { value: number | null; year: string | null };
    overweight: { value: number | null; year: string | null };
  };
  sanitation: {
    basicSanitation: { value: number | null; year: string | null };
    improvedWater: { value: number | null; year: string | null };
  };
  expenditure: {
    healthExpenditure: { value: number | null; year: string | null };
  };
  reproductive: {
    adolescentFertility: { value: number | null; year: string | null };
  };
}

export interface HealthTabProps extends TabProps {
  healthData: HealthAPIData | null;
  loading: boolean;
}

// Education API Data Type
export interface EducationAPIData {
  literacy: {
    overall: { value: number | null; year: string | null };
    youth: { value: number | null; year: string | null };
    female: { value: number | null; year: string | null };
    male: { value: number | null; year: string | null };
    trend: Array<{ year: number; value: number }>;
  };
  enrollment: {
    preprimary: { value: number | null; year: string | null };
    primary: { value: number | null; year: string | null };
    secondary: { value: number | null; year: string | null };
    tertiary: { value: number | null; year: string | null };
  };
  completion: {
    primary: { value: number | null; year: string | null };
    lowerSecondary: { value: number | null; year: string | null };
    upperSecondary: { value: number | null; year: string | null };
  };
  outOfSchool: {
    primary: { value: number | null; year: string | null };
    secondary: { value: number | null; year: string | null };
    childrenCount: { value: number | null; year: string | null };
  };
  quality: {
    pupilTeacherPrimary: { value: number | null; year: string | null };
    pupilTeacherSecondary: { value: number | null; year: string | null };
    trainedTeachers: { value: number | null; year: string | null };
  };
  expenditure: {
    percentGdp: { value: number | null; year: string | null };
    percentGovt: { value: number | null; year: string | null };
  };
  outcomes: {
    expectedYearsSchooling: { value: number | null; year: string | null };
  };
}

export interface EducationTabProps extends TabProps {
  educationData: EducationAPIData | null;
  loading: boolean;
}

// Constants
export const urgencyLabels: Record<string, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  stable: 'Stable'
};

export const accessLevelLabels: Record<string, string> = {
  Critical: 'Critical',
  Low: 'Low',
  Medium: 'Medium',
  High: 'High'
};
