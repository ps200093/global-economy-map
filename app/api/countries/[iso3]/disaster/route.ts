// API: 국가별 재난 데이터 (GDACS)
import { NextResponse } from 'next/server';
import { getDisasterAlerts } from '@/services/gdacs';

// ISO3 코드를 국가 이름으로 매핑 (GDACS API는 국가 이름 사용)
const ISO3_TO_NAME: Record<string, string> = {
  'USA': 'United States',
  'CHN': 'China',
  'JPN': 'Japan',
  'DEU': 'Germany',
  'IND': 'India',
  'GBR': 'United Kingdom',
  'FRA': 'France',
  'ITA': 'Italy',
  'BRA': 'Brazil',
  'CAN': 'Canada',
  'RUS': 'Russia',
  'KOR': 'Korea',
  'AUS': 'Australia',
  'ESP': 'Spain',
  'MEX': 'Mexico',
  'IDN': 'Indonesia',
  'NLD': 'Netherlands',
  'SAU': 'Saudi Arabia',
  'TUR': 'Turkey',
  'CHE': 'Switzerland',
  'POL': 'Poland',
  'BEL': 'Belgium',
  'SWE': 'Sweden',
  'IRN': 'Iran',
  'NOR': 'Norway',
  'AUT': 'Austria',
  'ARE': 'United Arab Emirates',
  'NGA': 'Nigeria',
  'ISR': 'Israel',
  'IRL': 'Ireland',
  'SGP': 'Singapore',
  'MYS': 'Malaysia',
  'PHL': 'Philippines',
  'VNM': 'Vietnam',
  'PAK': 'Pakistan',
  'BGD': 'Bangladesh',
  'EGY': 'Egypt',
  'ZAF': 'South Africa',
  'CHL': 'Chile',
  'COL': 'Colombia',
  'PER': 'Peru',
  'GHA': 'Ghana',
  'KEN': 'Kenya',
  'ETH': 'Ethiopia',
  'TZA': 'Tanzania',
  'UGA': 'Uganda',
  'AFG': 'Afghanistan',
  'IRQ': 'Iraq',
  'SYR': 'Syria',
  'YEM': 'Yemen',
  'JOR': 'Jordan',
  'LBN': 'Lebanon',
  'MMR': 'Myanmar',
  'THA': 'Thailand',
  'NPL': 'Nepal',
  'LKA': 'Sri Lanka',
  'UKR': 'Ukraine',
  'GRC': 'Greece',
  'PRT': 'Portugal',
  'CZE': 'Czech Republic',
  'ROU': 'Romania',
  'HUN': 'Hungary',
  'NZL': 'New Zealand',
  'ARG': 'Argentina',
  'VEN': 'Venezuela',
  'ECU': 'Ecuador',
  'GTM': 'Guatemala',
  'CUB': 'Cuba',
  'BOL': 'Bolivia',
  'DOM': 'Dominican Republic',
  'HTI': 'Haiti',
  'HND': 'Honduras',
  'NIC': 'Nicaragua',
  'PRY': 'Paraguay',
  'SLV': 'El Salvador',
  'CRI': 'Costa Rica',
  'PAN': 'Panama',
  'URY': 'Uruguay',
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ iso3: string }> }
) {
  try {
    const { iso3 } = await params;

    if (!iso3 || iso3.length !== 3) {
      return NextResponse.json(
        { success: false, error: 'Invalid ISO3 code' },
        { status: 400 }
      );
    }

    console.log(`\nFetching disaster data for: ${iso3}`);

    // ISO3를 국가 이름으로 변환
    const countryName = ISO3_TO_NAME[iso3.toUpperCase()];
    
    if (!countryName) {
      console.log(`Country name not found for ISO3: ${iso3}`);
    }

    // GDACS API에서 재난 데이터 가져오기
    const allAlerts = await getDisasterAlerts();
    console.log(`Total alerts fetched: ${allAlerts.length}`);

    // 국가 필터링 (ISO3 이름 또는 직접 매칭)
    const countryAlerts = allAlerts.filter(alert => {
      if (!alert.country) return false;
      const alertCountry = alert.country.toLowerCase();
      const targetCountry = (countryName || iso3).toLowerCase();
      return alertCountry.includes(targetCountry) || targetCountry.includes(alertCountry);
    });

    console.log(`Filtered alerts for ${iso3}: ${countryAlerts.length}`);

    // 통계 집계
    const stats = {
      total: countryAlerts.length,
      byType: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
      recent: countryAlerts.slice(0, 10),
    };

    countryAlerts.forEach(alert => {
      // 유형별 집계
      if (alert.eventtype) {
        stats.byType[alert.eventtype] = (stats.byType[alert.eventtype] || 0) + 1;
      }

      // 심각도별 집계
      if (alert.severity) {
        stats.bySeverity[alert.severity] = (stats.bySeverity[alert.severity] || 0) + 1;
      }
    });

    const disasterDataResponse = {
      stats,
      hasData: countryAlerts.length > 0,
    };

    return NextResponse.json({
      success: true,
      data: disasterDataResponse,
    });

  } catch (error: any) {
    console.error('Error fetching disaster data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

