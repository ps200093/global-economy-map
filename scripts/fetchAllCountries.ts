// 전 세계 국가 데이터 수집 스크립트
// 사용법: node scripts/fetchAllCountries.js

import { ALL_COUNTRIES } from '../data/allCountries';
import { getMultipleIndicators, WB_INDICATORS } from '../services/worldbank';
import { calculateCountryScore } from '../utils/countryScoring';
import { getCountryBasicCollection } from '../lib/mongodb';
import { CountryScore } from '../types/country';

/**
 * 단일 국가 데이터 수집 및 점수 계산
 */
async function fetchCountryData(iso3: string): Promise<CountryScore | null> {
  try {
    console.log(`📊 Fetching data for ${iso3}...`);

    // World Bank 데이터 가져오기
    const wbData = await getMultipleIndicators(iso3, [
      WB_INDICATORS.GDP_PER_CAPITA,
      WB_INDICATORS.POVERTY_RATE,
      WB_INDICATORS.UNEMPLOYMENT,
      WB_INDICATORS.GINI_INDEX,
      WB_INDICATORS.LIFE_EXPECTANCY,
      WB_INDICATORS.MALNUTRITION,
      WB_INDICATORS.STUNTING,
      WB_INDICATORS.HEALTH_EXPENDITURE,
      WB_INDICATORS.LITERACY_RATE,
      WB_INDICATORS.EDUCATION_EXPENDITURE,
      WB_INDICATORS.FOOD_PRODUCTION,
      WB_INDICATORS.POPULATION,
    ]);

    // 국가 기본 정보
    const countryInfo = ALL_COUNTRIES.find(c => c.iso3 === iso3);
    if (!countryInfo) {
      console.warn(`⚠️  Country ${iso3} not found in ALL_COUNTRIES`);
      return null;
    }

    // 지표 데이터 매핑
    const povertyRateRaw = wbData[WB_INDICATORS.POVERTY_RATE];
    const gdpPerCapita = wbData[WB_INDICATORS.GDP_PER_CAPITA];
    const giniIndex = wbData[WB_INDICATORS.GINI_INDEX];
    
    // 빈곤율 추정: API에서 null일 때만 GDP 기반 추정 (0은 실제 값으로 유지)
    let estimatedPovertyRate = povertyRateRaw;
    if (povertyRateRaw === null) {
      if (gdpPerCapita !== null && gdpPerCapita > 0) {
        // GDP per capita 기반 빈곤율 추정 (로그 스케일, 소수점 2자리)
        // 공식: poverty_rate = max(0.1, 100 * e^(-0.0003 * GDP))
        // $1,000 ≈ 74%, $5,000 ≈ 22%, $10,000 ≈ 5%, $20,000 ≈ 0.25%, $50,000 ≈ 0.00%
        const calculatedRate = 100 * Math.exp(-0.0003 * gdpPerCapita);
        estimatedPovertyRate = Math.max(0.10, Math.round(calculatedRate * 100) / 100); // 최소 0.1%, 소수점 2자리
        
        console.log(`   ⚠️  빈곤율 데이터 없음, GDP 기반 추정: ${estimatedPovertyRate.toFixed(2)}% (GDP: $${gdpPerCapita.toFixed(0)})`);
      } else {
        // GDP 데이터도 없으면 null 유지
        estimatedPovertyRate = null;
      }
    }
    
    const indicators = {
      povertyRate: estimatedPovertyRate,
      giniIndex: giniIndex,
      gdpPerCapita: gdpPerCapita,
      unemploymentRate: wbData[WB_INDICATORS.UNEMPLOYMENT],
      lifeExpectancy: wbData[WB_INDICATORS.LIFE_EXPECTANCY],
      malnutritionRate: wbData[WB_INDICATORS.MALNUTRITION],
      stuntingRate: wbData[WB_INDICATORS.STUNTING],
      healthExpenditure: wbData[WB_INDICATORS.HEALTH_EXPENDITURE],
      literacyRate: wbData[WB_INDICATORS.LITERACY_RATE],
      educationExpenditure: wbData[WB_INDICATORS.EDUCATION_EXPENDITURE],
      foodProductionIndex: wbData[WB_INDICATORS.FOOD_PRODUCTION],
      population: wbData[WB_INDICATORS.POPULATION],
    };

    // 점수 계산
    const countryScore = calculateCountryScore(countryInfo, indicators);

    console.log(`✅ ${iso3}: Score ${countryScore.scores.overall.toFixed(1)} (${countryScore.urgencyLevel})`);
    return countryScore;

  } catch (error) {
    console.error(`❌ Error fetching ${iso3}:`, error);
    return null;
  }
}

