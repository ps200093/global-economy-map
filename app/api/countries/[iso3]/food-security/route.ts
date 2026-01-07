// API: 국가별 상세 식량 안보 데이터
import { NextResponse } from 'next/server';
import { getWorldBankIndicator, WB_INDICATORS } from '@/services/worldbank';

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

    // 식량 안보 관련 지표들을 병렬로 가져오기
    const [
      cerealProduction,
      cerealYield,
      agriculturalLand,
      arableLand,
      irrigatedLand,
      foodImports,
      foodExports,
      improvedWaterSource,
      ruralPopulation,
      foodProduction,
      malnutrition,
      stunting,
    ] = await Promise.all([
      getWorldBankIndicator(iso3, WB_INDICATORS.CEREAL_PRODUCTION),
      getWorldBankIndicator(iso3, WB_INDICATORS.CEREAL_YIELD),
      getWorldBankIndicator(iso3, WB_INDICATORS.AGRICULTURAL_LAND),
      getWorldBankIndicator(iso3, WB_INDICATORS.ARABLE_LAND),
      getWorldBankIndicator(iso3, WB_INDICATORS.IRRIGATED_LAND),
      getWorldBankIndicator(iso3, WB_INDICATORS.FOOD_IMPORTS),
      getWorldBankIndicator(iso3, WB_INDICATORS.FOOD_EXPORTS),
      getWorldBankIndicator(iso3, WB_INDICATORS.IMPROVED_WATER_SOURCE),
      getWorldBankIndicator(iso3, WB_INDICATORS.RURAL_POPULATION),
      getWorldBankIndicator(iso3, WB_INDICATORS.FOOD_PRODUCTION),
      getWorldBankIndicator(iso3, WB_INDICATORS.MALNUTRITION),
      getWorldBankIndicator(iso3, WB_INDICATORS.STUNTING),
    ]);

    // 최신 값 추출
    const getLatestValue = (data: any[]) => {
      const latest = data.find((d) => d.value !== null);
      return {
        value: latest?.value ?? null,
        year: latest?.date ?? null,
      };
    };

    const foodSecurityData = {
      production: {
        cerealProduction: getLatestValue(cerealProduction),
        cerealYield: getLatestValue(cerealYield),
        foodProductionIndex: getLatestValue(foodProduction),
      },
      land: {
        agriculturalLand: getLatestValue(agriculturalLand),
        arableLand: getLatestValue(arableLand),
        irrigatedLand: getLatestValue(irrigatedLand),
      },
      trade: {
        foodImports: getLatestValue(foodImports),
        foodExports: getLatestValue(foodExports),
      },
      infrastructure: {
        improvedWaterSource: getLatestValue(improvedWaterSource),
        ruralPopulation: getLatestValue(ruralPopulation),
      },
      nutrition: {
        malnutrition: getLatestValue(malnutrition),
        stunting: getLatestValue(stunting),
      },
    };

    return NextResponse.json({
      success: true,
      data: foodSecurityData,
    });

  } catch (error: any) {
    console.error('Error fetching food security data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

