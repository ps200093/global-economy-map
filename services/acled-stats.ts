/**
 * ACLED 통계 데이터 서비스
 * MongoDB에서 통계 조회
 */

import { connectToDatabase } from '../lib/mongodb';
import { ACLEDYearlyStats, ACLEDMonthlyStats } from '../types/acled-stats';

/**
 * 국가별 연도별 통계 조회
 */
export async function getYearlyStatsByCountry(
  country?: string,
  iso3?: string,
  startYear?: number,
  endYear?: number
): Promise<ACLEDYearlyStats[]> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<ACLEDYearlyStats>('ACLEDYearlyStats');
    
    const filter: any = {};
    
    if (country) {
      filter.country = { $regex: country, $options: 'i' };
    }
    
    if (iso3) {
      filter.iso3 = iso3.toUpperCase();
    }
    
    if (startYear || endYear) {
      filter.year = {};
      if (startYear) filter.year.$gte = startYear;
      if (endYear) filter.year.$lte = endYear;
    }
    
    const stats = await collection
      .find(filter)
      .sort({ year: -1 })
      .toArray();
    
    return stats;
    
  } catch (error) {
    console.error('연도별 통계 조회 실패:', error);
    return [];
  }
}

/**
 * 국가별 월별 통계 조회
 */
export async function getMonthlyStatsByCountry(
  country?: string,
  iso3?: string,
  year?: number
): Promise<ACLEDMonthlyStats[]> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<ACLEDMonthlyStats>('ACLEDMonthlyStats');
    
    const filter: any = {};
    
    if (country) {
      filter.country = { $regex: country, $options: 'i' };
    }
    
    if (iso3) {
      filter.iso3 = iso3.toUpperCase();
    }
    
    if (year) {
      filter.year = year;
    }
    
    const stats = await collection
      .find(filter)
      .sort({ year: -1, monthNumber: -1 })
      .toArray();
    
    return stats;
    
  } catch (error) {
    console.error('월별 통계 조회 실패:', error);
    return [];
  }
}

/**
 * 특정 국가의 최근 N년 통계 조회
 */
export async function getRecentYearlyStats(
  iso3: string,
  years: number = 5
): Promise<ACLEDYearlyStats[]> {
  const currentYear = new Date().getFullYear();
  return getYearlyStatsByCountry(
    undefined,
    iso3,
    currentYear - years,
    currentYear
  );
}

/**
 * 특정 연도의 전체 국가 통계 (위험 순위)
 */
export async function getCountriesRankedByViolence(
  year: number,
  limit: number = 50
): Promise<ACLEDYearlyStats[]> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<ACLEDYearlyStats>('ACLEDYearlyStats');
    
    const stats = await collection
      .find({ year })
      .sort({ totalFatalities: -1 })
      .limit(limit)
      .toArray();
    
    return stats;
    
  } catch (error) {
    console.error('국가별 순위 조회 실패:', error);
    return [];
  }
}

/**
 * 특정 국가의 트렌드 분석 (연도별)
 */
export async function getCountryTrend(
  iso3: string,
  startYear: number,
  endYear: number
): Promise<{
  country: string;
  iso3: string;
  years: number[];
  politicalViolence: number[];
  totalFatalities: number[];
  civilianFatalities: number[];
  demonstrations: number[];
}> {
  const stats = await getYearlyStatsByCountry(undefined, iso3, startYear, endYear);
  
  // 연도순 정렬
  stats.sort((a, b) => a.year - b.year);
  
  return {
    country: stats[0]?.country || '',
    iso3: iso3.toUpperCase(),
    years: stats.map(s => s.year),
    politicalViolence: stats.map(s => s.politicalViolenceEvents || 0),
    totalFatalities: stats.map(s => s.totalFatalities || 0),
    civilianFatalities: stats.map(s => s.civilianFatalities || 0),
    demonstrations: stats.map(s => s.demonstrations || 0),
  };
}

/**
 * 특정 국가의 월별 트렌드 (특정 연도)
 */
export async function getCountryMonthlyTrend(
  iso3: string,
  year: number
): Promise<{
  country: string;
  iso3: string;
  year: number;
  months: string[];
  politicalViolence: number[];
}> {
  const stats = await getMonthlyStatsByCountry(undefined, iso3, year);
  
  // 월순 정렬
  stats.sort((a, b) => a.monthNumber - b.monthNumber);
  
  return {
    country: stats[0]?.country || '',
    iso3: iso3.toUpperCase(),
    year,
    months: stats.map(s => s.month),
    politicalViolence: stats.map(s => s.politicalViolenceEvents),
  };
}

/**
 * 전체 통계 요약 (특정 연도)
 */
