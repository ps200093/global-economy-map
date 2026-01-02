// API: 모든 국가 데이터 조회
import { NextResponse } from 'next/server';
import { getCountryBasicCollection } from '@/lib/mongodb';
import { CountryScore } from '@/types/country';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 쿼리 파라미터
    const urgencyLevel = searchParams.get('urgency');
    const region = searchParams.get('region');
    const minScore = searchParams.get('minScore');
    const maxScore = searchParams.get('maxScore');
    const limit = parseInt(searchParams.get('limit') || '200');
    const sortBy = searchParams.get('sortBy') || 'overall'; // overall, poverty, health 등

    const collection = await getCountryBasicCollection();

    // 필터 조건 구성
    const filter: any = {};
    
    if (urgencyLevel) {
      filter.urgencyLevel = urgencyLevel;
    }
    
    if (region) {
      filter.region = region;
    }
    
    if (minScore || maxScore) {
      filter['scores.overall'] = {};
      if (minScore) filter['scores.overall'].$gte = parseFloat(minScore);
      if (maxScore) filter['scores.overall'].$lte = parseFloat(maxScore);
    }

    // 정렬 조건
    const sort: any = {};
    switch (sortBy) {
      case 'poverty':
        sort['scores.poverty'] = -1;
        break;
      case 'health':
        sort['scores.health'] = -1;
        break;
      case 'education':
        sort['scores.education'] = -1;
        break;
      case 'economy':
        sort['scores.economy'] = -1;
        break;
      default:
        sort['scores.overall'] = -1; // 종합 점수 내림차순
    }

    // 데이터 조회
    const countries = await collection
      .find(filter)
      .sort(sort)
      .limit(limit)
      .toArray() as unknown as CountryScore[];

    // 통계 계산
    const stats = {
      total: countries.length,
      avgScore: countries.reduce((sum, c) => sum + c.scores.overall, 0) / countries.length,
      urgencyDistribution: {
        critical: countries.filter(c => c.urgencyLevel === 'critical').length,
        high: countries.filter(c => c.urgencyLevel === 'high').length,
        medium: countries.filter(c => c.urgencyLevel === 'medium').length,
        low: countries.filter(c => c.urgencyLevel === 'low').length,
        stable: countries.filter(c => c.urgencyLevel === 'stable').length,
      },
    };

    return NextResponse.json({
      success: true,
      data: countries,
      stats,
      filter: { urgencyLevel, region, minScore, maxScore },
      count: countries.length,
    });

  } catch (error: any) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch countries',
        hint: 'Make sure MongoDB is running and data is populated'
      },
      { status: 500 }
    );
  }
}

