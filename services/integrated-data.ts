// 통합 데이터 서비스 - 모든 API를 하나로 연결
import { EnhancedRegionData, CrisisCategory } from '@/types/api';
import { 
  getMultipleIndicators, 
  WB_INDICATORS 
} from './worldbank';
import { getRefugeeData } from './unhcr';

// 국가 코드 매핑 (지역 ID -> ISO3 코드)
const COUNTRY_CODES: Record<string, string> = {
  'sub-saharan-africa': 'SSF', // Sub-Saharan Africa (region)
  'south-asia': 'SAS', // South Asia (region)
  'southeast-asia': 'EAS', // East Asia & Pacific (region)
  'central-america': 'LCN', // Latin America & Caribbean (region)
  'middle-east': 'MNA', // Middle East & North Africa (region)
  'eastern-europe': 'ECS', // Europe & Central Asia (region)
  'pacific-islands': 'EAP', // East Asia & Pacific (region)
};

// 대표 국가 (지역별 데이터 수집용)
const REPRESENTATIVE_COUNTRIES: Record<string, string[]> = {
  'sub-saharan-africa': ['NGA', 'ETH', 'COD', 'TZA', 'KEN', 'UGA', 'SDN', 'SOM'],
  'south-asia': ['IND', 'PAK', 'BGD', 'AFG', 'NPL'],
  'southeast-asia': ['IDN', 'PHL', 'VNM', 'THA', 'MMR'],
  'central-america': ['GTM', 'HND', 'NIC', 'SLV', 'HTI'],
  'middle-east': ['YEM', 'SYR', 'IRQ', 'PSE', 'JOR'],
  'eastern-europe': ['UKR', 'MDA', 'GEO', 'ARM'],
  'pacific-islands': ['PNG', 'FJI', 'SLB', 'VUT'],
};

/**
 * 지역의 통합 데이터를 가져옵니다
 */
