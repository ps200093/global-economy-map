// API: 특정 국가 데이터 조회 (ISO3 코드)
import { NextResponse } from 'next/server';
import { getCountryBasicCollection } from '@/lib/mongodb';
import { CountryScore } from '@/types/country';

export async function GET(
  request: Request,
  { params }: { params: { iso3: string } }
) {
  try {
    const { iso3 } = params;

    if (!iso3 || iso3.length !== 3) {
      return NextResponse.json(
        { success: false, error: 'Invalid ISO3 code' },
        { status: 400 }
      );
    }

    const collection = await getCountryBasicCollection();
    const country = await collection.findOne({ 
      iso3: iso3.toUpperCase() 
    }) as unknown as CountryScore | null;

    if (!country) {
      return NextResponse.json(
        { success: false, error: 'Country not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: country,
    });

  } catch (error: any) {
    console.error('Error fetching country:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

