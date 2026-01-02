// MongoDB 연결 설정
import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'economy';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongoClientCache {
  client: MongoClient | null;
  db: Db | null;
  promise: Promise<{ client: MongoClient; db: Db }> | null;
}

// Global MongoDB 연결 캐시 (개발 환경에서 hot reload 시 연결 재사용)
let cached: MongoClientCache = (global as any).mongo;

if (!cached) {
  cached = (global as any).mongo = {
    client: null,
    db: null,
    promise: null,
  };
}

/**
 * MongoDB 연결 (싱글톤 패턴)
 */
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db };
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts)
      .then((client) => {
        const db = client.db(MONGODB_DB);
        console.log(`✅ MongoDB Connected: ${MONGODB_DB}`);
        return { client, db };
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    const { client, db } = await cached.promise;
    cached.client = client;
    cached.db = db;
    return { client, db };
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

/**
 * 컬렉션 가져오기
 */
export async function getCollection(collectionName: string) {
  const { db } = await connectToDatabase();
  return db.collection(collectionName);
}

/**
 * CountryBasic 컬렉션
 */
export async function getCountryBasicCollection() {
  return getCollection('CountryBasic');
}

/**
 * 연결 종료 (서버 종료 시)
 */
export async function closeDatabase() {
  if (cached.client) {
    await cached.client.close();
    cached.client = null;
    cached.db = null;
    cached.promise = null;
    console.log('✅ MongoDB connection closed');
  }
}

