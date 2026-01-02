// ACLED (Armed Conflict Location & Event Data) 서비스
// Excel 파일에서 데이터 로드
import { ACLEDEvent } from '@/types/api';
import * as XLSX from 'xlsx';
import path from 'path';
import { promises as fs } from 'fs';

/**
 * 지역별 Excel 파일 매핑
 */
const REGION_FILES: Record<string, string> = {
  'africa': 'Africa_aggregated_data_up_to-2025-12-06.xlsx',
  'asia': 'Asia-Pacific_aggregated_data_up_to-2025-12-06.xlsx',
  'middle-east': 'Middle-East_aggregated_data_up_to-2025-12-06.xlsx',
  'americas': 'Latin-America-the-Caribbean_aggregated_data_up_to-2025-12-06.xlsx',
  'us-canada': 'US-and-Canada_aggregated_data_up_to-2025-12-06.xlsx',
  'europe': 'Europe-Central-Asia_aggregated_data_up_to-2025-12-06.xlsx',
};

/**
 * 통계 파일 매핑
 */
const STATS_FILES = {
  civilian_fatalities: 'number_of_reported_civilian_fatalities_by_country-year_as-of-12Dec2025.xlsx',
  total_fatalities: 'number_of_reported_fatalities_by_country-year_as-of-12Dec2025.xlsx',
  civilian_events: 'number_of_events_targeting_civilians_by_country-year_as-of-12Dec2025.xlsx',
  demonstrations: 'number_of_demonstration_events_by_country-year_as-of-12Dec2025.xlsx',
  violence_monthly: 'number_of_political_violence_events_by_country-month-year_as-of-12Dec2025.xlsx',
  violence_yearly: 'number_of_political_violence_events_by_country-year_as-of-12Dec2025.xlsx',
};

const DATA_DIR = path.join(process.cwd(), 'public', 'data', 'acled');

/**
 * Excel 파일에서 ACLED 데이터를 파싱합니다 (서버 사이드)
 */
async function loadExcelData(fileName: string): Promise<any[]> {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    
    // 파일 존재 확인
    try {
      await fs.access(filePath);
    } catch {
      console.error(`File not found: ${filePath}`);
      return [];
    }

    const fileBuffer = await fs.readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    
    // 첫 번째 시트 읽기
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // JSON으로 변환
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    return data;
  } catch (error) {
    console.error(`Error loading Excel file ${fileName}:`, error);
    return [];
  }
}

/**
 * Excel 데이터를 ACLEDEvent 형식으로 변환
 */
function convertToACLEDEvent(row: any): ACLEDEvent | null {
  try {
    // WEEK를 날짜로 변환 (Excel serial date)
    const weekNumber = row['WEEK'];
    let eventDate = '';
    let year = new Date().getFullYear();
    
    if (weekNumber) {
      // Excel serial date를 JavaScript Date로 변환
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch.getTime() + weekNumber * 86400000);
      eventDate = date.toISOString().split('T')[0];
      year = date.getFullYear();
    }
    
    return {
      event_id_cnty: String(row['ID'] || ''),
      event_date: eventDate,
      year: year,
      event_type: row['EVENT_TYPE'] || '',
      sub_event_type: row['SUB_EVENT_TYPE'] || '',
      country: row['COUNTRY'] || '',
      region: row['REGION'] || '',
      latitude: parseFloat(row['CENTROID_LATITUDE']) || 0,
      longitude: parseFloat(row['CENTROID_LONGITUDE']) || 0,
      fatalities: parseInt(row['FATALITIES']) || 0,
      notes: row['DISORDER_TYPE'] || '',
    };
  } catch (error) {
    console.error('Error converting ACLED row:', error);
    return null;
  }
}

/**
 * 지역별 Excel 파일에서 분쟁 데이터를 가져옵니다
 */
export async function getConflictData(
  country?: string,
  startDate?: string,
  endDate?: string,
  limit: number = 500
): Promise<ACLEDEvent[]> {
  try {
    // 국가에 맞는 지역 파일 결정
    const region = determineRegion(country);
    const filePath = REGION_FILES[region] || REGION_FILES['africa'];
    
    const rawData = await loadExcelData(filePath);
    let events: ACLEDEvent[] = rawData
      .map(convertToACLEDEvent)
      .filter((e): e is ACLEDEvent => e !== null);

    // 국가 필터링
    if (country) {
      events = events.filter(e => 
        e.country.toLowerCase().includes(country.toLowerCase())
      );
    }

    // 날짜 필터링
    if (startDate) {
      events = events.filter(e => e.event_date >= startDate);
    }

    if (endDate) {
      events = events.filter(e => e.event_date <= endDate);
    }

    // 최신순 정렬
    events.sort((a, b) => 
      new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
    );

    return events.slice(0, limit);
  } catch (error) {
    console.error('Error loading conflict data:', error);
    return [];
  }
}

/**
 * 국가에 맞는 지역 결정
 */
