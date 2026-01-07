/**
 * ACLED (Armed Conflict Location & Event Data) 서비스
 * MongoDB에서 데이터 조회
 */

import { connectToDatabase } from '../lib/mongodb';
import { 
  ACLEDEventDocument, 
  ACLEDQueryParams, 
  ACLEDAggregation,
  ACLEDCountryStats 
} from '../types/acled';
import { ACLEDEvent } from '@/types/api';

/**
 * ACLED 이벤트 조회 (필터링 지원)
 */
export async function getACLEDEvents(params: ACLEDQueryParams = {}): Promise<ACLEDEvent[]> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<ACLEDEventDocument>('ACLEDEvents');
    
    // 필터 구성
    const filter: any = {};
    
    if (params.country) {
      filter.country = { $regex: params.country, $options: 'i' };
    }
    
    if (params.iso3) {
      filter.iso3 = params.iso3.toUpperCase();
    }
    
    if (params.region) {
      filter.region = { $regex: params.region, $options: 'i' };
    }
    
    if (params.eventType) {
      if (Array.isArray(params.eventType)) {
        filter.event_type = { $in: params.eventType };
      } else {
        filter.event_type = params.eventType;
      }
    }
    
    // 날짜 범위 (weekStart 기준)
    if (params.startDate || params.endDate) {
      filter.weekStart = {};
      if (params.startDate) {
        filter.weekStart.$gte = params.startDate;
      }
      if (params.endDate) {
        filter.weekStart.$lte = params.endDate;
      }
    }
    
    // 사망자 수 범위
    if (params.minFatalities !== undefined || params.maxFatalities !== undefined) {
      filter.fatalities = {};
      if (params.minFatalities !== undefined) {
        filter.fatalities.$gte = params.minFatalities;
      }
      if (params.maxFatalities !== undefined) {
        filter.fatalities.$lte = params.maxFatalities;
      }
    }
    
    // 경계 상자 (bounding box) 필터
    if (params.bbox) {
      const [west, south, east, north] = params.bbox;
      filter.longitude = { $gte: west, $lte: east };
      filter.latitude = { $gte: south, $lte: north };
    }
    
    // 정렬
    const sortField = params.sortBy === 'fatalities' ? 'fatalities' : 'weekStart';
    const sortOrder = params.sortOrder === 'asc' ? 1 : -1;
    
    // 페이징
    const limit = params.limit || 500;
    const offset = params.offset || 0;
    
    // 쿼리 실행
    const documents = await collection
      .find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(offset)
      .limit(limit)
      .toArray();
    
    // ACLEDEvent 타입으로 변환
    return documents.map(doc => convertToACLEDEvent(doc));
    
  } catch (error) {
    console.error('ACLED 이벤트 조회 실패:', error);
    return [];
  }
}

/**
 * 특정 국가의 ACLED 데이터 조회
 */
export async function getConflictData(
  country?: string,
  startDate?: string,
  endDate?: string,
  limit: number = 500
): Promise<ACLEDEvent[]> {
  return getACLEDEvents({
    country,
    startDate,
    endDate,
    limit,
    sortBy: 'date',
    sortOrder: 'desc'
  });
}

/**
 * ISO3 코드로 ACLED 데이터 조회
 */
export async function getConflictDataByISO3(
  iso3: string,
  startDate?: string,
  endDate?: string,
  limit: number = 500
): Promise<ACLEDEvent[]> {
  return getACLEDEvents({
    iso3,
    startDate,
    endDate,
    limit,
    sortBy: 'date',
    sortOrder: 'desc'
  });
}

/**
 * 국가별 ACLED 통계 조회 (주간 집계 데이터 기반)
 */
