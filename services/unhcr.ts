// UNHCR (United Nations High Commissioner for Refugees) API 서비스
import { UNHCRData } from '@/types/api';

// UNHCR API 기본 URL (올바른 도메인)
const BASE_URL = 'https://api.unhcr.org/population/v1';

/**
 * UNHCR API에서 난민 데이터를 가져옵니다
 */
export async function getRefugeeData(
  countryCode?: string,
  year?: number
): Promise<UNHCRData[]> {
  // 최신 연도를 먼저 가져옵니다
  let targetYear = year;
  
  if (!targetYear) {
    try {
      console.log('Fetching latest year from UNHCR years endpoint...');
      // years 엔드포인트로 최신 연도 확인 (역순 정렬 추가)
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
          // 연도 배열을 내림차순 정렬하여 최신 연도 가져오기
          const years = yearsData.items.map((item: any) => item.year).sort((a: number, b: number) => b - a);
          targetYear = years[0];
          console.log('Latest year from API:', targetYear);
        }
      }
    } catch (error) {
      console.error('Error fetching latest year:', error);
    }
    
    // fallback: 전년도
    if (!targetYear) {
      targetYear = new Date().getFullYear() - 1;
      console.log('Using fallback year:', targetYear);
    }
  }
  
  console.log('Requesting UNHCR data for year:', targetYear);
  
  const params = new URLSearchParams({
    yearFrom: targetYear.toString(),
    yearTo: targetYear.toString(),
    limit: '100',
  });

  if (countryCode) {
    params.append('coo_iso', countryCode); // Country of Origin
  }

  console.log('UNHCR API URL:', `${BASE_URL}/population/?${params.toString()}`);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8초 타임아웃

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

    // Content-Type 확인
    const contentType = response.headers.get('content-type');
    
    // 응답을 텍스트로 먼저 확인
    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse UNHCR response as JSON. Content-Type:', contentType);
      return [];
    }
    
    // UNHCR API는 { items: [...] } 구조로 응답합니다
    if (data && Array.isArray(data.items)) {
      console.log('Received', data.items.length, 'items, first year:', data.items[0]?.year);
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