/**
 * 전체 국가 데이터 수집 (배치 처리)
 */
async function fetchAllCountriesData(batchSize: number = 5): Promise<CountryScore[]> {
  const results: CountryScore[] = [];
  const total = ALL_COUNTRIES.length;

  console.log(`\n🌍 Starting data collection for ${total} countries...\n`);

  // 배치 단위로 처리 (API 레이트 리밋 고려)
  for (let i = 0; i < total; i += batchSize) {
    const batch = ALL_COUNTRIES.slice(i, i + batchSize);
    console.log(`\n📦 Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(total / batchSize)}`);
    
    const batchPromises = batch.map(country => fetchCountryData(country.iso3));
    const batchResults = await Promise.all(batchPromises);
    
    // null 제거
    const validResults = batchResults.filter((r): r is CountryScore => r !== null);
    results.push(...validResults);

    // API 레이트 리밋 방지를 위한 대기
    if (i + batchSize < total) {
      console.log('⏳ Waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log(`\n✅ Data collection complete! ${results.length}/${total} countries processed.\n`);
  return results;
}

/**
 * MongoDB에 저장
 */
async function saveToMongoDB(countries: CountryScore[]): Promise<void> {
  try {
    const collection = await getCountryBasicCollection();

    console.log('💾 Saving to MongoDB...');

    // 인덱스 생성
    await collection.createIndex({ iso3: 1 }, { unique: true });
    await collection.createIndex({ 'scores.overall': -1 }); // 점수순 정렬용
    await collection.createIndex({ urgencyLevel: 1 }); // 긴급도별 필터링용
    await collection.createIndex({ region: 1 }); // 지역별 필터링용

    // Upsert (존재하면 업데이트, 없으면 삽입)
    const operations = countries.map(country => ({
      updateOne: {
        filter: { iso3: country.iso3 },
        update: { $set: country },
        upsert: true,
      },
    }));

    const result = await collection.bulkWrite(operations);

    console.log(`✅ MongoDB saved: ${result.upsertedCount} inserted, ${result.modifiedCount} updated`);
    
    // 통계 출력
    const stats = {
      critical: countries.filter(c => c.urgencyLevel === 'critical').length,
      high: countries.filter(c => c.urgencyLevel === 'high').length,
      medium: countries.filter(c => c.urgencyLevel === 'medium').length,
      low: countries.filter(c => c.urgencyLevel === 'low').length,
      stable: countries.filter(c => c.urgencyLevel === 'stable').length,
    };

    console.log('\n📊 Urgency Level Distribution:');
    console.log(`  🔴 Critical: ${stats.critical}`);
    console.log(`  🟠 High: ${stats.high}`);
    console.log(`  🟡 Medium: ${stats.medium}`);
    console.log(`  🟢 Low: ${stats.low}`);
    console.log(`  ⚪ Stable: ${stats.stable}`);

  } catch (error) {
    console.error('❌ MongoDB save error:', error);
    throw error;
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  try {
    // 1. 전체 국가 데이터 수집
    const countries = await fetchAllCountriesData(5); // 배치 크기: 5

    if (countries.length === 0) {
      console.error('❌ No data collected!');
      process.exit(1);
    }

    // 2. MongoDB에 저장
    await saveToMongoDB(countries);

    console.log('\n✅ All done! Data is ready in MongoDB.\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  main();
}

export { fetchCountryData, fetchAllCountriesData, saveToMongoDB };

