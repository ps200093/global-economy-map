// API: 국가별 난민 데이터 (UNHCR)
import { NextResponse } from 'next/server';
import { getRefugeeData } from '@/services/unhcr';

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

    console.log(`\nFetching refugee data for: ${iso3}`);

    // UNHCR API에서 해당 국가의 출신(origin) 및 수용(asylum) 데이터 가져오기
    const refugeeData = await getRefugeeData(iso3);
    
    console.log(`Total records fetched: ${refugeeData.length}`);

    // 데이터 집계
    const stats = {
      refugeesOriginating: 0,
      refugeesAsylum: 0,
      idps: 0,
      returnedRefugees: 0,
      returnedIDPs: 0,
      asylumSeekers: 0,
      stateless: 0,
      ooc: 0,
      year: 2023,
    };

    refugeeData.forEach((record) => {
      if (record.year > stats.year) {
        stats.year = record.year;
      }

      // 이 국가 출신 난민 (coo_iso === iso3)
      if (record.coo_iso === iso3) {
        stats.refugeesOriginating += record.refugees || 0;
        stats.idps += record.idps || 0;
        stats.returnedRefugees += parseInt(record.returned_refugees as any) || 0;
        stats.returnedIDPs += parseInt(record.returned_idps as any) || 0;
        stats.asylumSeekers += record.asylum_seekers || 0;
        stats.stateless += parseInt(record.stateless as any) || 0;
        stats.ooc += record.ooc || 0;
      }

      // 이 국가가 수용한 난민 (coa_iso === iso3)
      if (record.coa_iso === iso3) {
        stats.refugeesAsylum += record.refugees || 0;
        stats.asylumSeekers += record.asylum_seekers || 0;
        stats.stateless += parseInt(record.stateless as any) || 0;
        stats.ooc += record.ooc || 0;
      }
    });

    // 전체 통계 (비교용)
    const globalData = await getRefugeeData();
    let globalStats = {
      refugees: 0,
      asylumSeekers: 0,
      idps: 0,
      stateless: 0,
    };

    globalData.forEach(record => {
      if (record.coo_iso === '-' && record.coa_iso === '-') {
        // 전체 집계 데이터
        globalStats.refugees = record.refugees || 0;
        globalStats.asylumSeekers = record.asylum_seekers || 0;
        globalStats.idps = record.idps || 0;
        globalStats.stateless = parseInt(record.stateless as any) || 0;
      }
    });

    const refugeeDataResponse = {
      summary: {
        year: stats.year,
        refugeesOriginating: stats.refugeesOriginating,
        refugeesAsylum: stats.refugeesAsylum,
        idps: stats.idps,
        returnedRefugees: stats.returnedRefugees,
        returnedIDPs: stats.returnedIDPs,
        asylumSeekers: stats.asylumSeekers,
        stateless: stats.stateless,
        ooc: stats.ooc,
        totalDisplaced: stats.refugeesOriginating + stats.idps,
      },
      globalStats,
      topDestinations: [],
      topOrigins: [],
      hasData: refugeeData.length > 0 && (
        stats.refugeesOriginating > 0 || 
        stats.refugeesAsylum > 0 || 
        stats.idps > 0 || 
        stats.asylumSeekers > 0 ||
        stats.stateless > 0 ||
        stats.ooc > 0
      ),
      onlyAggregateAvailable: false,
    };

    console.log(`Refugee data for ${iso3}:`, {
      dataLength: refugeeData.length,
      hasData: refugeeDataResponse.hasData,
      stats: stats,
    });

    return NextResponse.json({
      success: true,
      data: refugeeDataResponse,
    });

  } catch (error: any) {
    console.error('Error fetching refugee data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

