// API: 국가별 상세 보건 데이터
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

    // 보건 관련 지표들을 병렬로 가져오기
    const [
      lifeExpectancy,
      infantMortality,
      under5Mortality,
      neonatalMortality,
      maternalMortality,
      physicians,
      nursesMidwives,
      hospitalBeds,
      birthsAttended,
      immunizationMeasles,
      immunizationDPT,
      hivPrevalence,
      tuberculosisIncidence,
      malnutrition,
      stunting,
      wasting,
      lowBirthweight,
      basicSanitation,
      improvedWater,
      healthExpenditure,
      adolescentFertility,
      overweightAdults,
    ] = await Promise.all([
      getWorldBankIndicator(iso3, WB_INDICATORS.LIFE_EXPECTANCY),
      getWorldBankIndicator(iso3, WB_INDICATORS.INFANT_MORTALITY),
      getWorldBankIndicator(iso3, WB_INDICATORS.UNDER5_MORTALITY),
      getWorldBankIndicator(iso3, WB_INDICATORS.NEONATAL_MORTALITY),
      getWorldBankIndicator(iso3, WB_INDICATORS.MATERNAL_MORTALITY),
      getWorldBankIndicator(iso3, WB_INDICATORS.PHYSICIANS),
      getWorldBankIndicator(iso3, WB_INDICATORS.NURSES_MIDWIVES),
      getWorldBankIndicator(iso3, WB_INDICATORS.HOSPITAL_BEDS),
      getWorldBankIndicator(iso3, WB_INDICATORS.BIRTHS_ATTENDED),
      getWorldBankIndicator(iso3, WB_INDICATORS.IMMUNIZATION_MEASLES),
      getWorldBankIndicator(iso3, WB_INDICATORS.IMMUNIZATION_DPT),
      getWorldBankIndicator(iso3, WB_INDICATORS.HIV_PREVALENCE),
      getWorldBankIndicator(iso3, WB_INDICATORS.TUBERCULOSIS_INCIDENCE),
      getWorldBankIndicator(iso3, WB_INDICATORS.MALNUTRITION),
      getWorldBankIndicator(iso3, WB_INDICATORS.STUNTING),
      getWorldBankIndicator(iso3, WB_INDICATORS.WASTING),
      getWorldBankIndicator(iso3, WB_INDICATORS.LOW_BIRTHWEIGHT),
      getWorldBankIndicator(iso3, WB_INDICATORS.BASIC_SANITATION),
      getWorldBankIndicator(iso3, WB_INDICATORS.IMPROVED_WATER_SOURCE),
      getWorldBankIndicator(iso3, WB_INDICATORS.HEALTH_EXPENDITURE),
      getWorldBankIndicator(iso3, WB_INDICATORS.ADOLESCENT_FERTILITY),
      getWorldBankIndicator(iso3, WB_INDICATORS.OVERWEIGHT_ADULTS),
    ]);

    // 최신 값 추출
    const getLatestValue = (data: any[]) => {
      const latest = data.find((d) => d.value !== null);
      return {
        value: latest?.value ?? null,
        year: latest?.date ?? null,
      };
    };

    // 연도별 트렌드 데이터 추출 (최근 10년)
    const getYearlyTrend = (data: any[]) => {
      return data
        .filter((d) => d.value !== null)
        .sort((a, b) => parseInt(b.date) - parseInt(a.date))
        .slice(0, 10)
        .map((d) => ({
          year: parseInt(d.date),
          value: d.value,
        }))
        .reverse();
    };

    const healthData = {
      lifeExpectancy: {
        current: getLatestValue(lifeExpectancy),
        trend: getYearlyTrend(lifeExpectancy),
      },
      mortality: {
        infant: getLatestValue(infantMortality),
        under5: getLatestValue(under5Mortality),
        neonatal: getLatestValue(neonatalMortality),
        maternal: getLatestValue(maternalMortality),
      },
      infrastructure: {
        physicians: getLatestValue(physicians),
        nursesMidwives: getLatestValue(nursesMidwives),
        hospitalBeds: getLatestValue(hospitalBeds),
        birthsAttended: getLatestValue(birthsAttended),
      },
      immunization: {
        measles: getLatestValue(immunizationMeasles),
        dpt: getLatestValue(immunizationDPT),
      },
      diseases: {
        hivPrevalence: getLatestValue(hivPrevalence),
        tuberculosis: getLatestValue(tuberculosisIncidence),
      },
      nutrition: {
        malnutrition: getLatestValue(malnutrition),
        stunting: getLatestValue(stunting),
        wasting: getLatestValue(wasting),
        lowBirthweight: getLatestValue(lowBirthweight),
        overweight: getLatestValue(overweightAdults),
      },
      sanitation: {
        basicSanitation: getLatestValue(basicSanitation),
        improvedWater: getLatestValue(improvedWater),
      },
      expenditure: {
        healthExpenditure: getLatestValue(healthExpenditure),
      },
      reproductive: {
        adolescentFertility: getLatestValue(adolescentFertility),
      },
    };

    return NextResponse.json({
      success: true,
      data: healthData,
    });

  } catch (error: any) {
    console.error('Error fetching health data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

