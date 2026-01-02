// GDACS (Global Disaster Alert and Coordination System) API 서비스
import { GDACSAlert } from '@/types/api';

const BASE_URL = 'https://www.gdacs.org/gdacsapi/api';

/**
 * GDACS API에서 재난 알림 데이터를 가져옵니다
 */
export async function getDisasterAlerts(
  country?: string,
  limit: number = 50
): Promise<GDACSAlert[]> {
  try {
    // GDACS는 RSS/XML 형식으로 제공되므로 JSON API 엔드포인트 사용
    const response = await fetch(`${BASE_URL}/events/geteventlist/SEARCH`, {
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!response.ok) {
      throw new Error(`GDACS API error: ${response.status}`);
    }

    const data = await response.json();
    let alerts: GDACSAlert[] = data.features || [];

    // 국가 필터링
    if (country) {
      alerts = alerts.filter(
        (alert) => alert.country?.toLowerCase().includes(country.toLowerCase())
      );
    }

    return alerts.slice(0, limit);
  } catch (error) {
    console.error('Error fetching GDACS data:', error);
    return [];
  }
}

/**
 * 특정 국가의 재난 통계
 */
export async function getDisasterStats(country: string) {
  const alerts = await getDisasterAlerts(country);

  const stats = {
    total: alerts.length,
    byType: {} as Record<string, number>,
    bySeverity: {} as Record<string, number>,
    affectedPopulation: 0,
  };

  alerts.forEach((alert) => {
    // 유형별 집계
    stats.byType[alert.eventtype] = (stats.byType[alert.eventtype] || 0) + 1;

    // 심각도별 집계
    stats.bySeverity[alert.severity] = (stats.bySeverity[alert.severity] || 0) + 1;

    // 영향 받은 인구 합계
    stats.affectedPopulation += alert.population || 0;
  });

  return stats;
}

