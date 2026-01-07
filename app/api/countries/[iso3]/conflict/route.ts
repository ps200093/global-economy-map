// API: 국가별 분쟁/폭력 데이터 (ACLED)
import { NextResponse } from 'next/server';
import { getRecentYearlyStats, getCountryTrend } from '@/services/acled-stats';
import { getConflictDataByISO3, getACLEDEventsByType } from '@/services/acled-db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ iso3: string }> }
) {
  try {
    const { iso3 } = await params;

    if (!iso3 || iso3.length !== 3) {
      return NextResponse.json(
        { success: false, error: 'Invalid ISO3 code' },
        { status: 400 }
      );
    }

    // 최근 5년 통계 및 트렌드 가져오기
    const currentYear = new Date().getFullYear();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const startDate = oneYearAgo.toISOString().split('T')[0];

    const [yearlyStats, trendData, recentEvents] = await Promise.all([
      getRecentYearlyStats(iso3, 5),
      getCountryTrend(iso3, currentYear - 5, currentYear),
      getConflictDataByISO3(iso3, undefined, undefined, 50), // 최근 50개 이벤트
    ]);

    // 최신 연도 통계
    const latestStats = yearlyStats[0] || null;

    // 국가명을 yearlyStats에서 가져와서 ACLEDEvents에서 이벤트 타입별 집계
    let eventTypeCount: Record<string, number> = {};
    if (latestStats?.country) {
      eventTypeCount = await getACLEDEventsByType(latestStats.country, startDate);
    }

    // ACLEDEvents에서 가져온 이벤트 타입별 집계 (최근 1년)
    const eventTypeBreakdown = {
      battles: eventTypeCount['Battles'] || 0,
      violenceAgainstCivilians: eventTypeCount['Violence against civilians'] || 0,
      protests: eventTypeCount['Protests'] || 0,
      riots: eventTypeCount['Riots'] || 0,
      explosions: eventTypeCount['Explosions/Remote violence'] || 0,
      strategicDevelopments: eventTypeCount['Strategic developments'] || 0,
    };

    const conflictData = {
      summary: {
        country: latestStats?.country || '',
        iso3: iso3.toUpperCase(),
        latestYear: latestStats?.year || currentYear,
        totalEvents: latestStats?.politicalViolenceEvents || 0,
        totalFatalities: latestStats?.totalFatalities || 0,
        civilianFatalities: latestStats?.civilianFatalities || 0,
        demonstrations: latestStats?.demonstrations || 0,
      },
      eventTypeBreakdown,
      trend: {
        years: trendData.years,
        politicalViolence: trendData.politicalViolence,
        totalFatalities: trendData.totalFatalities,
        civilianFatalities: trendData.civilianFatalities,
        demonstrations: trendData.demonstrations,
      },
      yearlyStats: yearlyStats.map(stat => ({
        year: stat.year,
        politicalViolence: stat.politicalViolenceEvents || 0,
        fatalities: stat.totalFatalities || 0,
        civilianFatalities: stat.civilianFatalities || 0,
        demonstrations: stat.demonstrations || 0,
        civilianTargeting: stat.civilianTargetingEvents || 0,
      })),
      recentEvents: recentEvents.slice(0, 10).map(event => ({
        date: event.event_date,
        type: event.event_type,
        subType: event.sub_event_type,
        fatalities: event.fatalities,
        location: `${event.region}`,
        notes: event.notes,
      })),
    };

    return NextResponse.json({
      success: true,
      data: conflictData,
    });

  } catch (error: any) {
    console.error('Error fetching conflict data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