export async function getACLEDStatsByCountry(
  iso3?: string,
  year?: number
): Promise<ACLEDCountryStats[]> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<ACLEDEventDocument>('ACLEDEvents');
    
    const matchStage: any = {};
    if (iso3) {
      matchStage.iso3 = iso3.toUpperCase();
    }
    if (year) {
      matchStage.year = year;
    }
    
    const pipeline: any[] = [
      { $match: matchStage },
      {
        $group: {
          _id: {
            country: '$country',
            iso3: '$iso3',
            year: '$year'
          },
          totalEvents: { $sum: '$events' }, // events 필드를 합산
          totalFatalities: { $sum: '$fatalities' },
          civilianFatalities: {
            $sum: {
              $cond: [
                { $eq: ['$event_type', 'Violence against civilians'] },
                '$fatalities',
                0
              ]
            }
          },
          battles: {
            $sum: {
              $cond: [{ $eq: ['$event_type', 'Battles'] }, '$events', 0]
            }
          },
          violenceAgainstCivilians: {
            $sum: {
              $cond: [{ $eq: ['$event_type', 'Violence against civilians'] }, '$events', 0]
            }
          },
          explosions: {
            $sum: {
              $cond: [{ $eq: ['$event_type', 'Explosions/Remote violence'] }, '$events', 0]
            }
          },
          protests: {
            $sum: {
              $cond: [{ $eq: ['$event_type', 'Protests'] }, '$events', 0]
            }
          },
          riots: {
            $sum: {
              $cond: [{ $eq: ['$event_type', 'Riots'] }, '$events', 0]
            }
          },
          strategicDevelopments: {
            $sum: {
              $cond: [{ $eq: ['$event_type', 'Strategic developments'] }, '$events', 0]
            }
          },
          avgLat: { $avg: '$latitude' },
          avgLon: { $avg: '$longitude' },
        }
      },
      {
        $project: {
          _id: 0,
          country: '$_id.country',
          iso3: '$_id.iso3',
          year: '$_id.year',
          totalEvents: 1,
          totalFatalities: 1,
          civilianFatalities: 1,
          eventsByType: {
            battles: '$battles',
            violenceAgainstCivilians: '$violenceAgainstCivilians',
            explosions: '$explosions',
            protests: '$protests',
            riots: '$riots',
            strategicDevelopments: '$strategicDevelopments',
          },
          centerLocation: {
            type: 'Point',
            coordinates: ['$avgLon', '$avgLat']
          },
          lastUpdated: new Date()
        }
      },
      { $sort: { totalEvents: -1 } }
    ];
    
    const stats = await collection.aggregate(pipeline).toArray();
    return stats as ACLEDCountryStats[];
    
  } catch (error) {
    console.error('ACLED 통계 조회 실패:', error);
    return [];
  }
}

/**
 * 최근 ACLED 이벤트 조회
 */
export async function getRecentACLEDEvents(
  limit: number = 100,
  daysBack: number = 30
): Promise<ACLEDEvent[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);
  
  return getACLEDEvents({
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    limit,
    sortBy: 'date',
    sortOrder: 'desc'
  });
}

/**
 * 이벤트 타입별 집계
 */
export async function getACLEDEventsByType(
  countryOrIso3?: string,
  startDate?: string,
  endDate?: string
): Promise<Record<string, number>> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<ACLEDEventDocument>('ACLEDEvents');
    
    const matchStage: any = {};
    if (countryOrIso3) {
      // ISO3 코드인지 국가명인지 판단 (3글자면 ISO3로 가정)
      if (countryOrIso3.length === 3) {
        matchStage.iso3 = countryOrIso3.toUpperCase();
      } else {
        matchStage.country = { $regex: countryOrIso3, $options: 'i' };
      }
    }
    if (startDate || endDate) {
      matchStage.weekStart = {};
      if (startDate) matchStage.weekStart.$gte = startDate;
      if (endDate) matchStage.weekStart.$lte = endDate;
    }
    
    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$event_type',
          count: { $sum: '$events' } // events 필드 합산
        }
      }
    ];
    
    const results = await collection.aggregate(pipeline).toArray();
    
    const eventTypes: Record<string, number> = {};
    results.forEach(r => {
      eventTypes[r._id] = r.count;
    });
    
    return eventTypes;
    
  } catch (error) {
    console.error('이벤트 타입별 집계 실패:', error);
    return {};
  }
}

/**
 * 전체 ACLED 통계
 */
