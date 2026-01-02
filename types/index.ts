// 경제 이슈 타입
export type EconomicIssueType = 
  | '빈곤' 
  | '실업' 
  | '식량 부족' 
  | '교육' 
  | '보건' 
  | '인프라' 
  | '환경';

// 지원 분야 타입
export type SupportAreaType = 
  | 'Clean Water Infrastructure'
  | 'Education Programs'
  | 'Healthcare Services'
  | 'Food Security'
  | 'Economic Development'
  | 'Emergency Relief';

// 접근성 레벨
export type AccessLevel = 'High' | 'Medium' | 'Low' | 'Critical';

// 국가 데이터 (새 구조)
export interface CountryData {
  id: string;
  name: string;
  nameKo: string; // 한국어 이름
  iso3: string; // ISO 3166-1 alpha-3 코드
  coordinates: [number, number]; // [위도, 경도]
  
  // 주요 지표 - CountryScore의 indicators와 호환
  indicators: {
    poverty?: number; // 빈곤율 (%) - povertyRate에서 변환됨
    povertyRate?: number; // MongoDB의 원본 필드명
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
    // UI 표시용 (선택적)
    educationAccess?: AccessLevel;
    waterStability?: AccessLevel;
    healthcareAccess?: AccessLevel;
    foodSecurity?: AccessLevel;
  };
  
  // 추천 지원 분야
  recommendedSupport: SupportAreaType[] | string[];
  
  // 추천 NGO
  suggestedNGOs?: {
    id: string;
    name: string;
    transparencyScore: number;
    focusArea?: SupportAreaType;
    donationLink: string;
  }[];
  
  // 긴급도
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low' | 'stable';
  
  // 인구
  population: number;
  
  // 기타 경제 지표
  gdpPerCapita?: number;
  unemploymentRate?: number;
}

// 지역 경제 데이터 (기존 - 지역별 집계용)
export interface RegionData {
  id: string;
  name: string;
  coordinates: [number, number];
  country: string;
  population: number;
  povertyRate: number; // 빈곤율 (%)
  unemploymentRate: number; // 실업률 (%)
  gdpPerCapita: number; // 1인당 GDP (USD)
  issues: EconomicIssue[];
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low';
}

// 경제 이슈 상세
export interface EconomicIssue {
  type: EconomicIssueType;
  severity: number; // 1-10
  description: string;
  affectedPopulation: number;
  fundingNeeded: number; // USD
}

// 기부 단체 정보
export interface CharityOrganization {
  id: string;
  name: string;
  description: string;
  transparencyScore: number; // 0-100
  rating: number; // 0-5
  focusAreas: EconomicIssueType[];
  website: string;
  donationLink: string;
  regions: string[]; // 활동 지역 ID
  totalDonations: number; // USD
  impactMetrics: {
    peopleBenefited: number;
    projectsCompleted: number;
  };
  certifications: string[];
}

// 통계 데이터
export interface GlobalStats {
  totalPopulationInPoverty: number;
  averagePovertyRate: number;
  totalFundingNeeded: number;
  regionsInCrisis: number;
}

