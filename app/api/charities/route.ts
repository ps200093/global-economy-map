// GET /api/charities - 기부 단체 목록 조회 및 검색
import { NextResponse } from 'next/server';
import { 
  getAllCharities, 
  searchCharities, 
  getCharitiesByCategory,
  getCharityStats 
} from '@/services/charity-db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const countries = searchParams.get('countries')?.split(',');
    const categories = searchParams.get('categories')?.split(',');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');
    const sortBy = searchParams.get('sortBy') as 'name' | 'transparencyScore' | 'rating' | 'updatedAt' || 'transparencyScore';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc';
    const stats = searchParams.get('stats') === 'true';

    // 통계 조회
    if (stats) {
      const charityStats = await getCharityStats();
      return NextResponse.json({
        success: true,
        stats: charityStats,
      });
    }

    // 검색
    if (query) {
      const results = await searchCharities(query, {
        limit,
        countries,
        categories,
      });

      return NextResponse.json({
        success: true,
        count: results.length,
        data: results,
      });
    }

    // 카테고리별 조회
    if (category) {
      const results = await getCharitiesByCategory(category);
      return NextResponse.json({
        success: true,
        count: results.length,
        data: results,
      });
    }

    // 전체 조회
    const charities = await getAllCharities({
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    return NextResponse.json({
      success: true,
      count: charities.length,
      data: charities,
    });

  } catch (error) {
    console.error('Charities API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch charities',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
