// World Bank API 데이터 타입
export interface WorldBankIndicator {
  country: { id: string; value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
  indicator: { id: string; value: string };
}

// ACLED 데이터 타입
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

// UNHCR 데이터 타입
export interface UNHCRData {
  year: number;
  country_of_origin: string;
  country_of_asylum: string;
  refugees: number;
  asylum_seekers: number;
  idps: number;
}

// FEWS NET 데이터 타입
export interface FEWSData {
  country: string;
  region: string;
  ipc_phase: number; // 1-5 (1=minimal, 5=famine)
  population_affected: number;
  projected_period: string;
}

// FEWS NET 시장 가격 데이터
export interface FEWSMarketPrice {
  country: string;
  market: string;
  commodity: string; // 쌀, 밀, 옥수수, 콩 등
  currency: string;
  price: number;
  unit: string; // kg, lb, etc.
  date: string;
  price_change_percentage: number; // 전월 대비 변화율
}

// FEWS NET 작황 상태
export interface FEWSCropCondition {
  country: string;
  region: string;
  crop_type: string; // 쌀, 밀, 옥수수 등
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'failed';
  season: string;
  yield_estimate: number | null; // tons per hectare
  rainfall_status: 'above_normal' | 'normal' | 'below_normal';
  soil_moisture: 'adequate' | 'moderate' | 'deficit';
  date: string;
}

// FEWS NET 교역 및 공급 흐름
export interface FEWSTradeFlow {
  origin_country: string;
  destination_country: string;
  commodity: string;
  quantity: number; // metric tons
  trade_route: string;
  border_point: string;
  date: string;
  flow_status: 'normal' | 'restricted' | 'blocked';
  price_differential: number; // 가격 차이 (%)
}

// GDACS 재난 데이터 타입
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

// 통합된 지역 데이터 타입
export interface EnhancedRegionData {
  id: string;
  name: string;
  country: string;
  coordinates: [number, number];
  
  // 경제 지표
  economy: {
    gdpPerCapita: number | null;
    gdpGrowth: number | null;
    povertyRate: number | null;
    unemploymentRate: number | null;
    giniIndex: number | null;
  };
  
  // 사회 지표
  social: {
    population: number | null;
    lifeExpectancy: number | null;
    literacyRate: number | null;
    urbanPopulation: number | null;
  };
  
  // 교육 지표
  education: {
    expenditureGDPPercent: number | null;
    primaryEnrollment: number | null;
    secondaryEnrollment: number | null;
  };
  
  // 보건 지표
  health: {
    healthExpenditureGDPPercent: number | null;
    physiciansPer1000: number | null;
    hospitalBedsPer1000: number | null;
    maternalMortalityRate: number | null;
  };
  
  // 위기 상황
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
  
  // 카테고리 (필터링용)
  categories: CrisisCategory[];
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low';
  
  lastUpdated: string;
}

export type CrisisCategory = 
  | '전쟁/분쟁' 
  | '기아/식량부족' 
  | '빈곤' 
  | '교육' 
  | '보건/의료'
  | '난민'
  | '자연재해'
  | '환경';

// 기부 단체 재무 분석 타입
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
  
  // 효율성 지표
  metrics: {
    programExpenseRatio: number; // 프로그램비 비율
    administrativeExpenseRatio: number; // 관리비 비율
    fundraisingExpenseRatio: number; // 모금비 비율
    workingCapitalRatio: number; // 운영자본 비율
    revenueGrowth: number; // 전년 대비 수익 성장률
  };
}

export interface EnhancedCharityOrganization {
  id: string;
  ein?: string; // IRS EIN (미국 단체만)
  name: string;
  description: string;
  
  // 기존 필드
  transparencyScore: number;
  rating: number;
  focusAreas: CrisisCategory[];
  website: string;
  donationLink: string;
  
  // 활동 지역 (좌표 포함)
  regions: {
    id: string;
    name: string;
    coordinates: [number, number];
  }[];
  
  // 재무 정보
  financials?: CharityFinancials;
  
  // 영향력
  impactMetrics: {
    peopleBenefited: number;
    projectsCompleted: number;
    countriesActive: number;
  };
  
  certifications: string[];
  foundedYear: number;
  
  lastUpdated: string;
}

