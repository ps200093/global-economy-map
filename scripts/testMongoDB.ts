// MongoDB 연결 테스트 스크립트
import { connectToDatabase, closeDatabase } from '../lib/mongodb';

async function testConnection() {
  try {
    console.log('🔌 MongoDB 연결 테스트 중...\n');

    const { db } = await connectToDatabase();
    
    console.log('✅ MongoDB 연결 성공!');
    console.log(`📦 데이터베이스: ${db.databaseName}`);
    
    // 컬렉션 목록 확인
    const collections = await db.listCollections().toArray();
    console.log(`\n📂 컬렉션 목록 (${collections.length}개):`);
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });

    // CountryBasic 컬렉션 확인
    const countryBasicExists = collections.some(col => col.name === 'CountryBasic');
    
    if (countryBasicExists) {
      const countryBasic = db.collection('CountryBasic');
      const count = await countryBasic.countDocuments();
      console.log(`\n🌍 CountryBasic 컬렉션: ${count}개 국가 데이터 존재`);
      
      if (count > 0) {
        // 샘플 데이터 조회
        const sample = await countryBasic.findOne();
        console.log('\n📊 샘플 데이터:');
        console.log(`  국가: ${sample?.name} (${sample?.iso3})`);
        console.log(`  점수: ${sample?.scores?.overall?.toFixed(1) || 'N/A'}`);
        console.log(`  긴급도: ${sample?.urgencyLevel || 'N/A'}`);
      }
    } else {
      console.log('\n⚠️  CountryBasic 컬렉션이 없습니다.');
      console.log('   데이터 수집 필요: npm run fetch-countries');
    }

    await closeDatabase();
    console.log('\n✅ 연결 테스트 완료!\n');
    process.exit(0);

  } catch (error: any) {
    console.error('\n❌ MongoDB 연결 실패:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 해결 방법:');
      console.log('   1. MongoDB가 실행 중인지 확인: mongosh');
      console.log('   2. 포트 확인: localhost:27017');
      console.log('   3. MongoDB 서비스 시작');
    }
    
    process.exit(1);
  }
}

testConnection();

