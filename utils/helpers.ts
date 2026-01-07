import { RegionData, GlobalStats } from '@/types';

export const calculateGlobalStats = (regions: RegionData[]): GlobalStats => {
  const totalPopulationInPoverty = regions.reduce((acc, region) => {
    return acc + (region.population * region.povertyRate) / 100;
  }, 0);

  const averagePovertyRate = regions.reduce((acc, region) => acc + region.povertyRate, 0) / regions.length;

  const totalFundingNeeded = regions.reduce((acc, region) => {
    return acc + region.issues.reduce((sum, issue) => sum + issue.fundingNeeded, 0);
  }, 0);

  const regionsInCrisis = regions.filter(r => r.urgencyLevel === 'critical' || r.urgencyLevel === 'high').length;

  return {
    totalPopulationInPoverty,
    averagePovertyRate,
    totalFundingNeeded,
    regionsInCrisis,
  };
};

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  } else if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  } else if (num >= 1) {
    return num.toFixed(2);
  }
  return num.toFixed(2);
};

export const formatCurrency = (amount: number): string => {
  return `$${formatNumber(amount)}`;
};

export const getUrgencyColor = (level: 'critical' | 'high' | 'medium' | 'low' | 'stable'): string => {
  switch (level) {
    case 'critical':
      return '#dc2626'; // red-600
    case 'high':
      return '#ea580c'; // orange-600
    case 'medium':
      return '#eab308'; // yellow-500
    case 'low':
      return '#22c55e'; // green-500
    case 'stable':
      return '#9ca3af'; // gray-400
    default:
      return '#6b7280'; // gray-500
  }
};

export const getIssueColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    // English categories
    'Poverty': '#dc2626',
    'Unemployment': '#ea580c',
    'Food Shortage': '#f59e0b',
    'Food': '#f59e0b',
    'Education': '#3b82f6',
    'Health': '#8b5cf6',
    'Infrastructure': '#06b6d4',
    'Environment': '#10b981',
    'Climate': '#10b981',
    'Refugee': '#9333ea',
    'Disaster Relief': '#f97316',
    'Human Rights': '#ec4899',
    'Economic Development': '#0ea5e9',
    'Water & Sanitation': '#06b6d4',
    'Women Rights': '#f43f5e',
    'Child Welfare': '#6366f1',
    'Animal Welfare': '#84cc16',
    'Disability Support': '#14b8a6',
    'Culture': '#a855f7',
    'Agriculture': '#22c55e',
    'Housing': '#64748b',
    'Sports': '#3b82f6',
    'Ocean': '#0891b2',
    'Democracy': '#7c3aed',
    'Nutrition': '#eab308',
  };
  return colors[type] || '#6b7280';
};

export const getRatingStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
};

/**
 * ISO3를 ISO2로 변환
 */
