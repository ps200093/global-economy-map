import { NextResponse } from 'next/server';
import { getRefugeeData } from '@/services/unhcr';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // 시리아 난민 데이터 테스트 (최신 연도 자동 가져오기)
    const data = await getRefugeeData('SYR'); // year 파라미터 제거
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      duration: `${duration}ms`,
      count: data.length,
      data: data.slice(0, 5), // 처음 5개만
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

