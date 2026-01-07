// MongoDB 기부 단체 서비스
import { connectToDatabase } from '@/lib/mongodb';
import { CharityDocument } from '@/types/charity';

const COLLECTION_NAME = 'charities';

/**
 * 기부 단체 추가 또는 업데이트
 */
export async function upsertCharity(charity: Omit<CharityDocument, 'createdAt' | 'updatedAt'>) {
  const { db } = await connectToDatabase();
  const collection = db.collection<CharityDocument>(COLLECTION_NAME);

  const now = new Date();
  
  const result = await collection.updateOne(
    { ein: charity.ein },
    {
      $set: {
        ...charity,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true }
  );

  return result;
}

/**
 * 여러 기부 단체 일괄 추가/업데이트
 */
export async function bulkUpsertCharities(charities: Omit<CharityDocument, 'createdAt' | 'updatedAt'>[]) {
  const { db } = await connectToDatabase();
  const collection = db.collection<CharityDocument>(COLLECTION_NAME);

  const now = new Date();
  
  const operations = charities.map(charity => ({
    updateOne: {
      filter: { ein: charity.ein },
      update: {
        $set: {
          ...charity,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      upsert: true,
    },
  }));

  if (operations.length === 0) return { modifiedCount: 0, upsertedCount: 0 };

  const result = await collection.bulkWrite(operations);
  return result;
}

/**
 * 모든 기부 단체 조회
 */
export async function getAllCharities(options?: {
  limit?: number;
  skip?: number;
  sortBy?: 'name' | 'transparencyScore' | 'rating' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}) {
  const { db } = await connectToDatabase();
  const collection = db.collection<CharityDocument>(COLLECTION_NAME);

  const {
    limit = 100,
    skip = 0,
    sortBy = 'transparencyScore',
    sortOrder = 'desc',
  } = options || {};

  const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const charities = await collection
    .find({})
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();

  return charities;
}

/**
 * 국가별 기부 단체 조회
 */
export async function getCharitiesByCountry(iso3: string) {
  const { db } = await connectToDatabase();
  const collection = db.collection<CharityDocument>(COLLECTION_NAME);

  const charities = await collection
    .find({ regions: iso3.toUpperCase() })
    .sort({ transparencyScore: -1 })
    .toArray();

  return charities;
}

/**
 * 카테고리별 기부 단체 조회
 */
export async function getCharitiesByCategory(category: string) {
  const { db } = await connectToDatabase();
  const collection = db.collection<CharityDocument>(COLLECTION_NAME);

  const charities = await collection
    .find({ category: category })
    .sort({ transparencyScore: -1 })
    .toArray();

  return charities;
}

/**
 * 기부 단체 검색
 */
export async function searchCharities(query: string, options?: {
  limit?: number;
  countries?: string[]; // ISO3 codes
  categories?: string[];
}) {
  const { db } = await connectToDatabase();
  const collection = db.collection<CharityDocument>(COLLECTION_NAME);

  const { limit = 50, countries, categories } = options || {};

  const filter: any = {
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { nameKo: { $regex: query, $options: 'i' } },
      { searchKeywords: { $regex: query, $options: 'i' } },
    ],
  };

  // 국가 필터
  if (countries && countries.length > 0) {
    filter.regions = { $in: countries.map(c => c.toUpperCase()) };
  }

  // 카테고리 필터
  if (categories && categories.length > 0) {
    filter.category = { $in: categories };
  }

  const charities = await collection
    .find(filter)
    .sort({ transparencyScore: -1 })
    .limit(limit)
    .toArray();

  return charities;
}

/**
 * EIN으로 기부 단체 조회
 */
export async function getCharityByEIN(ein: string) {
  const { db } = await connectToDatabase();
  const collection = db.collection<CharityDocument>(COLLECTION_NAME);

  const charity = await collection.findOne({ ein });
  return charity;
}

/**
 * 기부 단체 통계
 */
export async function getCharityStats() {
  const { db } = await connectToDatabase();
  const collection = db.collection<CharityDocument>(COLLECTION_NAME);

  const stats = await collection.aggregate([
    {
      $facet: {
        total: [{ $count: 'count' }],
        byCategory: [
          { $unwind: '$category' },
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        byCountry: [
          { $unwind: '$regions' },
          { $group: { _id: '$regions', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ],
        averageTransparency: [
          {
            $group: {
              _id: null,
              avg: { $avg: '$transparencyScore' },
            },
          },
        ],
      },
    },
  ]).toArray();

  return stats[0];
}

