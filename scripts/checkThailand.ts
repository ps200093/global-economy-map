// 태국 데이터 확인 스크립트
import { getCountryBasicCollection } from '../lib/mongodb';

async function checkThailand() {
  try {
    console.log('🔍 태국(THA) 데이터 확인 중...\n');
    
    const collection = await getCountryBasicCollection();
    const thailand = await collection.findOne({ iso3: 'THA' });
    
    if (!thailand) {
      console.log('❌ 태국 데이터를 찾을 수 없습니다.');
      process.exit(1);
    }
    
    console.log('✅ 태국 데이터 찾음!\n');
    console.log('=== 기본 정보 ===');
    console.log(`국가명: ${thailand.name} (${thailand.nameKo})`);
    console.log(`ISO3: ${thailand.iso3}`);
    console.log(`긴급도: ${thailand.urgencyLevel}`);
    console.log(`종합 점수: ${thailand.scores?.overall}\n`);
    
    console.log('=== Indicators 객체 전체 ===');
    console.log(JSON.stringify(thailand.indicators, null, 2));
    console.log('\n');
    
    console.log('=== 빈곤 관련 데이터 ===');
    console.log(`indicators.povertyRate: ${thailand.indicators?.povertyRate}`);
    console.log(`indicators.poverty: ${thailand.indicators?.poverty}`);
    console.log(`indicators.giniIndex: ${thailand.indicators?.giniIndex}\n`);
    
    console.log('=== Scores 객체 ===');
    console.log(JSON.stringify(thailand.scores, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

checkThailand();

