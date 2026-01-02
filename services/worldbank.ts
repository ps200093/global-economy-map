// World Bank API 서비스
import { WorldBankIndicator } from '@/types/api';

const BASE_URL = 'https://api.worldbank.org/v2';

// Indicator 코드를 상수로 정의 (as const로 타입 안정성 확보)
export const WB_INDICATORS = {
  GDP_PER_CAPITA: 'NY.GDP.PCAP.CD',
  GDP_GROWTH: 'NY.GDP.MKTP.KD.ZG',
  POVERTY_RATE: 'SI.POV.DDAY',
  UNEMPLOYMENT: 'SL.UEM.TOTL.ZS',
  GINI_INDEX: 'SI.POV.GINI',
  LIFE_EXPECTANCY: 'SP.DYN.LE00.IN',
  LITERACY_RATE: 'SE.ADT.LITR.ZS',
  HEALTH_EXPENDITURE: 'SH.XPD.CHEX.GD.ZS',
  EDUCATION_EXPENDITURE: 'SE.XPD.TOTL.GD.ZS',
  POPULATION: 'SP.POP.TOTL',
  URBAN_POPULATION: 'SP.URB.TOTL.IN.ZS',
  // 식량/영양 안보 지표
  MALNUTRITION: 'SN.ITK.DEFC.ZS',
  STUNTING: 'SH.STA.STNT.ZS',
  WASTING: 'SH.STA.WAST.ZS',
  FOOD_PRODUCTION: 'AG.PRD.FOOD.XD',
} as const;

export type WorldBankIndicatorCode = typeof WB_INDICATORS[keyof typeof WB_INDICATORS];

/**
 * World Bank API에서 특정 국가의 지표 데이터를 가져옵니다
 * MRV(Most Recent Value) 방식 사용으로 최신 데이터만 가져옵니다
 */
export async function getWorldBankIndicator(
  countryCode: string,
  indicatorCode: string,
  startYear?: number,
  endYear?: number
): Promise<WorldBankIndicator[]> {
  // URLSearchParams로 조건부 파라미터 처리
  const params = new URLSearchParams({
    format: 'json',
    per_page: '100',
  });

  // 연도 범위가 지정된 경우
  if (startYear && endYear) {
    params.set('date', `${startYear}:${endYear}`);
  } else {
    // MRV(Most Recent Value) 사용 - 최신 5년 데이터 중 가장 최근 값
    params.set('mrv', '5');
  }

  const url = `${BASE_URL}/country/${countryCode}/indicator/${indicatorCode}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 86400 }, // 24시간 캐시
    });

    if (!response.ok) {
      throw new Error(`World Bank API error: ${response.status}`);
    }

    const data = await response.json();
    
    // World Bank API는 [metadata, data] 형식으로 반환
    if (Array.isArray(data) && data.length > 1) {
      return data[1] || [];
    }

    return [];
  } catch (error) {
    console.error(`Error fetching World Bank data for ${countryCode}/${indicatorCode}:`, error);
    return [];
  }
}

/**
 * 여러 지표를 한 번에 가져와서 최신 값을 반환합니다
 */
export async function getMultipleIndicators(
  countryCode: string,
  indicators: readonly string[]
): Promise<Record<string, number | null>> {
  const results: Record<string, number | null> = {};

  await Promise.all(
    indicators.map(async (indicator) => {
      const data = await getWorldBankIndicator(countryCode, indicator);
      
      // MRV로 받았기 때문에 이미 최신순으로 정렬되어 있음
      // null이 아닌 첫 번째 값을 사용
      const latestData = data.find((d) => d.value !== null);
      results[indicator] = latestData?.value ?? null;
    })
  );

  return results;
}

/**
 * 국가 목록을 가져옵니다
 */
export async function getCountries(): Promise<any[]> {
  const params = new URLSearchParams({
    format: 'json',
    per_page: '300', // 국가 목록은 300개면 충분
  });

  const url = `${BASE_URL}/country?${params.toString()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 2592000 }, // 30일 캐시 (국가 목록은 거의 변경 없음)
    });

    if (!response.ok) {
      throw new Error(`World Bank API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 1) {
      return data[1] || [];
    }

    return [];
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

/**
 * 지역/집계 그룹의 데이터를 가져옵니다
 * World Bank는 SSF, SAS 등의 지역 코드를 country 엔드포인트에서 지원합니다
 */
export async function getRegionalAggregates(
  regionCode: string,
  indicatorCode: string
): Promise<number | null> {
  // 지역 코드 유효성 확인 (World Bank의 주요 지역 집계 코드)
  const VALID_REGION_CODES = [
    'SSF', // Sub-Saharan Africa
    'SAS', // South Asia
    'EAS', // East Asia & Pacific
    'ECS', // Europe & Central Asia
    'LCN', // Latin America & Caribbean
    'MNA', // Middle East & North Africa
    'NAC', // North America
    'WLD', // World
  ];

  if (!VALID_REGION_CODES.includes(regionCode)) {
    console.warn(`Invalid region code: ${regionCode}. Using as country code instead.`);
  }

  // 지역 코드도 country 엔드포인트로 조회 가능
  const data = await getWorldBankIndicator(regionCode, indicatorCode);
  const latestData = data.find((d) => d.value !== null);
  return latestData?.value ?? null;
}