export function iso3ToIso2(iso3: string): string {
  const map: Record<string, string> = {
    'AFG': 'AF', 'ALB': 'AL', 'DZA': 'DZ', 'AND': 'AD', 'AGO': 'AO',
    'ATG': 'AG', 'ARG': 'AR', 'ARM': 'AM', 'AUS': 'AU', 'AUT': 'AT',
    'AZE': 'AZ', 'BHS': 'BS', 'BHR': 'BH', 'BGD': 'BD', 'BRB': 'BB',
    'BLR': 'BY', 'BEL': 'BE', 'BLZ': 'BZ', 'BEN': 'BJ', 'BTN': 'BT',
    'BOL': 'BO', 'BIH': 'BA', 'BWA': 'BW', 'BRA': 'BR', 'BRN': 'BN',
    'BGR': 'BG', 'BFA': 'BF', 'BDI': 'BI', 'CPV': 'CV', 'KHM': 'KH',
    'CMR': 'CM', 'CAN': 'CA', 'CAF': 'CF', 'TCD': 'TD', 'CHL': 'CL',
    'CHN': 'CN', 'COL': 'CO', 'COM': 'KM', 'COG': 'CG', 'COD': 'CD',
    'CRI': 'CR', 'CIV': 'CI', 'HRV': 'HR', 'CUB': 'CU', 'CYP': 'CY',
    'CZE': 'CZ', 'DNK': 'DK', 'DJI': 'DJ', 'DMA': 'DM', 'DOM': 'DO',
    'ECU': 'EC', 'EGY': 'EG', 'SLV': 'SV', 'GNQ': 'GQ', 'ERI': 'ER',
    'EST': 'EE', 'SWZ': 'SZ', 'ETH': 'ET', 'FJI': 'FJ', 'FIN': 'FI',
    'FRA': 'FR', 'GAB': 'GA', 'GMB': 'GM', 'GEO': 'GE', 'DEU': 'DE',
    'GHA': 'GH', 'GRC': 'GR', 'GRD': 'GD', 'GTM': 'GT', 'GIN': 'GN',
    'GNB': 'GW', 'GUY': 'GY', 'HTI': 'HT', 'HND': 'HN', 'HUN': 'HU',
    'ISL': 'IS', 'IND': 'IN', 'IDN': 'ID', 'IRN': 'IR', 'IRQ': 'IQ',
    'IRL': 'IE', 'ISR': 'IL', 'ITA': 'IT', 'JAM': 'JM', 'JPN': 'JP',
    'JOR': 'JO', 'KAZ': 'KZ', 'KEN': 'KE', 'KIR': 'KI', 'PRK': 'KP',
    'KOR': 'KR', 'KWT': 'KW', 'KGZ': 'KG', 'LAO': 'LA', 'LVA': 'LV',
    'LBN': 'LB', 'LSO': 'LS', 'LBR': 'LR', 'LBY': 'LY', 'LIE': 'LI',
    'LTU': 'LT', 'LUX': 'LU', 'MDG': 'MG', 'MWI': 'MW', 'MYS': 'MY',
    'MDV': 'MV', 'MLI': 'ML', 'MLT': 'MT', 'MHL': 'MH', 'MRT': 'MR',
    'MUS': 'MU', 'MEX': 'MX', 'FSM': 'FM', 'MDA': 'MD', 'MCO': 'MC',
    'MNG': 'MN', 'MNE': 'ME', 'MAR': 'MA', 'MOZ': 'MZ', 'MMR': 'MM',
    'NAM': 'NA', 'NRU': 'NR', 'NPL': 'NP', 'NLD': 'NL', 'NZL': 'NZ',
    'NIC': 'NI', 'NER': 'NE', 'NGA': 'NG', 'MKD': 'MK', 'NOR': 'NO',
    'OMN': 'OM', 'PAK': 'PK', 'PLW': 'PW', 'PSE': 'PS', 'PAN': 'PA',
    'PNG': 'PG', 'PRY': 'PY', 'PER': 'PE', 'PHL': 'PH', 'POL': 'PL',
    'PRT': 'PT', 'QAT': 'QA', 'ROU': 'RO', 'RUS': 'RU', 'RWA': 'RW',
    'KNA': 'KN', 'LCA': 'LC', 'VCT': 'VC', 'WSM': 'WS', 'SMR': 'SM',
    'STP': 'ST', 'SAU': 'SA', 'SEN': 'SN', 'SRB': 'RS', 'SYC': 'SC',
    'SLE': 'SL', 'SGP': 'SG', 'SVK': 'SK', 'SVN': 'SI', 'SLB': 'SB',
    'SOM': 'SO', 'ZAF': 'ZA', 'SSD': 'SS', 'ESP': 'ES', 'LKA': 'LK',
    'SDN': 'SD', 'SUR': 'SR', 'SWE': 'SE', 'CHE': 'CH', 'SYR': 'SY',
    'TWN': 'TW', 'TJK': 'TJ', 'TZA': 'TZ', 'THA': 'TH', 'TLS': 'TL',
    'TGO': 'TG', 'TON': 'TO', 'TTO': 'TT', 'TUN': 'TN', 'TUR': 'TR',
    'TKM': 'TM', 'TUV': 'TV', 'UGA': 'UG', 'UKR': 'UA', 'ARE': 'AE',
    'GBR': 'GB', 'USA': 'US', 'URY': 'UY', 'UZB': 'UZ', 'VUT': 'VU',
    'VAT': 'VA', 'VEN': 'VE', 'VNM': 'VN', 'YEM': 'YE', 'ZMB': 'ZM',
    'ZWE': 'ZW'
  };
  return map[iso3.toUpperCase()] || '';
}

/**
 * 국기 이미지 URL 가져오기
 */
export function getCountryFlagUrl(iso3: string, size: 'w20' | 'w40' | 'w80' | 'w160' = 'w40'): string {
  const iso2 = iso3ToIso2(iso3);
  if (!iso2) return '';
  return `https://flagcdn.com/${size}/${iso2.toLowerCase()}.png`;
}

