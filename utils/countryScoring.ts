// 국가 취약도 점수 계산 유틸리티
import { 
  CountryScore, 
  SCORE_WEIGHTS, 
  URGENCY_THRESHOLDS, 
  MARKER_COLORS 
} from '@/types/country';

/**
 * 빈곤 점수 계산 (0-100, 높을수록 심각)
 */
export function calculatePovertyScore(indicators: CountryScore['indicators']): number {
  const scores: number[] = [];
  
  // 빈곤율 (0-100%)
  if (indicators.povertyRate !== undefined) {
    scores.push(Math.min(indicators.povertyRate, 100));
  }
  
  // 지니계수 (0-100, 높을수록 불평등)
  if (indicators.giniIndex !== undefined) {
    scores.push(indicators.giniIndex);
  }
  
  return scores.length > 0 
    ? scores.reduce((sum, s) => sum + s, 0) / scores.length 
    : 50; // 데이터 없을 시 중간값
}

/**
 * 경제 점수 계산 (0-100, 높을수록 심각)
 */
export function calculateEconomyScore(indicators: CountryScore['indicators']): number {
  const scores: number[] = [];
  
  // GDP per capita (역산: 낮을수록 심각)
  if (indicators.gdpPerCapita !== undefined) {
    // $20,000 이상 = 0점, $0 = 100점 (로그 스케일 사용)
    const gdpScore = Math.max(0, 100 - (Math.log(indicators.gdpPerCapita + 1) / Math.log(20000) * 100));
    scores.push(Math.min(gdpScore, 100));
  }
  
  // 실업률 (0-25%)
  if (indicators.unemploymentRate !== undefined) {
    const unemploymentScore = Math.min((indicators.unemploymentRate / 25) * 100, 100);
    scores.push(unemploymentScore);
  }
  
  return scores.length > 0 
    ? scores.reduce((sum, s) => sum + s, 0) / scores.length 
    : 50;
}

/**
 * 보건 점수 계산 (0-100, 높을수록 심각)
 */
export function calculateHealthScore(indicators: CountryScore['indicators']): number {
  const scores: number[] = [];
  
  // 기대수명 (역산: 낮을수록 심각)
  if (indicators.lifeExpectancy !== undefined) {
    // 85세 = 0점, 50세 = 100점
    const lifeExpectancyScore = Math.max(0, Math.min(100, ((85 - indicators.lifeExpectancy) / 35) * 100));
    scores.push(lifeExpectancyScore);
  }
  
  // 영양부족률 (0-60%)
  if (indicators.malnutritionRate !== undefined) {
    scores.push(Math.min((indicators.malnutritionRate / 60) * 100, 100));
  }
  
  // 발육부진률 (0-60%)
  if (indicators.stuntingRate !== undefined) {
    scores.push(Math.min((indicators.stuntingRate / 60) * 100, 100));
  }
  
  // 보건 지출 (역산: 낮을수록 심각)
  if (indicators.healthExpenditure !== undefined) {
    // 12% 이상 = 0점, 0% = 100점
    const healthExpScore = Math.max(0, Math.min(100, ((12 - indicators.healthExpenditure) / 12) * 100));
    scores.push(healthExpScore);
  }
  
  return scores.length > 0 
    ? scores.reduce((sum, s) => sum + s, 0) / scores.length 
    : 50;
}

/**
 * 교육 점수 계산 (0-100, 높을수록 심각)
 */
export function calculateEducationScore(indicators: CountryScore['indicators']): number {
  const scores: number[] = [];
  
  // 문해율 (역산: 낮을수록 심각)
  if (indicators.literacyRate !== undefined) {
    scores.push(100 - indicators.literacyRate);
  }
  
  // 교육 지출 (역산: 낮을수록 심각)
  if (indicators.educationExpenditure !== undefined) {
    // 7% 이상 = 0점, 0% = 100점
    const eduExpScore = Math.max(0, (7 - indicators.educationExpenditure) / 0.07);
    scores.push(Math.min(eduExpScore, 100));
  }
  
  return scores.length > 0 
    ? scores.reduce((sum, s) => sum + s, 0) / scores.length 
    : 50;
}

/**
 * 식량 안보 점수 계산 (0-100, 높을수록 심각)
 */
export function calculateFoodSecurityScore(indicators: CountryScore['indicators']): number {
  const scores: number[] = [];
  
  // 식량 생산 지수 (역산: 낮을수록 심각)
  if (indicators.foodProductionIndex !== undefined) {
    // 120 이상 = 0점, 70 이하 = 100점
    const foodScore = Math.max(0, Math.min(100, ((120 - indicators.foodProductionIndex) / 50) * 100));
    scores.push(foodScore);
  }
  
  // 영양부족률도 고려
  if (indicators.malnutritionRate !== undefined) {
    scores.push(Math.min((indicators.malnutritionRate / 60) * 100, 100));
  }
  
  return scores.length > 0 
    ? scores.reduce((sum, s) => sum + s, 0) / scores.length 
    : 50;
}

/**
 * 종합 점수 계산 (가중 평균) - 스케일 조정
 */
