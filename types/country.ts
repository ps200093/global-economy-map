// MongoDB용 국가 데이터 스키마

export interface CountryScore {
  // 기본 정보
  iso3: string; // ISO 3166-1 alpha-3 코드
  name: string; // 영문 이름
  nameKo: string; // 한글 이름
  region: string; // 지역 (e.g., "Sub-Saharan Africa")
  coordinates: [number, number]; // [위도, 경도]
  
  // 원본 지표 데이터
  indicators: {
    // 빈곤 지표
    povertyRate?: number; // 빈곤율 (%)
    giniIndex?: number; // 지니계수 (0-100)
    
    // 경제 지표
    gdpPerCapita?: number; // 1인당 GDP (USD)
    unemploymentRate?: number; // 실업률 (%)
    
    // 보건/영양 지표
    lifeExpectancy?: number; // 기대수명 (년)
    malnutritionRate?: number; // 영양부족률 (%)
    stuntingRate?: number; // 발육부진률 (%)
    healthExpenditure?: number; // 보건 지출 (% of GDP)
    
    // 교육 지표
    literacyRate?: number; // 문해율 (%)
    educationExpenditure?: number; // 교육 지출 (% of GDP)
    
    // 식량 안보
    foodProductionIndex?: number; // 식량 생산 지수
    
    // 인구
    population?: number;
  };
  
  // 계산된 점수
  scores: {
    poverty: number; // 빈곤 점수 (0-100)
    economy: number; // 경제 점수 (0-100)
    health: number; // 보건 점수 (0-100)
    education: number; // 교육 점수 (0-100)
    foodSecurity: number; // 식량 안보 점수 (0-100)
    overall: number; // 종합 점수 (0-100, 가중 평균)
  };
  
  // 긴급도 레벨 (종합 점수 기반)
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low' | 'stable';
  
  // 마커 색상 (긴급도 기반)
  markerColor: string; // hex color code
  
  // 접근성 레벨 (UI 표시용)
  accessLevels: {
    education: 'Critical' | 'Low' | 'Medium' | 'High';
    water: 'Critical' | 'Low' | 'Medium' | 'High';
    healthcare: 'Critical' | 'Low' | 'Medium' | 'High';
    foodSecurity: 'Critical' | 'Low' | 'Medium' | 'High';
  };
  
  // 추천 지원 분야 (점수 기반 자동 계산)
  recommendedSupport: string[];
  
  // 추천 NGO
  suggestedNGOs?: {
    id: string;
    name: string;
    transparencyScore: number;
    focusArea?: string;
    donationLink: string;
  }[];
  
  // 데이터 메타
  dataQuality: number; // 데이터 품질 점수 (0-100, 사용 가능한 지표 비율)
  lastUpdated: Date; // 마지막 업데이트 시간
  source: string; // 데이터 출처
}

// 국가 목록 (ISO3 코드 + 좌표)
export interface CountryBasicInfo {
  iso3: string;
  name: string;
  nameKo: string;
  region: string;
  coordinates: [number, number];
}

// 점수 계산 가중치
export const SCORE_WEIGHTS = {
  poverty: 0.40, // 40%
  economy: 0.20, // 20%
  health: 0.20, // 20%
  education: 0.10, // 10%
  foodSecurity: 0.10, // 10%
} as const;

// 긴급도 임계값
export const URGENCY_THRESHOLDS = {
  critical: 90, // >= 90점
  high: 70, // 70-89점
  medium: 50, // 50-69점
  low: 30, // 30-49점
  stable: 0, // < 30점
} as const;

// 마커 색상
export const MARKER_COLORS = {
  critical: '#DC2626', // red-600
  high: '#EA580C', // orange-600
  medium: '#EAB308', // yellow-500
  low: '#16A34A', // green-600
  stable: '#9CA3AF', // gray-400
} as const;

