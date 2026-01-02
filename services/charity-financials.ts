// 기부 단체 재무 분석 서비스
// IRS Form 990 데이터 기반 (ProPublica API)
import { CharityFinancials } from '@/types/api';

/**
 * ProPublica Nonprofit Explorer API
 * https://projects.propublica.org/nonprofits/api
 * 
 * 주의: API는 요약된 필드만 제공하며, 세부 비용 breakdown은 제공하지 않음
 */

const PROPUBLICA_API = 'https://projects.propublica.org/nonprofits/api/v2';

/**
 * EIN으로 기부 단체의 재무 정보를 가져옵니다
 * ProPublica API는 제한된 필드만 제공하므로 총액 기준으로만 분석
 */
export async function getCharityFinancials(ein: string): Promise<CharityFinancials | null> {
  try {
    // EIN 정규화 (숫자만 추출)
    const normalizedEin = ein.replace(/\D/g, '');
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`${PROPUBLICA_API}/organizations/${normalizedEin}.json`, {
      signal: controller.signal,
      next: { revalidate: 2592000 }, // 30일 캐시
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`ProPublica API returned ${response.status} for EIN: ${ein}`);
      return null;
    }

    const data = await response.json();
    
    if (!data.filings_with_data || data.filings_with_data.length === 0) {
      console.warn(`No filings data for EIN: ${ein}`);
      return null;
    }

    // 최신 filing 선택 (tax_prd 기준 정렬 - YYYYMM 형식)
    const sortedFilings = [...data.filings_with_data].sort((a, b) => {
      return (b.tax_prd || 0) - (a.tax_prd || 0);
    });

    const latestFiling = sortedFilings[0];
    const prevFiling = sortedFilings[1];

    // ProPublica API가 실제로 제공하는 필드만 사용
    const totalRevenue = latestFiling.totrevenue || 0;
    const totalExpenses = latestFiling.totfuncexpns || 0;
    const totalAssets = latestFiling.totassetsend || 0;
    const totalLiabilities = latestFiling.totliabend || 0;
    const contributions = latestFiling.totcntrbgfts || 0;
    const programRevenue = latestFiling.totprgmrevnue || 0;
    const investmentIncome = latestFiling.invstmntinc || 0;

    // 순자산 계산
    const netAssets = totalAssets - totalLiabilities;

    // 이전 연도 데이터
    const prevRevenue = prevFiling?.totrevenue || totalRevenue;
    const prevExpenses = prevFiling?.totfuncexpns || totalExpenses;

    const financials: CharityFinancials = {
      ein: normalizedEin,
      name: data.organization?.name || 'Unknown',
      year: latestFiling.tax_prd_yr || new Date().getFullYear(),
      
      revenue: {
        total: totalRevenue,
        contributions: contributions,
        programService: programRevenue,
        investment: investmentIncome,
      },
      
      expenses: {
        total: totalExpenses,
        // ProPublica API는 세부 비용 breakdown을 제공하지 않음
        program: 0, // 데이터 없음
        administration: 0, // 데이터 없음
        fundraising: 0, // 데이터 없음
      },
      
      assets: {
        total: totalAssets,
        net: netAssets,
      },
      
      metrics: calculateFinancialMetrics({
        totalRevenue,
        totalExpenses,
        netAssets,
        prevRevenue,
        prevExpenses,
      }),
    };

    return financials;
  } catch (error) {
    console.error('Error fetching charity financials:', error);
    return null;
  }
}

/**
 * 재무 효율성 지표 계산
 * ProPublica API 제한으로 인해 기본적인 지표만 계산 가능
 */
function calculateFinancialMetrics(data: {
  totalRevenue: number;
  totalExpenses: number;
  netAssets: number;
  prevRevenue: number;
  prevExpenses: number;
}) {
  const { totalRevenue, totalExpenses, netAssets, prevRevenue, prevExpenses } = data;
  
  return {
    // 세부 비용 breakdown 없음 - 모두 0으로 표시
    programExpenseRatio: 0,
    administrativeExpenseRatio: 0,
    fundraisingExpenseRatio: 0,
    
    // 계산 가능한 지표
    // 운영 효율성: 비용/수익 비율 (낮을수록 좋음, 목표: 85% 미만)
    operatingExpenseRatio: totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0,
    
    // 운영자본 비율: 순자산/연간 지출 (목표: 1-3년)
    workingCapitalRatio: totalExpenses > 0 ? netAssets / totalExpenses : 0,
    
    // 수익 성장률
    revenueGrowth: prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0,
    
    // 비용 증가율
    expenseGrowth: prevExpenses > 0 ? ((totalExpenses - prevExpenses) / prevExpenses) * 100 : 0,
  };
}

/**
 * 재무 건전성 등급 계산 (A+ ~ F)
 * ProPublica API 제한으로 인해 단순화된 평가
 */
export function calculateFinancialGrade(metrics: CharityFinancials['metrics']): string {
  let score = 0;

  // 운영 효율성 점수 (0-50점)
  // 비용/수익 비율이 낮을수록 효율적
  const opRatio = metrics.operatingExpenseRatio || 0;
  if (opRatio > 0 && opRatio < 70) score += 50;
  else if (opRatio < 80) score += 40;
  else if (opRatio < 90) score += 30;
  else if (opRatio < 100) score += 20;
  else score += 10;

  // 운영자본 비율 점수 (0-30점)
  const wcRatio = metrics.workingCapitalRatio || 0;
  if (wcRatio >= 1 && wcRatio <= 3) score += 30;
  else if (wcRatio >= 0.5 && wcRatio < 4) score += 20;
  else if (wcRatio >= 0.25) score += 10;
  else score += 5;

  // 수익 성장률 점수 (0-20점)
  const revGrowth = metrics.revenueGrowth || 0;
  if (revGrowth > 10) score += 20;
  else if (revGrowth > 5) score += 15;
  else if (revGrowth > 0) score += 10;
  else if (revGrowth > -5) score += 5;
  else score += 0;

  // 등급 부여 (단순화된 기준)
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'A-';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'B-';
  if (score >= 65) return 'C+';
  if (score >= 60) return 'C';
  if (score >= 55) return 'C-';
  if (score >= 50) return 'D';
  return 'F';
}
