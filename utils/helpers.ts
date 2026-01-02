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
  }
  return num.toString();
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
    '빈곤': '#dc2626',
    '실업': '#ea580c',
    '식량 부족': '#f59e0b',
    '교육': '#3b82f6',
    '보건': '#8b5cf6',
    '인프라': '#06b6d4',
    '환경': '#10b981',
  };
  return colors[type] || '#6b7280';
};

export const getRatingStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
};