export async function getEnhancedRegionData(regionId: string): Promise<EnhancedRegionData | null> {
  try {
    const countryCode = COUNTRY_CODES[regionId];
    const representativeCountries = REPRESENTATIVE_COUNTRIES[regionId] || [];

    if (!countryCode) {
      console.warn(`No country code found for region: ${regionId}`);
      return null;
    }

    // World Bank 데이터 가져오기 (식량 안보 지표 포함)
    const wbData = await getMultipleIndicators(countryCode, [
      WB_INDICATORS.GDP_PER_CAPITA,
      WB_INDICATORS.GDP_GROWTH,
      WB_INDICATORS.POVERTY_RATE,
      WB_INDICATORS.UNEMPLOYMENT,
      WB_INDICATORS.GINI_INDEX,
      WB_INDICATORS.LIFE_EXPECTANCY,
      WB_INDICATORS.LITERACY_RATE,
      WB_INDICATORS.HEALTH_EXPENDITURE,
      WB_INDICATORS.EDUCATION_EXPENDITURE,
      WB_INDICATORS.POPULATION,
      WB_INDICATORS.URBAN_POPULATION,
      WB_INDICATORS.MALNUTRITION,      // 영양부족 비율
      WB_INDICATORS.STUNTING,          // 발육부진
      WB_INDICATORS.FOOD_PRODUCTION,   // 식량 생산 지수
    ]);

    // World Bank 데이터로 식량 안보 판단
    const malnutritionRate = wbData[WB_INDICATORS.MALNUTRITION];
    let ipcPhase = 1;
    
    if (malnutritionRate) {
      if (malnutritionRate >= 35) ipcPhase = 5;
      else if (malnutritionRate >= 25) ipcPhase = 4;
      else if (malnutritionRate >= 15) ipcPhase = 3;
      else if (malnutritionRate >= 8) ipcPhase = 2;
      else ipcPhase = 1;
    }

    const foodInsecurity = malnutritionRate ? {
      country: countryCode,
      region: getRegionName(regionId),
      ipc_phase: ipcPhase,
      population_affected: 0,
      projected_period: new Date().toISOString().split('T')[0],
    } : null;

    // 위기 데이터 수집 (대표 국가들에서)
    const conflicts: any[] = [];
    const disasters: any[] = [];
    const refugeeStats = { origin: 0, asylum: 0, idps: 0 };

    // 병렬로 모든 데이터 수집 (속도 개선을 위해 1개 국가만)
    for (const country of representativeCountries.slice(0, 1)) {
      // 첫 1개 국가만
      try {
        // 분쟁 데이터 (현재 비활성화 - 로딩 시간 11초 소요)
        // const endDate = new Date();
        // const startDate = new Date();
        // startDate.setFullYear(startDate.getFullYear() - 1);
        // const countryConflicts = await getConflictData(
        //   country,
        //   startDate.toISOString().split('T')[0],
        //   endDate.toISOString().split('T')[0]
        // );
        // conflicts.push(...countryConflicts);

        // 재난 데이터 (현재 비활성화 - 빠르지만 필수는 아님)
        // const countryDisasters = await getDisasterAlerts(country);
        // disasters.push(...countryDisasters);

        // 난민 데이터 (UNHCR는 이제 정상 작동)
        const countryRefugeeData = await getRefugeeData(country);
        if (countryRefugeeData && countryRefugeeData.length > 0) {
          countryRefugeeData.forEach(record => {
            if (record.country_of_origin === country) {
              refugeeStats.origin += record.refugees || 0;
              refugeeStats.idps += record.idps || 0;
            }
            if (record.country_of_asylum === country) {
              refugeeStats.asylum += record.refugees || 0;
            }
          });
        }
      } catch (error) {
        console.error(`Error fetching crisis data for ${country}:`, error);
        // 에러 발생 시 해당 국가 데이터만 스킵하고 계속 진행
      }
    }

    // 카테고리 결정
    const categories = determineCategories({
      conflicts,
      disasters,
      foodInsecurity,
      refugeeStats,
      povertyRate: wbData[WB_INDICATORS.POVERTY_RATE],
      healthExpenditure: wbData[WB_INDICATORS.HEALTH_EXPENDITURE],
      educationExpenditure: wbData[WB_INDICATORS.EDUCATION_EXPENDITURE],
      malnutritionRate: wbData[WB_INDICATORS.MALNUTRITION],
    });

    // 긴급도 레벨 결정
    const urgencyLevel = determineUrgencyLevel({
      conflicts: conflicts.length,
      disasters: disasters.length,
      ipcPhase: foodInsecurity?.ipc_phase || 0,
      refugees: refugeeStats.origin,
      povertyRate: wbData[WB_INDICATORS.POVERTY_RATE] || 0,
    });

    const enhancedData: EnhancedRegionData = {
      id: regionId,
      name: getRegionName(regionId),
      country: getRegionCountries(regionId),
      coordinates: getRegionCoordinates(regionId),
      
      economy: {
        gdpPerCapita: wbData[WB_INDICATORS.GDP_PER_CAPITA],
        gdpGrowth: wbData[WB_INDICATORS.GDP_GROWTH],
        povertyRate: wbData[WB_INDICATORS.POVERTY_RATE],
        unemploymentRate: wbData[WB_INDICATORS.UNEMPLOYMENT],
        giniIndex: wbData[WB_INDICATORS.GINI_INDEX],
      },
      
      social: {
        population: wbData[WB_INDICATORS.POPULATION],
        lifeExpectancy: wbData[WB_INDICATORS.LIFE_EXPECTANCY],
        literacyRate: wbData[WB_INDICATORS.LITERACY_RATE],
        urbanPopulation: wbData[WB_INDICATORS.URBAN_POPULATION],
      },
      
      education: {
        expenditureGDPPercent: wbData[WB_INDICATORS.EDUCATION_EXPENDITURE],
        primaryEnrollment: null, // 추가 API 필요
        secondaryEnrollment: null,
      },
      
      health: {
        healthExpenditureGDPPercent: wbData[WB_INDICATORS.HEALTH_EXPENDITURE],
        physiciansPer1000: null, // WHO API 필요
        hospitalBedsPer1000: null,
        maternalMortalityRate: null,
      },
      
      crises: {
        conflicts,
        disasters,
        foodInsecurity,
        refugees: refugeeStats,
      },
      
      categories,
      urgencyLevel,
      lastUpdated: new Date().toISOString(),
    };

    return enhancedData;
  } catch (error) {
    console.error(`Error fetching enhanced data for ${regionId}:`, error);
    return null;
  }
}

