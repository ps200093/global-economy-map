import { NextResponse } from 'next/server';
import { getConflictData } from '@/services/acled-db';
import { getDisasterAlerts } from '@/services/gdacs';
import { getRefugeeData } from '@/services/unhcr';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const type = searchParams.get('type'); // conflict, disaster, refugee

    if (!country) {
      return NextResponse.json(
        { success: false, error: 'Country code is required' },
        { status: 400 }
      );
    }

    let data: any = {};

    // 요청된 타입에 따라 데이터 가져오기
    if (!type || type === 'conflict') {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);

      data.conflicts = await getConflictData(
        country,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
    }

    if (!type || type === 'disaster') {
      data.disasters = await getDisasterAlerts(country);
    }

    if (!type || type === 'refugee') {
      data.refugees = await getRefugeeData(country);
    }

    return NextResponse.json({
      success: true,
      country,
      data,
    });
  } catch (error) {
    console.error('Error fetching crisis data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch crisis data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

