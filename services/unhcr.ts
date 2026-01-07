// UNHCR (United Nations High Commissioner for Refugees) API 서비스
import { UNHCRData } from '@/types/api';

// UNHCR API 기본 URL (올바른 도메인)
const BASE_URL = 'https://api.unhcr.org/population/v1';

/**
 * UNHCR API에서 난민 데이터를 가져옵니다
 * @param countryCode - ISO3 국가 코드 (예: GHA, SYR)
 * @param year - 연도 (기본값: 최신 연도)
 * @param type - 'origin' (출신) 또는 'asylum' (수용) (기본값: 둘 다)
 */
export async function getRefugeeData(
  countryCode?: string,
  year?: number,
  type?: 'origin' | 'asylum'
): Promise<UNHCRData[]> {
  // 최신 연도를 먼저 가져옵니다
  let targetYear = year;
  
  if (!targetYear) {
    try {
      console.log('Fetching latest year from UNHCR years endpoint...');
      const yearsResponse = await fetch(`${BASE_URL}/years/`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0',
        },
      });
      
      console.log('Years API status:', yearsResponse.status);
      
      if (yearsResponse.ok) {
        const yearsData = await yearsResponse.json();
        console.log('Years data:', JSON.stringify(yearsData).substring(0, 300));
        
        if (yearsData.items && yearsData.items.length > 0) {
          const years = yearsData.items.map((item: any) => item.year).sort((a: number, b: number) => b - a);
          // 2023년을 기본으로 사용 (2024, 2025는 데이터가 불완전할 수 있음)
          targetYear = years.find((y: number) => y <= 2023) || years[0];
          console.log('Latest year from API:', targetYear);
        }
      }
    } catch (error) {
      console.error('Error fetching latest year:', error);
    }
    
    // fallback: 2023년
    if (!targetYear) {
      targetYear = 2023;
      console.log('Using fallback year:', targetYear);
    }
  }
  
  console.log('Requesting UNHCR data for year:', targetYear);
  
  const params = new URLSearchParams({
    'year[]': targetYear.toString(),
    limit: '1000',
  });

  // 국가 코드가 있으면 필터 추가
  if (countryCode) {
    if (type === 'origin') {
      params.append('coo', countryCode); // Country of Origin
    } else if (type === 'asylum') {
      params.append('coa', countryCode); // Country of Asylum
    } else {
      // 둘 다 가져오기 위해 두 번 호출
      const originData = await getRefugeeData(countryCode, targetYear, 'origin');
      const asylumData = await getRefugeeData(countryCode, targetYear, 'asylum');
      return [...originData, ...asylumData];
    }
  }

  console.log('UNHCR API URL:', `${BASE_URL}/population/?${params.toString()}`);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(`${BASE_URL}/population/?${params.toString()}`, {
      signal: controller.signal,
      next: { revalidate: 604800 }, // 7일 캐시
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`UNHCR API error: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse UNHCR response as JSON. Content-Type:', contentType);
      return [];
    }
    
    if (data && Array.isArray(data.items)) {
      console.log('Received', data.items.length, 'items');
      return data.items;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching UNHCR data:', error);
    return [];
  }
}

/**
 * 특정 국가의 난민 통계 요약
 */
export async function getRefugeeStats(countryCode: string) {
  const data = await getRefugeeData(countryCode);

  const stats = {
    refugeesOriginating: 0, // 해당 국가에서 나간 난민
    refugeesAsylum: 0, // 해당 국가가 받아들인 난민
    idps: 0, // 국내 실향민
    asylumSeekers: 0,
  };

  data.forEach((record) => {
    if (record.country_of_origin === countryCode) {
      stats.refugeesOriginating += record.refugees || 0;
      stats.idps += record.idps || 0;
    }
    if (record.country_of_asylum === countryCode) {
      stats.refugeesAsylum += record.refugees || 0;
      stats.asylumSeekers += record.asylum_seekers || 0;
    }
  });

  return stats;
}

