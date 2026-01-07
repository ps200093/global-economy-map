// 기부 단체 재무 분석 서비스
// IRS Form 990 데이터 기반 (ProPublica API)
import { CharityFinancials } from '@/types/api';

/**
 * ProPublica Nonprofit Explorer API
 * https://projects.propublica.org/nonprofits/api
 * 
 * 사용 가능한 필드:
 * - organization: name, address, city, state, zipcode, ntee_code, ruling_date
 * - filing: totrevenue, totfuncexpns, totassetsend, totliabend, totcntrbgfts, 
 *           totprgmrevnue, invstmntinc, compnsatncurrofcr, othrsalwages, 
 *           payrolltx, profndraising, pdf_url, tax_prd, tax_prd_yr
 */

const PROPUBLICA_API = 'https://projects.propublica.org/nonprofits/api/v2';

// 풍부한 재무 정보 타입
export interface EnhancedCharityFinancials {
  ein: string;
  name: string;
  year: number;
  taxPeriod?: string;
  pdfUrl?: string;
  
  // 단체 정보
  organization?: {
    address?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    nteeCode?: string;
    rulingDate?: string;
  };
  
  // 수입 상세
  revenue: {
    total: number;
    contributions: number; // 기부금
    programService: number; // 프로그램 수입
    investment: number; // 투자 수익
  };
  
  // 지출 상세
  expenses: {
    total: number;
    executiveCompensation: number; // 임원 보수
    salariesWages: number; // 직원 급여
    payrollTax: number; // 급여세
    fundraising: number; // 모금 비용
    // 계산된 값
    programExpenses?: number; // 프로그램 지출 추정
  };
  
  // 자산 상세
  assets: {
    total: number;
    liabilities: number;
    net: number;
  };
  
  // 효율성 지표
  metrics: {
    operatingExpenseRatio: number;
    programExpenseRatio: number;
    adminExpenseRatio: number;
    fundraisingRatio: number;
    workingCapitalRatio: number;
    revenueGrowth: number;
    expenseGrowth: number;
  };
  
  // 연도별 데이터 (트렌드)
  historicalData: {
    year: number;
    totalRevenue: number;
    totalExpenses: number;
    totalAssets: number;
    netAssets: number;
  }[];
}

/**
 * EIN으로 기부 단체의 풍부한 재무 정보를 가져옵니다
 */
export async function getEnhancedCharityFinancials(ein: string): Promise<EnhancedCharityFinancials | null> {
  try {
    const normalizedEin = ein.replace(/\D/g, '');
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

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
    const org = data.organization;

    // 수입 관련
    const totalRevenue = latestFiling.totrevenue || 0;
    const contributions = latestFiling.totcntrbgfts || 0;
    const programRevenue = latestFiling.totprgmrevnue || 0;
    const investmentIncome = latestFiling.invstmntinc || 0;
    
    // 지출 관련
    const totalExpenses = latestFiling.totfuncexpns || 0;
    const executiveCompensation = latestFiling.compnsatncurrofcr || 0;
    const salariesWages = latestFiling.othrsalwages || 0;
    const payrollTax = latestFiling.payrolltx || 0;
    const fundraisingExpenses = latestFiling.profndraising || 0;
    
    // 자산 관련
    const totalAssets = latestFiling.totassetsend || 0;
    const totalLiabilities = latestFiling.totliabend || 0;
    const netAssets = totalAssets - totalLiabilities;

    // 이전 연도 데이터
    const prevRevenue = prevFiling?.totrevenue || totalRevenue;
    const prevExpenses = prevFiling?.totfuncexpns || totalExpenses;

    // 관리비 계산 (임원보수 + 직원급여 + 급여세)
    const adminExpenses = executiveCompensation + salariesWages + payrollTax;
    // 프로그램 지출 추정 (총 지출 - 관리비 - 모금비용)
    const programExpenses = Math.max(0, totalExpenses - adminExpenses - fundraisingExpenses);

    // 연도별 데이터 (최대 5년)
    const historicalData = sortedFilings.slice(0, 5).map((filing: {
      tax_prd_yr?: number;
      totrevenue?: number;
      totfuncexpns?: number;
      totassetsend?: number;
      totliabend?: number;
    }) => ({
      year: filing.tax_prd_yr || 0,
      totalRevenue: filing.totrevenue || 0,
      totalExpenses: filing.totfuncexpns || 0,
      totalAssets: filing.totassetsend || 0,
      netAssets: (filing.totassetsend || 0) - (filing.totliabend || 0),
    }));

    const financials: EnhancedCharityFinancials = {
      ein: normalizedEin,
      name: org?.name || 'Unknown',
      year: latestFiling.tax_prd_yr || new Date().getFullYear(),
      taxPeriod: latestFiling.tax_prd?.toString(),
      pdfUrl: latestFiling.pdf_url,
      
      organization: {
        address: org?.address,
        city: org?.city,
        state: org?.state,
        zipcode: org?.zipcode,
        nteeCode: org?.ntee_code,
        rulingDate: org?.ruling_date,
      },
      
      revenue: {
        total: totalRevenue,
        contributions,
        programService: programRevenue,
        investment: investmentIncome,
      },
      
      expenses: {
        total: totalExpenses,
        executiveCompensation,
        salariesWages,
        payrollTax,
        fundraising: fundraisingExpenses,
        programExpenses,
      },
      
      assets: {
        total: totalAssets,
        liabilities: totalLiabilities,
        net: netAssets,
      },
      
      metrics: calculateEnhancedMetrics({
        totalRevenue,
        totalExpenses,
        programExpenses,
        adminExpenses,
        fundraisingExpenses,
        netAssets,
        prevRevenue,
        prevExpenses,
      }),
      
      historicalData,
    };

    return financials;
  } catch (error) {
    console.error('Error fetching enhanced charity financials:', error);
    return null;
  }
}

