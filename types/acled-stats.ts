/**
 * ACLED 통계 데이터 타입 정의
 */

/**
 * 연도별 통계 데이터
 */
export interface ACLEDYearlyStats {
  _id?: string;
  country: string;
  iso3?: string; // ISO 3166-1 alpha-3 코드
  year: number;
  
  // 통계 종류별 데이터
  demonstrations?: number; // 시위 이벤트 수
  civilianTargetingEvents?: number; // 민간인 대상 이벤트 수
  civilianFatalities?: number; // 민간인 사망자 수
  totalFatalities?: number; // 총 사망자 수
  politicalViolenceEvents?: number; // 정치 폭력 이벤트 수
  
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 월별 통계 데이터
 */
export interface ACLEDMonthlyStats {
  _id?: string;
  country: string;
  iso3?: string; // ISO 3166-1 alpha-3 코드
  month: string; // January, February, ...
  monthNumber: number; // 1-12
  year: number;
  
  politicalViolenceEvents: number;
  
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Excel 통계 파일 행 타입
 */
export interface ACLEDStatsExcelRow {
  COUNTRY?: string;
  YEAR?: number;
  MONTH?: string;
  EVENTS?: number;
  FATALITIES?: number;
}

/**
 * 통계 파일 타입
 */
export type ACLEDStatsFileType = 
  | 'demonstrations'
  | 'civilian_targeting'
  | 'civilian_fatalities'
  | 'total_fatalities'
  | 'political_violence_monthly'
  | 'political_violence_yearly';

/**
 * 월 이름 → 숫자 매핑
 */
export const MONTH_MAP: Record<string, number> = {
  'January': 1,
  'February': 2,
  'March': 3,
  'April': 4,
  'May': 5,
  'June': 6,
  'July': 7,
  'August': 8,
  'September': 9,
  'October': 10,
  'November': 11,
  'December': 12,
};