function determineRegion(country?: string): string {
  if (!country) return 'africa';
  
  const countryLower = country.toLowerCase();
  
  // 아프리카
  const africaCountries = ['somalia', 'ethiopia', 'kenya', 'nigeria', 'south sudan', 'sudan', 'mali', 'niger', 'chad'];
  if (africaCountries.some(c => countryLower.includes(c))) return 'africa';
  
  // 중동
  const middleEastCountries = ['yemen', 'syria', 'iraq', 'lebanon', 'palestine', 'israel'];
  if (middleEastCountries.some(c => countryLower.includes(c))) return 'middle-east';
  
  // 아시아
  const asiaCountries = ['afghanistan', 'pakistan', 'india', 'bangladesh', 'myanmar', 'philippines'];
  if (asiaCountries.some(c => countryLower.includes(c))) return 'asia';
  
  // 유럽
  const europeCountries = ['ukraine', 'russia', 'georgia', 'armenia', 'azerbaijan'];
  if (europeCountries.some(c => countryLower.includes(c))) return 'europe';
  
  // 아메리카
  const americasCountries = ['mexico', 'colombia', 'haiti', 'venezuela', 'brazil'];
  if (americasCountries.some(c => countryLower.includes(c))) return 'americas';
  
  return 'africa'; // 기본값
}

/**
 * 지역별로 모든 데이터 로드
 */
export async function getConflictDataByRegion(
  region: keyof typeof REGION_FILES,
  country?: string,
  startDate?: string,
  endDate?: string
): Promise<ACLEDEvent[]> {
  const filePath = REGION_FILES[region];
  
  if (!filePath) {
    console.error(`Unknown region: ${region}`);
    return [];
  }

  const rawData = await loadExcelData(filePath);
  let events: ACLEDEvent[] = rawData
    .map(convertToACLEDEvent)
    .filter((e): e is ACLEDEvent => e !== null);

  // 필터링
  if (country) {
    events = events.filter(e => 
      e.country.toLowerCase().includes(country.toLowerCase())
    );
  }

  if (startDate) {
    events = events.filter(e => e.event_date >= startDate);
  }

  if (endDate) {
    events = events.filter(e => e.event_date <= endDate);
  }

  // 최신순 정렬
  events.sort((a, b) => 
    new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
  );

  return events;
}

/**
 * 특정 지역의 최근 분쟁 통계
 */
export async function getConflictStats(country: string) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  const events = await getConflictData(
    country,
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  );

  const totalEvents = events.length;
  const totalFatalities = events.reduce((sum, e) => sum + (e.fatalities || 0), 0);
  
  const eventTypes = events.reduce((acc, e) => {
    acc[e.event_type] = (acc[e.event_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalEvents,
    totalFatalities,
    eventTypes,
    recentEvents: events.slice(0, 10),
  };
}

/**
 * 사용 가능한 국가 목록
 */
export async function getAvailableCountries(): Promise<string[]> {
  try {
    // 모든 지역에서 국가 목록 수집
    const allCountries = new Set<string>();
    
    for (const [, filePath] of Object.entries(REGION_FILES)) {
      const data = await loadExcelData(filePath);
      data.forEach((row: any) => {
        const country = row['COUNTRY'];
        if (country) allCountries.add(country);
      });
    }
    
    return Array.from(allCountries).sort();
  } catch (error) {
    console.error('Error getting countries:', error);
    return [];
  }
}

/**
 * 월별 추세 (통계 파일 사용)
 */
export async function getMonthlyTrend(country?: string): Promise<{
  month: string;
  events: number;
  fatalities: number;
}[]> {
  try {
    const data = await loadExcelData(STATS_FILES.violence_monthly);
    
    let filtered = data;
    if (country) {
      filtered = data.filter((row: any) => 
        (row['COUNTRY'] || '').toLowerCase().includes(country.toLowerCase())
      );
    }

    // 월별 데이터 집계
    const monthlyMap = new Map<string, { events: number; fatalities: number }>();
    
    filtered.forEach((row: any) => {
      const year = row['YEAR'];
      const month = row['MONTH'];
      const events = parseInt(row['EVENTS'] || '0');
      
      // 월 이름을 숫자로 변환
      const monthNumber = getMonthNumber(month);
      const key = `${year}-${String(monthNumber).padStart(2, '0')}`;
      
      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, { events: 0, fatalities: 0 });
      }
      
      const current = monthlyMap.get(key)!;
      current.events += events;
    });

    return Array.from(monthlyMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));
  } catch (error) {
    console.error('Error getting monthly trend:', error);
    return [];
  }
}

/**
 * 월 이름을 숫자로 변환
 */
function getMonthNumber(monthName: string): number {
  const months: Record<string, number> = {
    'January': 1, 'February': 2, 'March': 3, 'April': 4,
    'May': 5, 'June': 6, 'July': 7, 'August': 8,
    'September': 9, 'October': 10, 'November': 11, 'December': 12
  };
  return months[monthName] || 1;
}

/**
 * 연도별 통계
 */
export async function getYearlyStats(country?: string) {
  try {
    const [violence, fatalities, civilianFatalities, demonstrations] = await Promise.all([
      loadExcelData(STATS_FILES.violence_yearly),
      loadExcelData(STATS_FILES.total_fatalities),
      loadExcelData(STATS_FILES.civilian_fatalities),
      loadExcelData(STATS_FILES.demonstrations),
    ]);

    const filterByCountry = (data: any[]) => {
      if (!country) return data;
      return data.filter((row: any) => 
        (row['COUNTRY'] || '').toLowerCase().includes(country.toLowerCase())
      );
    };

    return {
      violence: filterByCountry(violence),
      fatalities: filterByCountry(fatalities),
      civilianFatalities: filterByCountry(civilianFatalities),
      demonstrations: filterByCountry(demonstrations),
    };
  } catch (error) {
    console.error('Error getting yearly stats:', error);
    return {
      violence: [],
      fatalities: [],
      civilianFatalities: [],
      demonstrations: [],
    };
  }
}
