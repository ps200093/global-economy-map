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
  // 추가 농업/식량 지표
  CEREAL_PRODUCTION: 'AG.PRD.CREL.MT', // 곡물 생산량 (메트릭톤)
  CEREAL_YIELD: 'AG.YLD.CREL.KG', // 곡물 수확량 (kg/헥타르)
  AGRICULTURAL_LAND: 'AG.LND.AGRI.ZS', // 농경지 비율 (% of land area)
  ARABLE_LAND: 'AG.LND.ARBL.ZS', // 경작지 비율
  IRRIGATED_LAND: 'AG.LND.IRIG.AG.ZS', // 관개 농지 비율
  FOOD_IMPORTS: 'TM.VAL.FOOD.ZS.UN', // 식량 수입 (% of merchandise imports)
  FOOD_EXPORTS: 'TX.VAL.FOOD.ZS.UN', // 식량 수출 (% of merchandise exports)
  ACCESS_TO_ELECTRICITY_RURAL: 'EG.ELC.ACCS.RU.ZS', // 농촌 전기 접근성
  IMPROVED_WATER_SOURCE: 'SH.H2O.SMDW.ZS', // 개선된 수자원 접근성
  RURAL_POPULATION: 'SP.RUR.TOTL.ZS', // 농촌 인구 비율
  // 추가 경제 지표
  GDP_TOTAL: 'NY.GDP.MKTP.CD', // 총 GDP (현재 USD)
  GNI_PER_CAPITA: 'NY.GNP.PCAP.CD', // 1인당 GNI (현재 USD)
  INFLATION: 'FP.CPI.TOTL.ZG', // 인플레이션율 (소비자물가 %)
  TRADE_PERCENT_GDP: 'NE.TRD.GNFS.ZS', // 무역 (% GDP)
  EXPORTS_PERCENT_GDP: 'NE.EXP.GNFS.ZS', // 수출 (% GDP)
  IMPORTS_PERCENT_GDP: 'NE.IMP.GNFS.ZS', // 수입 (% GDP)
  FDI_NET_INFLOWS: 'BX.KLT.DINV.WD.GD.ZS', // FDI 순유입 (% GDP)
  EXTERNAL_DEBT_PERCENT_GNI: 'DT.DOD.DECT.GN.ZS', // 외채 (% GNI)
  REMITTANCES_PERCENT_GDP: 'BX.TRF.PWKR.DT.GD.ZS', // 해외송금 수입 (% GDP)
  LABOR_FORCE_PARTICIPATION: 'SL.TLF.CACT.ZS', // 노동 참여율 (%)
  EMPLOYMENT_AGRICULTURE: 'SL.AGR.EMPL.ZS', // 농업 고용 비율 (%)
  EMPLOYMENT_INDUSTRY: 'SL.IND.EMPL.ZS', // 산업 고용 비율 (%)
  EMPLOYMENT_SERVICES: 'SL.SRV.EMPL.ZS', // 서비스업 고용 비율 (%)
  ACCESS_TO_ELECTRICITY: 'EG.ELC.ACCS.ZS', // 전기 접근성 (%)
  INTERNET_USERS: 'IT.NET.USER.ZS', // 인터넷 사용자 비율 (%)
  MOBILE_SUBSCRIPTIONS: 'IT.CEL.SETS.P2', // 모바일 구독 (100명당)
  // 보건/의료 지표
  INFANT_MORTALITY: 'SP.DYN.IMRT.IN', // 영아사망률 (1,000명당)
  UNDER5_MORTALITY: 'SH.DYN.MORT', // 5세 미만 사망률 (1,000명당)
  MATERNAL_MORTALITY: 'SH.STA.MMRT', // 모성 사망률 (10만 출생당)
  PHYSICIANS: 'SH.MED.PHYS.ZS', // 의사 수 (1,000명당)
  NURSES_MIDWIVES: 'SH.MED.NUMW.P3', // 간호사/조산사 (1,000명당)
  HOSPITAL_BEDS: 'SH.MED.BEDS.ZS', // 병상 수 (1,000명당)
  BIRTHS_ATTENDED: 'SH.STA.BRTC.ZS', // 숙련 의료진 참석 출산 (%)
  IMMUNIZATION_MEASLES: 'SH.IMM.MEAS', // 홍역 예방접종률 (%)
  IMMUNIZATION_DPT: 'SH.IMM.IDPT', // DPT 예방접종률 (%)
  HIV_PREVALENCE: 'SH.DYN.AIDS.ZS', // HIV 유병률 (15-49세 %)
  TUBERCULOSIS_INCIDENCE: 'SH.TBS.INCD', // 결핵 발생률 (10만명당)
  BASIC_SANITATION: 'SH.STA.SMSS.ZS', // 기본 위생시설 접근 (%)
  LOW_BIRTHWEIGHT: 'SH.STA.BRTW.ZS', // 저체중 출생 (%)
  ADOLESCENT_FERTILITY: 'SP.ADO.TFRT', // 청소년 출산율 (15-19세 1,000명당)
  OVERWEIGHT_ADULTS: 'SH.STA.OWGH.ZS', // 성인 과체중 비율 (%)
  NEONATAL_MORTALITY: 'SH.DYN.NMRT', // 신생아 사망률 (1,000명당)
  // 교육 지표
  PRIMARY_ENROLLMENT: 'SE.PRM.ENRR', // 초등학교 총 등록률 (%)
  SECONDARY_ENROLLMENT: 'SE.SEC.ENRR', // 중등학교 총 등록률 (%)
  TERTIARY_ENROLLMENT: 'SE.TER.ENRR', // 고등교육 총 등록률 (%)
  PRIMARY_COMPLETION: 'SE.PRM.CMPT.ZS', // 초등학교 수료율 (%)
  LOWER_SECONDARY_COMPLETION: 'SE.SEC.CMPT.LO.ZS', // 중학교 수료율 (%)
  UPPER_SECONDARY_COMPLETION: 'SE.SEC.CMPT.UP.ZS', // 고등학교 수료율 (%)
  OUT_OF_SCHOOL_PRIMARY: 'SE.PRM.UNER.ZS', // 학교 밖 아동 비율 (초등, %)
  OUT_OF_SCHOOL_SECONDARY: 'SE.SEC.UNER.ZS', // 학교 밖 청소년 비율 (중등, %)
  PUPIL_TEACHER_PRIMARY: 'SE.PRM.ENRL.TC.ZS', // 교사당 학생 수 (초등)
  PUPIL_TEACHER_SECONDARY: 'SE.SEC.ENRL.TC.ZS', // 교사당 학생 수 (중등)
  TRAINED_TEACHERS_PRIMARY: 'SE.PRM.TCAQ.ZS', // 자격있는 교사 비율 (초등, %)
  LITERACY_YOUTH: 'SE.ADT.1524.LT.ZS', // 청소년 문해율 (15-24세, %)
  LITERACY_FEMALE: 'SE.ADT.LITR.FE.ZS', // 여성 문해율 (%)
  LITERACY_MALE: 'SE.ADT.LITR.MA.ZS', // 남성 문해율 (%)
  SCHOOL_ENROLLMENT_PREPRIMARY: 'SE.PRE.ENRR', // 취학 전 교육 등록률 (%)
  GOVT_EXPENDITURE_EDUCATION: 'SE.XPD.TOTL.GB.ZS', // 정부지출 대비 교육비 (%)
  EXPECTED_YEARS_SCHOOLING: 'SE.SCH.LIFE', // 기대 교육 연수
  MEAN_YEARS_SCHOOLING: 'HD.HCI.EYRS', // 평균 교육 연수 (25세 이상)
  CHILDREN_OUT_OF_SCHOOL: 'SE.PRM.UNER', // 학교 밖 아동 수 (초등)
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
