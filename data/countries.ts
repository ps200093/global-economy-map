// 주요 국가 데이터 (좌표 및 기본 정보)
import { CountryData } from '@/types';

/**
 * 주요 모니터링 국가 목록
 */
export const PRIORITY_COUNTRIES: CountryData[] = [
  {
    id: 'gha',
    name: 'Ghana',
    nameKo: '가나',
    iso3: 'GHA',
    coordinates: [7.9465, -1.0232], // Accra
    indicators: {
      poverty: 23.4,
      educationAccess: 'Medium',
      waterStability: 'Low',
      healthcareAccess: 'Medium',
      foodSecurity: 'Medium',
    },
    recommendedSupport: ['Clean Water Infrastructure', 'Education Programs'],
    suggestedNGOs: [
      {
        id: 'wateraid',
        name: 'WaterAid',
        transparencyScore: 92,
        focusArea: 'Clean Water Infrastructure',
        donationLink: 'https://www.wateraid.org/donate',
      },
      {
        id: 'charity-water',
        name: 'charity:water',
        transparencyScore: 89,
        focusArea: 'Clean Water Infrastructure',
        donationLink: 'https://www.charitywater.org/donate',
      },
    ],
    urgencyLevel: 'medium',
    population: 31072945,
    gdpPerCapita: 2363,
    unemploymentRate: 4.5,
  },
  {
    id: 'nga',
    name: 'Nigeria',
    nameKo: '나이지리아',
    iso3: 'NGA',
    coordinates: [9.0820, 8.6753], // Abuja
    indicators: {
      poverty: 40.1,
      educationAccess: 'Low',
      waterStability: 'Low',
      healthcareAccess: 'Low',
      foodSecurity: 'Medium',
    },
    recommendedSupport: ['Education Programs', 'Clean Water Infrastructure', 'Healthcare Services'],
    suggestedNGOs: [
      {
        id: 'save-the-children',
        name: 'Save the Children',
        transparencyScore: 88,
        focusArea: 'Education Programs',
        donationLink: 'https://www.savethechildren.org/donate',
      },
      {
        id: 'doctors-without-borders',
        name: 'Doctors Without Borders',
        transparencyScore: 91,
        focusArea: 'Healthcare Services',
        donationLink: 'https://www.doctorswithoutborders.org/donate',
      },
    ],
    urgencyLevel: 'high',
    population: 206139587,
    gdpPerCapita: 2097,
    unemploymentRate: 33.3,
  },
  {
    id: 'eth',
    name: 'Ethiopia',
    nameKo: '에티오피아',
    iso3: 'ETH',
    coordinates: [9.0320, 38.7469], // Addis Ababa
    indicators: {
      poverty: 23.5,
      educationAccess: 'Low',
      waterStability: 'Critical',
      healthcareAccess: 'Low',
      foodSecurity: 'Critical',
    },
    recommendedSupport: ['Food Security', 'Clean Water Infrastructure', 'Emergency Relief'],
    suggestedNGOs: [
      {
        id: 'wfp',
        name: 'World Food Programme',
        transparencyScore: 94,
        focusArea: 'Food Security',
        donationLink: 'https://www.wfp.org/support-us/donate',
      },
      {
        id: 'oxfam',
        name: 'Oxfam',
        transparencyScore: 87,
        focusArea: 'Emergency Relief',
        donationLink: 'https://www.oxfam.org/donate',
      },
    ],
    urgencyLevel: 'critical',
    population: 114963583,
    gdpPerCapita: 936,
    unemploymentRate: 3.2,
  },
  {
    id: 'yem',
    name: 'Yemen',
    nameKo: '예멘',
    iso3: 'YEM',
    coordinates: [15.5527, 48.5164], // Sana'a
    indicators: {
      poverty: 48.6,
      educationAccess: 'Critical',
      waterStability: 'Critical',
      healthcareAccess: 'Critical',
      foodSecurity: 'Critical',
    },
    recommendedSupport: ['Emergency Relief', 'Food Security', 'Healthcare Services'],
    suggestedNGOs: [
      {
        id: 'unicef',
        name: 'UNICEF',
        transparencyScore: 93,
        focusArea: 'Emergency Relief',
        donationLink: 'https://www.unicef.org/donate',
      },
      {
        id: 'islamic-relief',
        name: 'Islamic Relief',
        transparencyScore: 86,
        focusArea: 'Food Security',
        donationLink: 'https://www.islamic-relief.org/donate',
      },
    ],
    urgencyLevel: 'critical',
    population: 29825968,
    gdpPerCapita: 824,
  },
  {
    id: 'ind',
    name: 'India',
    nameKo: '인도',
    iso3: 'IND',
    coordinates: [28.6139, 77.2090], // New Delhi
    indicators: {
      poverty: 21.9,
      educationAccess: 'Medium',
      waterStability: 'Medium',
      healthcareAccess: 'Medium',
      foodSecurity: 'Medium',
    },
    recommendedSupport: ['Education Programs', 'Healthcare Services'],
    suggestedNGOs: [
      {
        id: 'smile-foundation',
        name: 'Smile Foundation',
        transparencyScore: 85,
        focusArea: 'Education Programs',
        donationLink: 'https://www.smilefoundationindia.org/donate',
      },
      {
        id: 'give-india',
        name: 'GiveIndia',
        transparencyScore: 88,
        focusArea: 'Healthcare Services',
        donationLink: 'https://www.giveindia.org/donate',
      },
    ],
    urgencyLevel: 'medium',
    population: 1380004385,
    gdpPerCapita: 2277,
    unemploymentRate: 7.9,
  },
  {
    id: 'bgd',
    name: 'Bangladesh',
    nameKo: '방글라데시',
    iso3: 'BGD',
    coordinates: [23.8103, 90.4125], // Dhaka
    indicators: {
      poverty: 24.3,
      educationAccess: 'Medium',
      waterStability: 'Low',
      healthcareAccess: 'Low',
      foodSecurity: 'Medium',
    },
    recommendedSupport: ['Clean Water Infrastructure', 'Healthcare Services'],
    suggestedNGOs: [
      {
        id: 'brac',
        name: 'BRAC',
        transparencyScore: 90,
        focusArea: 'Healthcare Services',
        donationLink: 'https://www.brac.net/donate',
      },
      {
        id: 'grameen-foundation',
        name: 'Grameen Foundation',
        transparencyScore: 87,
        focusArea: 'Economic Development',
        donationLink: 'https://www.grameenfoundation.org/donate',
      },
    ],
    urgencyLevel: 'medium',
    population: 164689383,
    gdpPerCapita: 2457,
    unemploymentRate: 5.3,
  },
  {
    id: 'hti',
    name: 'Haiti',
    nameKo: '아이티',
    iso3: 'HTI',
    coordinates: [18.5944, -72.3074], // Port-au-Prince
    indicators: {
      poverty: 58.5,
      educationAccess: 'Critical',
      waterStability: 'Critical',
      healthcareAccess: 'Critical',
      foodSecurity: 'Critical',
    },
    recommendedSupport: ['Emergency Relief', 'Food Security', 'Clean Water Infrastructure'],
    suggestedNGOs: [
      {
        id: 'partners-in-health',
        name: 'Partners In Health',
        transparencyScore: 91,
        focusArea: 'Healthcare Services',
        donationLink: 'https://www.pih.org/donate',
      },
      {
        id: 'hope-for-haiti',
        name: 'Hope for Haiti',
        transparencyScore: 84,
        focusArea: 'Education Programs',
        donationLink: 'https://www.hopeforhaiti.org/donate',
      },
    ],
    urgencyLevel: 'critical',
    population: 11402533,
    gdpPerCapita: 1815,
    unemploymentRate: 14.6,
  },
  {
    id: 'afg',
    name: 'Afghanistan',
    nameKo: '아프가니스탄',
    iso3: 'AFG',
    coordinates: [34.5553, 69.2075], // Kabul
    indicators: {
      poverty: 54.5,
      educationAccess: 'Critical',
      waterStability: 'Low',
      healthcareAccess: 'Critical',
      foodSecurity: 'Critical',
    },
    recommendedSupport: ['Emergency Relief', 'Food Security', 'Healthcare Services'],
    suggestedNGOs: [
      {
        id: 'afghanaid',
        name: 'AfghanAid',
        transparencyScore: 86,
        focusArea: 'Emergency Relief',
        donationLink: 'https://www.afghanaid.org.uk/donate',
      },
      {
        id: 'care',
        name: 'CARE International',
        transparencyScore: 89,
        focusArea: 'Food Security',
        donationLink: 'https://www.care.org/donate',
      },
    ],
    urgencyLevel: 'critical',
    population: 38928341,
    gdpPerCapita: 507,
  },
  {
    id: 'syr',
    name: 'Syria',
    nameKo: '시리아',
    iso3: 'SYR',
    coordinates: [33.5138, 36.2765], // Damascus
    indicators: {
      poverty: 90.0,
      educationAccess: 'Critical',
      waterStability: 'Critical',
      healthcareAccess: 'Critical',
      foodSecurity: 'Critical',
    },
    recommendedSupport: ['Emergency Relief', 'Food Security', 'Healthcare Services'],
    suggestedNGOs: [
      {
        id: 'mercy-corps',
        name: 'Mercy Corps',
        transparencyScore: 88,
        focusArea: 'Emergency Relief',
        donationLink: 'https://www.mercycorps.org/donate',
      },
      {
        id: 'msf',
        name: 'Médecins Sans Frontières',
        transparencyScore: 92,
        focusArea: 'Healthcare Services',
        donationLink: 'https://www.msf.org/donate',
      },
    ],
    urgencyLevel: 'critical',
    population: 17500657,
    gdpPerCapita: 870,
  },
  {
    id: 'gtm',
    name: 'Guatemala',
    nameKo: '과테말라',
    iso3: 'GTM',
    coordinates: [14.6349, -90.5069], // Guatemala City
    indicators: {
      poverty: 59.3,
      educationAccess: 'Low',
      waterStability: 'Medium',
      healthcareAccess: 'Low',
      foodSecurity: 'Low',
    },
    recommendedSupport: ['Education Programs', 'Food Security', 'Healthcare Services'],
    suggestedNGOs: [
      {
        id: 'child-aid',
        name: 'Child Aid',
        transparencyScore: 87,
        focusArea: 'Education Programs',
        donationLink: 'https://www.childaid.org/donate',
      },
      {
        id: 'food-for-the-poor',
        name: 'Food For The Poor',
        transparencyScore: 85,
        focusArea: 'Food Security',
        donationLink: 'https://www.foodforthepoor.org/donate',
      },
    ],
    urgencyLevel: 'high',
    population: 16858333,
    gdpPerCapita: 4603,
    unemploymentRate: 2.4,
  },
];

/**
 * ISO3 코드로 국가 찾기
 */
export function getCountryByISO3(iso3: string): CountryData | undefined {
  return PRIORITY_COUNTRIES.find(c => c.iso3 === iso3);
}

/**
 * ID로 국가 찾기
 */
export function getCountryById(id: string): CountryData | undefined {
  return PRIORITY_COUNTRIES.find(c => c.id === id);
}

/**
 * 긴급도별 국가 필터링
 */
export function getCountriesByUrgency(level: 'critical' | 'high' | 'medium' | 'low'): CountryData[] {
  return PRIORITY_COUNTRIES.filter(c => c.urgencyLevel === level);
}

