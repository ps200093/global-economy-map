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

  // Expense analysis data
  const expenseData = [
    { name: 'Program Expenses', value: financials.expenses.program, color: '#3b82f6' },
    { name: 'Admin Expenses', value: financials.expenses.administration, color: '#f59e0b' },
    { name: 'Fundraising', value: financials.expenses.fundraising, color: '#10b981' },
  ];

  // Revenue analysis data
  const revenueData = [
    { name: 'Contributions', value: financials.revenue.contributions, color: '#8b5cf6' },
    { name: 'Program Revenue', value: financials.revenue.programService, color: '#06b6d4' },
    { name: 'Investment Income', value: financials.revenue.investment, color: '#f43f5e' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Financial Analysis</h3>
        <div className="text-center">
          <p className="text-sm text-gray-600">Financial Grade</p>
          <p className={`text-4xl font-bold ${
            grade.startsWith('A') ? 'text-green-600' :
            grade.startsWith('B') ? 'text-blue-600' :
            grade.startsWith('C') ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {grade}
          </p>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-blue-600" size={20} />
            <p className="text-sm font-semibold text-gray-700">Total Revenue</p>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {formatCurrency(financials.revenue.total)}
          </p>
          <p className="text-xs text-gray-600 mt-1">FY {financials.year}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <PieChartIcon className="text-purple-600" size={20} />
            <p className="text-sm font-semibold text-gray-700">Total Expenses</p>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {formatCurrency(financials.expenses.total)}
          </p>
          <p className="text-xs text-gray-600 mt-1">FY {financials.year}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-600" size={20} />
            <p className="text-sm font-semibold text-gray-700">Net Assets</p>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {formatCurrency(financials.assets.net)}
          </p>
          <p className="text-xs text-gray-600 mt-1">Year-end</p>
        </div>
      </div>

      {/* Efficiency Metrics */}
      <div className="mb-6">
        <h4 className="font-bold text-lg mb-4 text-gray-800">Efficiency Metrics</h4>
        <div className="space-y-3">
          <MetricBar
            label="Program Expense Ratio"
            value={financials.metrics.programExpenseRatio}
            target={75}
            color="blue"
            description="Target: 75% or higher"
          />
          <MetricBar
            label="Admin Expense Ratio"
            value={financials.metrics.administrativeExpenseRatio}
            target={15}
            color="amber"
            inverse
            description="Target: 15% or lower"
          />
          <MetricBar
            label="Fundraising Ratio"
            value={financials.metrics.fundraisingExpenseRatio}
            target={10}
            color="green"
            inverse
            description="Target: 10% or lower"
          />
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Analysis */}
        <div>
          <h4 className="font-bold text-lg mb-3 text-gray-800">Expense Analysis</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(typeof value === 'number' ? value : 0)} />
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

        {/* Revenue Analysis */}
        <div>
          <h4 className="font-bold text-lg mb-3 text-gray-800">Revenue Analysis</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={revenueData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(typeof value === 'number' ? value : 0)} />
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

      {/* Additional Metrics */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-bold text-lg mb-4 text-gray-800">Additional Metrics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">Working Capital Ratio</p>
            <p className="text-xl font-bold text-gray-800">
              {financials.metrics.workingCapitalRatio.toFixed(2)} years
            </p>
            <p className="text-xs text-gray-500 mt-1">Net Assets / Annual Expenses</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">Revenue Growth Rate</p>
            <p className={`text-xl font-bold ${
              financials.metrics.revenueGrowth >= 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              {financials.metrics.revenueGrowth >= 0 ? '+' : ''}
              {financials.metrics.revenueGrowth.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Year-over-year</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Financial data is based on IRS Form 990, 
          using the most recently filed information. Higher program expense ratios 
          and lower admin/fundraising ratios indicate a more efficient charity.
        </p>
      </div>
    </div>
  );
}

// Metric bar component
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
            {isGood ? '✓ Good' : '△ Caution'}
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