export function calculateOverallScore(scores: {
  poverty: number;
  economy: number;
  health: number;
  education: number;
  foodSecurity: number;
}): number {
  const weightedScore = (
    scores.poverty * SCORE_WEIGHTS.poverty +
    scores.economy * SCORE_WEIGHTS.economy +
    scores.health * SCORE_WEIGHTS.health +
    scores.education * SCORE_WEIGHTS.education +
    scores.foodSecurity * SCORE_WEIGHTS.foodSecurity
  );
  
  // 스케일 조정: 1.5배 증폭 (최대 100점으로 제한)
  return Math.min(weightedScore * 1.5, 100);
}

/**
 * 종합 점수로 긴급도 레벨 결정
 */
export function determineUrgencyLevel(overallScore: number): CountryScore['urgencyLevel'] {
  if (overallScore >= URGENCY_THRESHOLDS.critical) return 'critical';
  if (overallScore >= URGENCY_THRESHOLDS.high) return 'high';
  if (overallScore >= URGENCY_THRESHOLDS.medium) return 'medium';
  if (overallScore >= URGENCY_THRESHOLDS.low) return 'low';
  return 'stable';
}

/**
 * 긴급도 레벨로 마커 색상 결정
 */
export function getMarkerColor(urgencyLevel: CountryScore['urgencyLevel']): string {
  return MARKER_COLORS[urgencyLevel];
}

/**
 * 접근성 레벨 결정 (점수 기반)
 */
export function determineAccessLevel(score: number): 'Critical' | 'Low' | 'Medium' | 'High' {
  if (score >= 75) return 'Critical';
  if (score >= 50) return 'Low';
  if (score >= 25) return 'Medium';
  return 'High';
}

/**
 * 추천 지원 분야 결정 (점수 기반, 상위 3개)
 */
export function determineRecommendedSupport(scores: CountryScore['scores']): string[] {
  const supportAreas: { area: string; score: number }[] = [
    { area: 'Emergency Relief', score: scores.poverty * 0.5 + scores.health * 0.5 },
    { area: 'Clean Water Infrastructure', score: scores.health * 0.6 + scores.foodSecurity * 0.4 },
    { area: 'Education Programs', score: scores.education },
    { area: 'Healthcare Services', score: scores.health },
    { area: 'Food Security', score: scores.foodSecurity * 0.7 + scores.poverty * 0.3 },
    { area: 'Economic Development', score: scores.economy * 0.6 + scores.poverty * 0.4 },
  ];
  
  // 점수 높은 순으로 정렬하고 상위 3개 선택
  return supportAreas
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.area);
}

/**
 * 데이터 품질 점수 계산 (사용 가능한 지표 비율)
 */
export function calculateDataQuality(indicators: CountryScore['indicators']): number {
  const totalFields = 11; // 총 지표 개수
  let availableFields = 0;
  
  if (indicators.povertyRate !== undefined) availableFields++;
  if (indicators.giniIndex !== undefined) availableFields++;
  if (indicators.gdpPerCapita !== undefined) availableFields++;
  if (indicators.unemploymentRate !== undefined) availableFields++;
  if (indicators.lifeExpectancy !== undefined) availableFields++;
  if (indicators.malnutritionRate !== undefined) availableFields++;
  if (indicators.stuntingRate !== undefined) availableFields++;
  if (indicators.healthExpenditure !== undefined) availableFields++;
  if (indicators.literacyRate !== undefined) availableFields++;
  if (indicators.educationExpenditure !== undefined) availableFields++;
  if (indicators.foodProductionIndex !== undefined) availableFields++;
  
  return (availableFields / totalFields) * 100;
}

/**
 * 전체 국가 점수 계산 (World Bank 데이터로부터)
 */
export function calculateCountryScore(
  basicInfo: {
    iso3: string;
    name: string;
    nameKo: string;
    region: string;
    coordinates: [number, number];
  },
  indicators: CountryScore['indicators']
): CountryScore {
  // 개별 점수 계산
  const poverty = calculatePovertyScore(indicators);
  const economy = calculateEconomyScore(indicators);
  const health = calculateHealthScore(indicators);
  const education = calculateEducationScore(indicators);
  const foodSecurity = calculateFoodSecurityScore(indicators);
  
  const scores = { poverty, economy, health, education, foodSecurity };
  
  // 종합 점수 및 긴급도
  const overall = calculateOverallScore(scores);
  const urgencyLevel = determineUrgencyLevel(overall);
  const markerColor = getMarkerColor(urgencyLevel);
  
  // 접근성 레벨
  const accessLevels = {
    education: determineAccessLevel(education),
    water: determineAccessLevel(health * 0.5 + foodSecurity * 0.5),
    healthcare: determineAccessLevel(health),
    foodSecurity: determineAccessLevel(foodSecurity),
  };
  
  // 추천 지원 분야
  const recommendedSupport = determineRecommendedSupport({ ...scores, overall });
  
  // 데이터 품질
  const dataQuality = calculateDataQuality(indicators);
  
  return {
    ...basicInfo,
    indicators,
    scores: { ...scores, overall },
    urgencyLevel,
    markerColor,
    accessLevels,
    recommendedSupport,
    dataQuality,
    lastUpdated: new Date(),
    source: 'World Bank API',
  };
}

