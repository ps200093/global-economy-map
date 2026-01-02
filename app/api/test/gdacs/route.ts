import { NextResponse } from 'next/server';
import { getDisasterAlerts } from '@/services/gdacs';

export async function GET() {
  const startTime = Date.now();
  
  try {
    const data = await getDisasterAlerts();
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      duration: `${duration}ms`,
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

