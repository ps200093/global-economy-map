import { NextResponse } from 'next/server';
import { getCharityFinancials } from '@/services/charity-financials';
import { EnhancedCharityOrganization } from '@/types/api';

// 주요 기부 단체 EIN 목록 (미국 기반 단체)
const CHARITY_EINS = [
  { ein: '131623861', id: 'unicef', name: 'UNICEF USA' },
  { ein: '135562162', id: 'doctors-without-borders', name: 'Doctors Without Borders USA' },
  { ein: '133433452', id: 'save-the-children', name: 'Save the Children Federation' },
  { ein: '237255087', id: 'feeding-america', name: 'Feeding America' },
  { ein: '135562162', id: 'international-rescue', name: 'International Rescue Committee' },
];

// 기본 기부 단체 정보 (EIN이 없는 국제 기구)
const INTERNATIONAL_CHARITIES: Partial<EnhancedCharityOrganization>[] = [
  {
    id: 'wfp',
    name: 'WFP (세계식량계획)',
    description: '기아 해결과 식량 안보 증진을 위한 유엔의 주도 기관',
    transparencyScore: 93,
    rating: 4.7,
    focusAreas: ['기아/식량부족', '빈곤'],
    website: 'https://www.wfp.org',
    donationLink: 'https://www.wfp.org/support-us/donate',
    certifications: ['UN 공식 기관', '노벨평화상 수상'],
    foundedYear: 1961,
  },
  {
    id: 'unhcr',
    name: 'UNHCR (유엔난민기구)',
    description: '난민과 실향민을 보호하고 지원하는 유엔 기관',
    transparencyScore: 94,
    rating: 4.7,
    focusAreas: ['난민', '빈곤', '전쟁/분쟁'],
    website: 'https://www.unhcr.org',
    donationLink: 'https://donate.unhcr.org',
    certifications: ['UN 공식 기관', 'Charity Navigator 4-Star'],
    foundedYear: 1950,
  },
  {
    id: 'red-cross',
    name: '국제적십자사',
    description: '인도적 위기 상황에서 긴급 구호와 재난 대응을 제공',
    transparencyScore: 90,
    rating: 4.4,
    focusAreas: ['보건/의료', '빈곤', '자연재해', '난민'],
    website: 'https://www.icrc.org',
    donationLink: 'https://www.icrc.org/en/donate',
    certifications: ['노벨평화상 수상', 'UN Official Partner'],
    foundedYear: 1863,
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const region = searchParams.get('region');

    // 미국 기반 단체들의 재무 데이터 가져오기
    const usCharities = await Promise.all(
      CHARITY_EINS.map(async ({ ein, id, name }) => {
        try {
          const financials = await getCharityFinancials(ein);
          
          if (financials) {
            return {
              id,
              ein,
              name: financials.name || name,
              description: financials.mission || `${name}에서 전 세계 취약 계층을 지원합니다`,
              transparencyScore: financials.transparency_rating || 85,
              rating: 4.5,
              focusAreas: ['빈곤', '보건/의료', '교육'],
              website: `https://www.${id.replace(/-/g, '')}.org`,
              donationLink: `https://www.${id.replace(/-/g, '')}.org/donate`,
              financialData: {
                totalRevenue: financials.total_revenue,
                programExpenses: financials.program_expenses,
                adminExpenses: financials.admin_expenses,
                fundraisingExpenses: financials.fundraising_expenses,
                totalAssets: financials.total_assets,
                totalLiabilities: financials.total_liabilities,
              },
              certifications: ['IRS Verified', 'Tax Exempt'],
              foundedYear: 1900,
              lastUpdated: new Date().toISOString(),
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching charity ${ein}:`, error);
          return null;
        }
      })
    );

    // null 값 필터링
    const validUSCharities = usCharities.filter(c => c !== null);

    // 국제 기구 추가
    const allCharities = [
      ...validUSCharities,
      ...INTERNATIONAL_CHARITIES.map(charity => ({
        ...charity,
        lastUpdated: new Date().toISOString(),
      })),
    ];

    // 필터링 적용
    let filteredCharities = allCharities;

    if (category) {
      filteredCharities = filteredCharities.filter(charity =>
        charity.focusAreas?.some(area =>
          area.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    if (region) {
      // 지역별 필터링 로직 (추후 구현)
      // filteredCharities = filteredCharities.filter(...)
    }

    return NextResponse.json({
      success: true,
      data: filteredCharities,
      count: filteredCharities.length,
      filters: {
        category: category || null,
        region: region || null,
      },
    });
  } catch (error) {
    console.error('Error fetching charities data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch charities data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// 특정 기부 단체 상세 정보
export async function POST(request: Request) {
  try {
    const { ein } = await request.json();

    if (!ein) {
      return NextResponse.json(
        { success: false, error: 'EIN is required' },
        { status: 400 }
      );
    }

    const data = await getCharityFinancials(ein);

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Charity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching charity data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch charity data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

