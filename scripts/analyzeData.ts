// 실제 데이터 분석 스크립트
import { getCountryBasicCollection } from '../lib/mongodb';
import { connectToDatabase, closeDatabase } from '../lib/mongodb';

async function analyzeData() {
  try {
    await connectToDatabase();
    const collection = await getCountryBasicCollection();

    // 전체 국가 조회
    const countries = await collection.find().toArray();

    console.log('\n📊 점수 분포 분석\n');

    // 점수 통계
    const scores = countries.map((c: any) => c.scores.overall).sort((a, b) => b - a);
    const indicators = countries.map((c: any) => c.indicators);

    console.log(`최고 점수: ${scores[0].toFixed(1)}`);
    console.log(`최저 점수: ${scores[scores.length - 1].toFixed(1)}`);
    console.log(`평균 점수: ${(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)}`);
    console.log(`중간값: ${scores[Math.floor(scores.length / 2)].toFixed(1)}`);

    // 상위 10개 취약 국가
    console.log('\n🔴 상위 10개 취약 국가:\n');
    const top10 = countries
      .sort((a: any, b: any) => b.scores.overall - a.scores.overall)
      .slice(0, 10);
    
    top10.forEach((c: any, i: number) => {
      console.log(`${i + 1}. ${c.name} (${c.iso3}): ${c.scores.overall.toFixed(1)}점`);
      console.log(`   빈곤: ${c.scores.poverty.toFixed(1)}, 경제: ${c.scores.economy.toFixed(1)}, 보건: ${c.scores.health.toFixed(1)}`);
      console.log(`   빈곤율: ${c.indicators.povertyRate || 'N/A'}%, GDP: $${c.indicators.gdpPerCapita || 'N/A'}`);
    });

    // 지표별 실제 값 범위 확인
    console.log('\n📈 지표 실제 값 범위:\n');
    
    const povertyRates = indicators.filter((i: any) => i.povertyRate).map((i: any) => i.povertyRate);
    const gdps = indicators.filter((i: any) => i.gdpPerCapita).map((i: any) => i.gdpPerCapita);
    const lifeExpectancies = indicators.filter((i: any) => i.lifeExpectancy).map((i: any) => i.lifeExpectancy);
    const malnutritions = indicators.filter((i: any) => i.malnutritionRate).map((i: any) => i.malnutritionRate);

    console.log(`빈곤율: ${Math.min(...povertyRates).toFixed(1)}% ~ ${Math.max(...povertyRates).toFixed(1)}%`);
    console.log(`GDP per capita: $${Math.min(...gdps).toFixed(0)} ~ $${Math.max(...gdps).toFixed(0)}`);
    console.log(`기대수명: ${Math.min(...lifeExpectancies).toFixed(1)}세 ~ ${Math.max(...lifeExpectancies).toFixed(1)}세`);
    console.log(`영양부족률: ${Math.min(...malnutritions).toFixed(1)}% ~ ${Math.max(...malnutritions).toFixed(1)}%`);

    // 데이터 품질 확인
    console.log('\n📊 데이터 품질:\n');
    const dataQualities = countries.map((c: any) => c.dataQuality).sort((a, b) => a - b);
    console.log(`평균 데이터 품질: ${(dataQualities.reduce((a, b) => a + b, 0) / dataQualities.length).toFixed(1)}%`);
    
    const lowQuality = countries.filter((c: any) => c.dataQuality < 50);
    console.log(`낮은 품질 (<50%): ${lowQuality.length}개 국가`);

    await closeDatabase();

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

analyzeData();

