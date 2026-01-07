// ACLED (Armed Conflict Location & Event Data) 타입 정의

/**
 * ACLED 주간 집계 데이터 (MongoDB 저장용)
 */
export interface ACLEDEventDocument {
  _id?: string;
  
  // 시간 정보
  week: number; // Excel week number
  weekStart: string; // YYYY-MM-DD (주의 시작일)
  weekEnd: string; // YYYY-MM-DD (주의 종료일)
  year: number;
  month: number;
  
  // 위치 정보
  region: string; // ACLED region (e.g., 'Northern Africa')
  country: string;
  admin1: string; // 1차 행정구역
  iso3?: string; // ISO 3166-1 alpha-3 코드
  latitude: number; // 중심 좌표
  longitude: number;
  
  // 이벤트 정보
  event_type: string; // Battles, Protests, etc.
  sub_event_type: string; // Armed clash, Peaceful protest, etc.
  disorder_type: string; // Political violence, Demonstrations, etc.
   
  // 통계
  events: number; // 해당 주의 이벤트 수
  fatalities: number; // 해당 주의 사망자 수
  population_exposure?: number; // 영향받은 인구
  
  // 메타데이터
  acled_id: number; // ACLED의 원본 ID
  regionKey: string; // 파일 지역 키 (africa, asia, etc.)
  
  // 인덱싱용
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * ACLED 통계 (국가별, 월별 집계)
 */
export interface ACLEDCountryStats {
  _id?: string;
  country: string;
  iso3: string;
  year: number;
  month?: number; // 월별 통계인 경우
  
  // 이벤트 카운트
  totalEvents: number;
  eventsByType: {
    battles?: number;
    violenceAgainstCivilians?: number;
    explosions?: number;
    protests?: number;
    riots?: number;
    strategicDevelopments?: number;
  };
  
  // 사상자
  totalFatalities: number;
  civilianFatalities: number;
  
  // 위치 정보 (중심점)
  centerLocation?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  
  // 최근 이벤트
  recentEvents?: string[]; // event_id_cnty 배열
  
  // 메타데이터
  lastUpdated: Date;
}

/**
 * ACLED 쿼리 파라미터
 */
export interface ACLEDQueryParams {
  country?: string;
  iso3?: string;
  region?: string;
  eventType?: string | string[];
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  minFatalities?: number;
  maxFatalities?: number;
  bbox?: [number, number, number, number]; // [west, south, east, north]
  limit?: number;
  offset?: number;
  sortBy?: 'date' | 'fatalities';
  sortOrder?: 'asc' | 'desc';
}

/**
 * ACLED 집계 결과
 */
export interface ACLEDAggregation {
  country: string;
  totalEvents: number;
  totalFatalities: number;
  eventTypes: Record<string, number>;
  dateRange: {
    start: string;
    end: string;
  };
}

/**
 * Excel 원본 데이터 (파싱용) - ACLED Aggregated Data
 */
export interface ACLEDExcelRow {
  // Excel에서 읽은 원본 필드명들
  [key: string]: any;
  
  // ACLED Aggregated Data 필드
  WEEK?: number | string; // Excel 날짜 시리얼
  REGION?: string;
  COUNTRY?: string;
  ADMIN1?: string;
  EVENT_TYPE?: string;
  SUB_EVENT_TYPE?: string;
  EVENTS?: number; // 해당 주의 이벤트 수
  FATALITIES?: number;
  POPULATION_EXPOSURE?: number;
  DISORDER_TYPE?: string;
  ID?: number;
  CENTROID_LATITUDE?: number;
  CENTROID_LONGITUDE?: number;
}

/**
 * 이벤트 타입 매핑
 */
export const ACLED_EVENT_TYPES = {
  BATTLES: 'Battles',
  VIOLENCE_AGAINST_CIVILIANS: 'Violence against civilians',
  EXPLOSIONS: 'Explosions/Remote violence',
  PROTESTS: 'Protests',
  RIOTS: 'Riots',
  STRATEGIC_DEVELOPMENTS: 'Strategic developments',
} as const;

/**
 * 이벤트 타입을 DB 필드명으로 변환
 */
export function normalizeEventType(eventType: string): string {
  return eventType
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Excel 날짜를 ISO 형식으로 변환
 */
export function parseExcelDate(date: any): string {
  if (typeof date === 'string') {
    return date.split('T')[0]; // ISO 형식이면 날짜만 추출
  }
  
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  
  // Excel 날짜 시리얼 번호 (1900년 1월 1일부터의 일수)
  if (typeof date === 'number') {
    const excelEpoch = new Date(1899, 11, 30);
    const jsDate = new Date(excelEpoch.getTime() + date * 86400000);
    return jsDate.toISOString().split('T')[0];
  }
  
  return '';
}