/**
 * 모든 지역의 데이터를 가져옵니다
 */
export async function getAllEnhancedRegionData(): Promise<EnhancedRegionData[]> {
  const regionIds = Object.keys(COUNTRY_CODES);
  const results = await Promise.all(
    regionIds.map((id) => getEnhancedRegionData(id))
  );
  return results.filter((r) => r !== null) as EnhancedRegionData[];
}

/**
 * 카테고리 결정 로직
 */
function determineCategories(data: any): CrisisCategory[] {
  const categories: CrisisCategory[] = [];

  if (data.conflicts.length > 0) categories.push('War/Conflict');
  
  // 영양부족률로 식량 안보 판단 (World Bank 데이터)
  if (data.malnutritionRate && data.malnutritionRate >= 15) categories.push('Hunger/Food Shortage');
  
  if (data.povertyRate && data.povertyRate > 20) categories.push('Poverty');
  if (data.educationExpenditure && data.educationExpenditure < 4) categories.push('Education');
  if (data.healthExpenditure && data.healthExpenditure < 5) categories.push('Health/Medical');
  if (data.refugeeStats && (data.refugeeStats.origin > 100000 || data.refugeeStats.idps > 100000)) categories.push('Refugees');
  if (data.disasters.length > 0) categories.push('Natural Disasters');

  return categories;
}

/**
 * 긴급도 레벨 결정
 */
function determineUrgencyLevel(data: any): 'critical' | 'high' | 'medium' | 'low' {
  let score = 0;

  if (data.conflicts > 10) score += 3;
  else if (data.conflicts > 5) score += 2;
  else if (data.conflicts > 0) score += 1;

  if (data.ipcPhase >= 4) score += 3;
  else if (data.ipcPhase === 3) score += 2;

  if (data.refugees > 1000000) score += 3;
  else if (data.refugees > 500000) score += 2;
  else if (data.refugees > 100000) score += 1;

  if (data.povertyRate > 40) score += 2;
  else if (data.povertyRate > 20) score += 1;

  if (data.disasters > 3) score += 2;
  else if (data.disasters > 0) score += 1;

  if (score >= 8) return 'critical';
  if (score >= 5) return 'high';
  if (score >= 3) return 'medium';
  return 'low';
}

// Helper functions
function getRegionName(regionId: string): string {
  const names: Record<string, string> = {
    'sub-saharan-africa': '사하라 이남 아프리카',
    'south-asia': '남아시아',
    'southeast-asia': '동남아시아',
    'central-america': '중앙아메리카',
    'middle-east': '중동',
    'eastern-europe': '동유럽',
    'pacific-islands': '태평양 도서 국가',
  };
  return names[regionId] || regionId;
}

function getRegionCountries(regionId: string): string {
  const countries: Record<string, string> = {
    'sub-saharan-africa': '나이지리아, 에티오피아, 콩고민주공화국 등',
    'south-asia': '인도, 파키스탄, 방글라데시 등',
    'southeast-asia': '인도네시아, 필리핀, 베트남 등',
    'central-america': '과테말라, 온두라스, 아이티 등',
    'middle-east': '예멘, 시리아, 이라크 등',
    'eastern-europe': '우크라이나, 몰도바, 조지아 등',
    'pacific-islands': '파푸아뉴기니, 피지, 솔로몬 제도 등',
  };
  return countries[regionId] || '';
}

function getRegionCoordinates(regionId: string): [number, number] {
  const coordinates: Record<string, [number, number]> = {
    'sub-saharan-africa': [0, 20],
    'south-asia': [20, 75],
    'southeast-asia': [10, 110],
    'central-america': [15, -90],
    'middle-east': [30, 45],
    'eastern-europe': [50, 30],
    'pacific-islands': [-15, 170],
  };
  return coordinates[regionId] || [0, 0];
}