export async function getACLEDGlobalStats(): Promise<ACLEDAggregation> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<ACLEDEventDocument>('ACLEDEvents');
    
    const [stats, dateRange, eventTypes] = await Promise.all([
      // 전체 통계 (events 필드 합산)
      collection.aggregate([
        {
          $group: {
            _id: null,
            totalEvents: { $sum: '$events' },
            totalFatalities: { $sum: '$fatalities' },
            countries: { $addToSet: '$country' }
          }
        }
      ]).toArray(),
      
      // 날짜 범위
      collection.aggregate([
        {
          $group: {
            _id: null,
            minDate: { $min: '$weekStart' },
            maxDate: { $max: '$weekEnd' }
          }
        }
      ]).toArray(),
      
      // 이벤트 타입별
      collection.aggregate([
        {
          $group: {
            _id: '$event_type',
            count: { $sum: '$events' }
          }
        }
      ]).toArray()
    ]);
    
    const eventTypeMap: Record<string, number> = {};
    eventTypes.forEach(et => {
      eventTypeMap[et._id] = et.count;
    });
    
    return {
      country: 'Global',
      totalEvents: stats[0]?.totalEvents || 0,
      totalFatalities: stats[0]?.totalFatalities || 0,
      eventTypes: eventTypeMap,
      dateRange: {
        start: dateRange[0]?.minDate || '',
        end: dateRange[0]?.maxDate || ''
      }
    };
    
  } catch (error) {
    console.error('전체 통계 조회 실패:', error);
    return {
      country: 'Global',
      totalEvents: 0,
      totalFatalities: 0,
      eventTypes: {},
      dateRange: { start: '', end: '' }
    };
  }
}

/**
 * MongoDB 문서를 ACLEDEvent 타입으로 변환
 * 주간 집계 데이터를 개별 이벤트 형식으로 변환
 */
function convertToACLEDEvent(doc: ACLEDEventDocument): ACLEDEvent {
  return {
    event_id_cnty: `${doc.iso3 || doc.country}_${doc.week}_${doc.acled_id}`,
    event_date: doc.weekStart, // 주의 시작일을 이벤트 날짜로 사용
    year: doc.year,
    event_type: doc.event_type,
    sub_event_type: doc.sub_event_type,
    country: doc.country,
    region: doc.region,
    latitude: doc.latitude,
    longitude: doc.longitude,
    fatalities: doc.fatalities,
    notes: `${doc.events}개 이벤트 (${doc.disorder_type}), 주간 집계: ${doc.weekStart} ~ ${doc.weekEnd}`,
  };
}

/**
 * 국가별 최근 1년 이벤트 수 조회
 */
export async function getCountryEventCount(iso3: string): Promise<number> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<ACLEDEventDocument>('ACLEDEvents');
    
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const startDate = oneYearAgo.toISOString().split('T')[0];
    
    // 주간 집계된 events 필드를 합산
    const result = await collection.aggregate([
      {
        $match: {
          iso3: iso3.toUpperCase(),
          weekStart: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalEvents: { $sum: '$events' }
        }
      }
    ]).toArray();
    
    return result[0]?.totalEvents || 0;
    
  } catch (error) {
    console.error('국가별 이벤트 수 조회 실패:', error);
    return 0;
  }
}

/**
 * 국가별 최근 사망자 수 조회
 */
export async function getCountryFatalities(
  iso3: string,
  daysBack: number = 365
): Promise<number> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<ACLEDEventDocument>('ACLEDEvents');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    const dateStr = startDate.toISOString().split('T')[0];
    
    const result = await collection.aggregate([
      {
        $match: {
          iso3: iso3.toUpperCase(),
          weekStart: { $gte: dateStr }
        }
      },
      {
        $group: {
          _id: null,
          totalFatalities: { $sum: '$fatalities' }
        }
      }
    ]).toArray();
    
    return result[0]?.totalFatalities || 0;
    
  } catch (error) {
    console.error('국가별 사망자 수 조회 실패:', error);
    return 0;
  }
}

export default {
  getACLEDEvents,
  getConflictData,
  getConflictDataByISO3,
  getACLEDStatsByCountry,
  getRecentACLEDEvents,
  getACLEDEventsByType,
  getACLEDGlobalStats,
  getCountryEventCount,
  getCountryFatalities,
};



