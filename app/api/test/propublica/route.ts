import { NextResponse } from 'next/server';
import { getCharityFinancials, calculateFinancialGrade } from '@/services/charity-financials';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // American Red Cross로 테스트
    const data = await getCharityFinancials('530196605');
    const duration = Date.now() - startTime;

    // 재무 등급 계산
    const grade = data ? calculateFinancialGrade(data.metrics) : null;

    return NextResponse.json({
      success: true,
      duration: `${duration}ms`,
      data: data ? {
        ...data,
        financialGrade: grade,
      } : null,
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    return NextResponse.json({
      success: false,
      duration: `${duration}ms`,
      error: error.message,
    });
  }
}
