'use client';

import { GlobalStats } from '@/types';
import { formatNumber, formatCurrency } from '@/utils/helpers';
import { Users, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsItemProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  variant: 'red' | 'orange' | 'green' | 'blue';
  onClick: () => void;
}

function StatsItem({ title, value, icon, variant, onClick }: StatsItemProps) {
  const variants = {
    red: {
      icon: 'bg-red-100 text-red-600',
      value: 'text-red-600',
      border: 'border-red-200 hover:border-red-300',
    },
    orange: {
      icon: 'bg-orange-100 text-orange-600',
      value: 'text-orange-600',
      border: 'border-orange-200 hover:border-orange-300',
    },
    green: {
      icon: 'bg-green-100 text-green-600',
      value: 'text-green-600',
      border: 'border-green-200 hover:border-green-300',
    },
    blue: {
      icon: 'bg-blue-100 text-blue-600',
      value: 'text-blue-600',
      border: 'border-blue-200 hover:border-blue-300',
    },
  };

  const style = variants[variant];

  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md border bg-card transition-all hover:shadow-sm cursor-pointer",
        style.border
      )}
    >
      <div className={cn("p-1.5 rounded-md", style.icon)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[10px] text-muted-foreground font-medium leading-tight">{title}</p>
        <p className={cn("text-sm font-bold truncate", style.value)}>{value}</p>
      </div>
    </button>
  );
}

interface GlobalStatsDashboardProps {
  stats: GlobalStats;
  onStatClick: (statType: 'poverty' | 'povertyRate' | 'funding' | 'crisis') => void;
}

export default function GlobalStatsDashboard({ stats, onStatClick }: GlobalStatsDashboardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <StatsItem
        title="Population in Poverty"
        value={formatNumber(stats.totalPopulationInPoverty)}
        icon={<Users size={14} />}
        variant="red"
        onClick={() => onStatClick('poverty')}
      />
      <StatsItem
        title="Average Poverty Rate"
        value={`${stats.averagePovertyRate.toFixed(1)}%`}
        icon={<TrendingDown size={14} />}
        variant="orange"
        onClick={() => onStatClick('povertyRate')}
      />
      <StatsItem
        title="Funding Needed"
        value={formatCurrency(stats.totalFundingNeeded)}
        icon={<DollarSign size={14} />}
        variant="green"
        onClick={() => onStatClick('funding')}
      />
      <StatsItem
        title="Crisis Regions"
        value={`${stats.regionsInCrisis} Countries`}
        icon={<AlertCircle size={14} />}
        variant="blue"
        onClick={() => onStatClick('crisis')}
      />
    </div>
  );
}