export async function getGlobalYearlyStats(year: number): Promise<{
  year: number;
  totalCountries: number;
  totalPoliticalViolence: number;
  totalFatalities: number;
  totalCivilianFatalities: number;
  totalDemonstrations: number;
  topCountries: ACLEDYearlyStats[];
}> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<ACLEDYearlyStats>('ACLEDYearlyStats');
    
    const [summary, topCountries] = await Promise.all([
      // 전체 합계
      collection.aggregate([
        { $match: { year } },
        {
          $group: {
            _id: null,
            totalCountries: { $sum: 1 },
            totalPoliticalViolence: { $sum: '$politicalViolenceEvents' },
            totalFatalities: { $sum: '$totalFatalities' },
            totalCivilianFatalities: { $sum: '$civilianFatalities' },
            totalDemonstrations: { $sum: '$demonstrations' },
          }
        }
      ]).toArray(),
      
      // 상위 10개 국가
      collection
        .find({ year })
        .sort({ totalFatalities: -1 })
        .limit(10)
        .toArray()
    ]);
    
    const stats = summary[0] || {
      totalCountries: 0,
      totalPoliticalViolence: 0,
      totalFatalities: 0,
      totalCivilianFatalities: 0,
      totalDemonstrations: 0,
    };
    
    return {
      year,
      ...stats,
      topCountries,
    };
    
  } catch (error) {
    console.error('전체 통계 조회 실패:', error);
    return {
      year,
      totalCountries: 0,
      totalPoliticalViolence: 0,
      totalFatalities: 0,
      totalCivilianFatalities: 0,
      totalDemonstrations: 0,
      topCountries: [],
    };
  }
}

/**
 * 지역별 통계 비교 (특정 연도)
 */
export async function compareCountries(
  iso3Codes: string[],
  year: number
): Promise<ACLEDYearlyStats[]> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<ACLEDYearlyStats>('ACLEDYearlyStats');
    
    const stats = await collection
      .find({
        iso3: { $in: iso3Codes.map(c => c.toUpperCase()) },
        year
      })
      .toArray();
    
    return stats;
    
  } catch (error) {
    console.error('국가 비교 실패:', error);
    return [];
  }
}

/**
 * 시위 활동이 가장 많은 국가 (특정 연도)
 */
export async function getTopDemonstrationCountries(
  year: number,
  limit: number = 20
): Promise<ACLEDYearlyStats[]> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<ACLEDYearlyStats>('ACLEDYearlyStats');
    
    const stats = await collection
      .find({ year, demonstrations: { $gt: 0 } })
      .sort({ demonstrations: -1 })
      .limit(limit)
      .toArray();
    
    return stats;
    
  } catch (error) {
    console.error('시위 국가 순위 조회 실패:', error);
    return [];
  }
}

/**
 * 민간인 피해가 가장 큰 국가 (특정 연도)
 */
export async function getTopCivilianCasualtyCountries(
  year: number,
  limit: number = 20
): Promise<ACLEDYearlyStats[]> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<ACLEDYearlyStats>('ACLEDYearlyStats');
    
    const stats = await collection
      .find({ year, civilianFatalities: { $gt: 0 } })
      .sort({ civilianFatalities: -1 })
      .limit(limit)
      .toArray();
    
    return stats;
    
  } catch (error) {
    console.error('민간인 피해 국가 순위 조회 실패:', error);
    return [];
  }
}

/**
 * 연도별 전세계 트렌드
 */
export async function getGlobalTrend(
  startYear: number,
  endYear: number
): Promise<{
  years: number[];
  politicalViolence: number[];
  totalFatalities: number[];
  civilianFatalities: number[];
  demonstrations: number[];
}> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<ACLEDYearlyStats>('ACLEDYearlyStats');
    
    const stats = await collection.aggregate([
      {
        $match: {
          year: { $gte: startYear, $lte: endYear }
        }
      },
      {
        $group: {
          _id: '$year',
          totalPoliticalViolence: { $sum: '$politicalViolenceEvents' },
          totalFatalities: { $sum: '$totalFatalities' },
          totalCivilianFatalities: { $sum: '$civilianFatalities' },
          totalDemonstrations: { $sum: '$demonstrations' },
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    return {
      years: stats.map(s => s._id),
      politicalViolence: stats.map(s => s.totalPoliticalViolence || 0),
      totalFatalities: stats.map(s => s.totalFatalities || 0),
      civilianFatalities: stats.map(s => s.totalCivilianFatalities || 0),
      demonstrations: stats.map(s => s.totalDemonstrations || 0),
    };
    
  } catch (error) {
    console.error('전세계 트렌드 조회 실패:', error);
    return {
      years: [],
      politicalViolence: [],
      totalFatalities: [],
      civilianFatalities: [],
      demonstrations: [],
    };
  }
}

export default {
  getYearlyStatsByCountry,
  getMonthlyStatsByCountry,
  getRecentYearlyStats,
  getCountriesRankedByViolence,
  getCountryTrend,
  getCountryMonthlyTrend,
  getGlobalYearlyStats,
  compareCountries,
  getTopDemonstrationCountries,
  getTopCivilianCasualtyCountries,
  getGlobalTrend,
};