/**
 * 개선된 재무 효율성 지표 계산
 */
function calculateEnhancedMetrics(data: {
  totalRevenue: number;
  totalExpenses: number;
  programExpenses: number;
  adminExpenses: number;
  fundraisingExpenses: number;
  netAssets: number;
  prevRevenue: number;
  prevExpenses: number;
}) {
  const { 
    totalRevenue, totalExpenses, programExpenses, 
    adminExpenses, fundraisingExpenses, netAssets,
    prevRevenue, prevExpenses 
  } = data;
  
  return {
    // 운영 효율성 (비용/수익 비율, 낮을수록 좋음)
    operatingExpenseRatio: totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0,
    
    // 프로그램 지출 비율 (높을수록 좋음, 목표: 70%+)
    programExpenseRatio: totalExpenses > 0 ? (programExpenses / totalExpenses) * 100 : 0,
    
    // 관리비 비율 (낮을수록 좋음, 목표: 25% 미만)
    adminExpenseRatio: totalExpenses > 0 ? (adminExpenses / totalExpenses) * 100 : 0,
    
    // 모금 비용 비율 (낮을수록 좋음, 목표: 15% 미만)
    fundraisingRatio: totalExpenses > 0 ? (fundraisingExpenses / totalExpenses) * 100 : 0,
    
    // 운영자본 비율 (순자산/연간 지출, 목표: 1-3년)
    workingCapitalRatio: totalExpenses > 0 ? netAssets / totalExpenses : 0,
    
    // 수익 성장률
    revenueGrowth: prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0,
    
    // 비용 증가율
    expenseGrowth: prevExpenses > 0 ? ((totalExpenses - prevExpenses) / prevExpenses) * 100 : 0,
  };
}

/**
 * EIN으로 기부 단체의 재무 정보를 가져옵니다 (기존 함수 - 호환성 유지)
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
 * 개선된 버전: 프로그램 지출, 관리비, 모금비용 비율도 고려
 */
export function calculateFinancialGrade(metrics: EnhancedCharityFinancials['metrics'] | CharityFinancials['metrics']): string {
  let score = 0;

  // 운영 효율성 점수 (0-30점)
  // 비용/수익 비율이 낮을수록 효율적
  const opRatio = metrics.operatingExpenseRatio || 0;
  if (opRatio > 0 && opRatio < 70) score += 30;
  else if (opRatio < 80) score += 25;
  else if (opRatio < 90) score += 20;
  else if (opRatio < 100) score += 15;
  else score += 5;

  // 프로그램 지출 비율 점수 (0-30점) - 높을수록 좋음
  const programRatio = metrics.programExpenseRatio || 0;
  if (programRatio >= 80) score += 30;
  else if (programRatio >= 70) score += 25;
  else if (programRatio >= 60) score += 20;
  else if (programRatio >= 50) score += 15;
  else score += 5;

  // 관리비/모금비용 비율 점수 (0-20점) - 낮을수록 좋음
  const adminRatio = 'adminExpenseRatio' in metrics ? metrics.adminExpenseRatio || 0 : 0;
  const fundRatio = 'fundraisingRatio' in metrics ? metrics.fundraisingRatio || 0 : 0;
  const overheadRatio = adminRatio + fundRatio;
  if (overheadRatio > 0 && overheadRatio < 20) score += 20;
  else if (overheadRatio < 30) score += 15;
  else if (overheadRatio < 40) score += 10;
  else score += 5;

  // 운영자본 비율 점수 (0-10점)
  const wcRatio = metrics.workingCapitalRatio || 0;
  if (wcRatio >= 1 && wcRatio <= 3) score += 10;
  else if (wcRatio >= 0.5 && wcRatio < 4) score += 7;
  else if (wcRatio >= 0.25) score += 4;
  else score += 2;

  // 수익 성장률 점수 (0-10점)
  const revGrowth = metrics.revenueGrowth || 0;
  if (revGrowth > 10) score += 10;
  else if (revGrowth > 5) score += 8;
  else if (revGrowth > 0) score += 6;
  else if (revGrowth > -5) score += 3;
  else score += 0;

  // 등급 부여 (100점 만점 기준)
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
