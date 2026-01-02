import { NextResponse } from 'next/server';
import { getEnhancedRegionData } from '@/services/integrated-data';

// 주요 지역 ID 목록
const REGIONS = [
  'sub-saharan-africa',
  'south-asia',
  'southeast-asia',
  'central-america',
  'middle-east',
  'eastern-europe',
];

export async function GET() {
  try {
    // 모든 지역 데이터를 병렬로 가져오기
    const regionsData = await Promise.all(
      REGIONS.map(async (regionId) => {
        const data = await getEnhancedRegionData(regionId);
        return data;
      })
    );

    // null 값 필터링
    const validRegions = regionsData.filter(region => region !== null);

    return NextResponse.json({
      success: true,
      data: validRegions,
      count: validRegions.length,
    });
  } catch (error) {
    console.error('Error fetching regions data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch regions data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// 특정 지역 데이터 가져오기
export async function POST(request: Request) {
  try {
    const { regionId } = await request.json();

    if (!regionId) {
      return NextResponse.json(
        { success: false, error: 'Region ID is required' },
        { status: 400 }
      );
    }

    const data = await getEnhancedRegionData(regionId);

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Region not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching region data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch region data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

