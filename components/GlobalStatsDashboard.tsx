'use client';

import { GlobalStats } from '@/types';
import { formatNumber, formatCurrency } from '@/utils/helpers';
import { Users, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

function StatsCard({ title, value, icon, color, subtitle }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`${color} opacity-80`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface GlobalStatsDashboardProps {
  stats: GlobalStats;
}

export default function GlobalStatsDashboard({ stats }: GlobalStatsDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard
        title="빈곤층 인구"
        value={formatNumber(stats.totalPopulationInPoverty)}
        icon={<Users size={32} />}
        color="text-red-600"
        subtitle="전 세계 빈곤선 이하"
      />
      <StatsCard
        title="평균 빈곤율"
        value={`${stats.averagePovertyRate.toFixed(1)}%`}
        icon={<TrendingDown size={32} />}
        color="text-amber-600"
        subtitle="모니터링 지역 평균"
      />
      <StatsCard
        title="필요 지원 금액"
        value={formatCurrency(stats.totalFundingNeeded)}
        icon={<DollarSign size={32} />}
        color="text-green-600"
        subtitle="연간 추정 필요액"
      />
      <StatsCard
        title="위기 지역"
        value={`${stats.regionsInCrisis}`}
        icon={<AlertCircle size={32} />}
        color="text-purple-600"
        subtitle="긴급/높은 우선순위"
      />
    </div>
  );
}

