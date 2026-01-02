'use client';

import { CharityFinancials } from '@/types/api';
import { formatCurrency } from '@/utils/helpers';
import { calculateFinancialGrade } from '@/services/charity-financials';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, DollarSign, PieChart as PieChartIcon } from 'lucide-react';

interface FinancialAnalysisProps {
  financials: CharityFinancials;
}

export default function FinancialAnalysis({ financials }: FinancialAnalysisProps) {
  const grade = calculateFinancialGrade(financials.metrics);

  // 지출 분석 데이터
  const expenseData = [
    { name: '프로그램비', value: financials.expenses.program, color: '#3b82f6' },
    { name: '관리비', value: financials.expenses.administration, color: '#f59e0b' },
    { name: '모금비', value: financials.expenses.fundraising, color: '#10b981' },
  ];

  // 수익 분석 데이터
  const revenueData = [
    { name: '기부금', value: financials.revenue.contributions, color: '#8b5cf6' },
    { name: '프로그램 수익', value: financials.revenue.programService, color: '#06b6d4' },
    { name: '투자 수익', value: financials.revenue.investment, color: '#f43f5e' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">재무 분석</h3>
        <div className="text-center">
          <p className="text-sm text-gray-600">재무 등급</p>
          <p className={`text-4xl font-bold ${
            grade.startsWith('A') ? 'text-green-600' :
            grade.startsWith('B') ? 'text-blue-600' :
            grade.startsWith('C') ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {grade}
          </p>
        </div>
      </div>

      {/* 주요 재무 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-blue-600" size={20} />
            <p className="text-sm font-semibold text-gray-700">총 수익</p>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {formatCurrency(financials.revenue.total)}
          </p>
          <p className="text-xs text-gray-600 mt-1">FY {financials.year}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <PieChartIcon className="text-purple-600" size={20} />
            <p className="text-sm font-semibold text-gray-700">총 지출</p>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {formatCurrency(financials.expenses.total)}
          </p>
          <p className="text-xs text-gray-600 mt-1">FY {financials.year}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-600" size={20} />
            <p className="text-sm font-semibold text-gray-700">순자산</p>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {formatCurrency(financials.assets.net)}
          </p>
          <p className="text-xs text-gray-600 mt-1">연말 기준</p>
        </div>
      </div>

      {/* 효율성 지표 */}
      <div className="mb-6">
        <h4 className="font-bold text-lg mb-4 text-gray-800">효율성 지표</h4>
        <div className="space-y-3">
          <MetricBar
            label="프로그램비 비율"
            value={financials.metrics.programExpenseRatio}
            target={75}
            color="blue"
            description="목표: 75% 이상"
          />
          <MetricBar
            label="관리비 비율"
            value={financials.metrics.administrativeExpenseRatio}
            target={15}
            color="amber"
            inverse
            description="목표: 15% 이하"
          />
          <MetricBar
            label="모금비 비율"
            value={financials.metrics.fundraisingExpenseRatio}
            target={10}
            color="green"
            inverse
            description="목표: 10% 이하"
          />
        </div>
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 지출 분석 */}
        <div>
          <h4 className="font-bold text-lg mb-3 text-gray-800">지출 분석</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {expenseData.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-semibold">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 수익 분석 */}
        <div>
          <h4 className="font-bold text-lg mb-3 text-gray-800">수익 분석</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={revenueData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {revenueData.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-semibold">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 추가 지표 */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-bold text-lg mb-4 text-gray-800">추가 지표</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">운영자본 비율</p>
            <p className="text-xl font-bold text-gray-800">
              {financials.metrics.workingCapitalRatio.toFixed(2)}년
            </p>
            <p className="text-xs text-gray-500 mt-1">순자산 / 연간 지출</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">수익 성장률</p>
            <p className={`text-xl font-bold ${
              financials.metrics.revenueGrowth >= 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              {financials.metrics.revenueGrowth >= 0 ? '+' : ''}
              {financials.metrics.revenueGrowth.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">전년 대비</p>
          </div>
        </div>
      </div>

      {/* 참고 사항 */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>참고:</strong> 재무 데이터는 IRS Form 990을 기반으로 하며, 
          가장 최근에 제출된 자료입니다. 프로그램비 비율이 높을수록, 
          관리비와 모금비 비율이 낮을수록 효율적인 기부 단체로 평가됩니다.
        </p>
      </div>
    </div>
  );
}

// 지표 바 컴포넌트
function MetricBar({
  label,
  value,
  target,
  color,
  inverse = false,
  description,
}: {
  label: string;
  value: number;
  target: number;
  color: string;
  inverse?: boolean;
  description: string;
}) {
  const isGood = inverse ? value <= target : value >= target;
  const colorClasses = {
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    green: 'bg-green-500',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${isGood ? 'text-green-600' : 'text-amber-600'}`}>
            {value.toFixed(1)}%
          </span>
          <span className={`px-2 py-0.5 text-xs rounded ${
            isGood ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {isGood ? '✓ 우수' : '△ 주의'}
          </span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all ${colorClasses[color as keyof typeof colorClasses]}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}

