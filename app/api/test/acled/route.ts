import { NextResponse } from 'next/server';
import { getConflictData } from '@/services/acled';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // 나이지리아의 최근 데이터 조회
    const data = await getConflictData('Nigeria', '2024-01-01', '2025-12-31', 10);
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      duration: `${duration}ms`,
      count: data.length,
      data: data.slice(0, 5), // 처음 5개
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    return NextResponse.json({
      success: false,
      duration: `${duration}ms`,
      error: error.message,
      stack: error.stack,
    });
  }
}

