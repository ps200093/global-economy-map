// API: 국가별 상세 경제 데이터
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

    // 경제 관련 지표들을 병렬로 가져오기
    const [
      gdpTotal,
      gdpPerCapita,
      gdpGrowth,
      gniPerCapita,
      inflation,
      unemployment,
      giniIndex,
      tradePercentGdp,
      exportsPercentGdp,
      importsPercentGdp,
      fdiNetInflows,
      externalDebt,
      remittances,
      laborParticipation,
      employmentAgriculture,
      employmentIndustry,
      employmentServices,
      accessElectricity,
      internetUsers,
      mobileSubscriptions,
      urbanPopulation,
    ] = await Promise.all([
      getWorldBankIndicator(iso3, WB_INDICATORS.GDP_TOTAL),
      getWorldBankIndicator(iso3, WB_INDICATORS.GDP_PER_CAPITA),
      getWorldBankIndicator(iso3, WB_INDICATORS.GDP_GROWTH),
      getWorldBankIndicator(iso3, WB_INDICATORS.GNI_PER_CAPITA),
      getWorldBankIndicator(iso3, WB_INDICATORS.INFLATION),
      getWorldBankIndicator(iso3, WB_INDICATORS.UNEMPLOYMENT),
      getWorldBankIndicator(iso3, WB_INDICATORS.GINI_INDEX),
      getWorldBankIndicator(iso3, WB_INDICATORS.TRADE_PERCENT_GDP),
      getWorldBankIndicator(iso3, WB_INDICATORS.EXPORTS_PERCENT_GDP),
      getWorldBankIndicator(iso3, WB_INDICATORS.IMPORTS_PERCENT_GDP),
      getWorldBankIndicator(iso3, WB_INDICATORS.FDI_NET_INFLOWS),
      getWorldBankIndicator(iso3, WB_INDICATORS.EXTERNAL_DEBT_PERCENT_GNI),
      getWorldBankIndicator(iso3, WB_INDICATORS.REMITTANCES_PERCENT_GDP),
      getWorldBankIndicator(iso3, WB_INDICATORS.LABOR_FORCE_PARTICIPATION),
      getWorldBankIndicator(iso3, WB_INDICATORS.EMPLOYMENT_AGRICULTURE),
      getWorldBankIndicator(iso3, WB_INDICATORS.EMPLOYMENT_INDUSTRY),
      getWorldBankIndicator(iso3, WB_INDICATORS.EMPLOYMENT_SERVICES),
      getWorldBankIndicator(iso3, WB_INDICATORS.ACCESS_TO_ELECTRICITY),
      getWorldBankIndicator(iso3, WB_INDICATORS.INTERNET_USERS),
      getWorldBankIndicator(iso3, WB_INDICATORS.MOBILE_SUBSCRIPTIONS),
      getWorldBankIndicator(iso3, WB_INDICATORS.URBAN_POPULATION),
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
        .reverse(); // 오래된 것부터 보여주기
    };

    const economyData = {
      gdp: {
        total: getLatestValue(gdpTotal),
        perCapita: getLatestValue(gdpPerCapita),
        growth: getLatestValue(gdpGrowth),
        growthTrend: getYearlyTrend(gdpGrowth),
      },
      income: {
        gniPerCapita: getLatestValue(gniPerCapita),
        giniIndex: getLatestValue(giniIndex),
        remittances: getLatestValue(remittances),
      },
      labor: {
        unemployment: getLatestValue(unemployment),
        laborParticipation: getLatestValue(laborParticipation),
        employmentBySection: {
          agriculture: getLatestValue(employmentAgriculture),
          industry: getLatestValue(employmentIndustry),
          services: getLatestValue(employmentServices),
        },
      },
      trade: {
        tradePercentGdp: getLatestValue(tradePercentGdp),
        exports: getLatestValue(exportsPercentGdp),
        imports: getLatestValue(importsPercentGdp),
        fdiNetInflows: getLatestValue(fdiNetInflows),
      },
      finance: {
        inflation: getLatestValue(inflation),
        inflationTrend: getYearlyTrend(inflation),
        externalDebt: getLatestValue(externalDebt),
      },
      infrastructure: {
        accessElectricity: getLatestValue(accessElectricity),
        internetUsers: getLatestValue(internetUsers),
        mobileSubscriptions: getLatestValue(mobileSubscriptions),
        urbanPopulation: getLatestValue(urbanPopulation),
      },
    };

    console.log('Economy API Response for', iso3, ':', JSON.stringify(economyData, null, 2));
    
    return NextResponse.json({
      success: true,
      data: economyData,
    });

  } catch (error: any) {
    console.error('Error fetching economy data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

