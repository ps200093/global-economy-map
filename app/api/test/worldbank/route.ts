import { NextResponse } from 'next/server';
import { getMultipleIndicators, WB_INDICATORS } from '@/services/worldbank';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // 인도 데이터로 테스트 (모든 지표 포함)
    const data = await getMultipleIndicators('IND', [
      WB_INDICATORS.GDP_PER_CAPITA,
      WB_INDICATORS.POVERTY_RATE,
      WB_INDICATORS.POPULATION,
      WB_INDICATORS.MALNUTRITION,      // 영양부족 비율
      WB_INDICATORS.STUNTING,          // 발육부진 비율
      WB_INDICATORS.WASTING,           // 소모성 질환 비율
      WB_INDICATORS.FOOD_PRODUCTION,   // 식량 생산 지수
    ]);
    
    const duration = Date.now() - startTime;

    // 식량 안보 판단 로직
    const malnutritionRate = data[WB_INDICATORS.MALNUTRITION];
    let foodSecurityLevel = 'Good';
    let ipcPhase = 1;
    
    if (malnutritionRate) {
      if (malnutritionRate >= 35) {
        foodSecurityLevel = 'Famine (Phase 5)';
        ipcPhase = 5;
      } else if (malnutritionRate >= 25) {
        foodSecurityLevel = 'Emergency (Phase 4)';
        ipcPhase = 4;
      } else if (malnutritionRate >= 15) {
        foodSecurityLevel = 'Crisis (Phase 3)';
        ipcPhase = 3;
      } else if (malnutritionRate >= 8) {
        foodSecurityLevel = 'Stressed (Phase 2)';
        ipcPhase = 2;
      } else {
        foodSecurityLevel = 'Minimal (Phase 1)';
        ipcPhase = 1;
      }
    }
    
    return NextResponse.json({
      success: true,
      duration: `${duration}ms`,
      data: {
        economic: {
          gdpPerCapita: data[WB_INDICATORS.GDP_PER_CAPITA],
          povertyRate: data[WB_INDICATORS.POVERTY_RATE],
          population: data[WB_INDICATORS.POPULATION],
        },
        foodSecurity: {
          malnutritionRate: data[WB_INDICATORS.MALNUTRITION],
          stuntingRate: data[WB_INDICATORS.STUNTING],
          wastingRate: data[WB_INDICATORS.WASTING],
          foodProductionIndex: data[WB_INDICATORS.FOOD_PRODUCTION],
          assessedLevel: foodSecurityLevel,
          ipcPhase: ipcPhase,
        }
      }
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
