'use client';

import { Heart, TrendingDown, Users, DollarSign, TrendingUp, Info } from 'lucide-react';
import { formatNumber, formatCurrency, getUrgencyColor } from '@/utils/helpers';
import { TabProps, urgencyLabels } from './types';
import DataRow from './DataRow';

export default function OverviewTab({ country }: TabProps) {
  return (
    <div className="p-5 space-y-5">
      {/* Basic Info */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Info size={16} className="text-blue-500" />
          <h3 className="text-sm font-bold text-slate-800">Basic Information</h3>
        </div>
        <div className="space-y-0">
          <DataRow label="Country Name" value={country.name} />
          <DataRow label="ISO Code" value={country.iso3} />
          <DataRow label="Total Population" value={formatNumber(country.population || 0)} icon={Users} />
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-slate-600">Urgency Level</span>
            <span 
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-md"
              style={{ backgroundColor: getUrgencyColor(country.urgencyLevel) }}
            >
              {urgencyLabels[country.urgencyLevel]}
            </span>
          </div>
        </div>
      </div>

      {/* Key Indicators - 4 Column Grid */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-blue-500" />
          <h3 className="text-sm font-bold text-slate-800">Key Indicators</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* Poverty Rate Card */}
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-4 border border-red-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-200/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingDown size={14} className="text-red-500" />
                <p className="text-xs text-red-600 font-medium">Poverty Rate</p>
              </div>
              <p className="text-2xl font-bold text-red-700">
                {country.indicators?.poverty || country.indicators?.povertyRate 
                  ? (country.indicators?.poverty || country.indicators?.povertyRate)?.toFixed(1) 
                  : 'N/A'}%
              </p>
            </div>
          </div>

          {/* GDP Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative">
              <div className="flex items-center gap-1.5 mb-2">
                <DollarSign size={14} className="text-blue-500" />
                <p className="text-xs text-blue-600 font-medium">GDP per Capita</p>
              </div>
              <p className="text-xl font-bold text-blue-700">
                {country.gdpPerCapita || country.indicators?.gdpPerCapita 
                  ? formatCurrency(country.gdpPerCapita || country.indicators?.gdpPerCapita || 0) 
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Unemployment Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-200/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative">
              <div className="flex items-center gap-1.5 mb-2">
                <Users size={14} className="text-orange-500" />
                <p className="text-xs text-orange-600 font-medium">Unemployment</p>
              </div>
              <p className="text-2xl font-bold text-orange-700">
                {country.unemploymentRate || country.indicators?.unemploymentRate 
                  ? (country.unemploymentRate || country.indicators?.unemploymentRate)?.toFixed(1) 
                  : 'N/A'}%
              </p>
            </div>
          </div>

          {/* Overall Score Card */}
          {country.scores?.overall !== undefined && (
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-200/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp size={14} className="text-green-500" />
                  <p className="text-xs text-green-600 font-medium">Overall Score</p>
                </div>
                <p className="text-2xl font-bold text-green-700">{country.scores.overall.toFixed(1)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Support Areas */}
      {country.recommendedSupport && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={16} className="text-green-500" />
            <h3 className="text-sm font-bold text-slate-800">Recommended Support Areas</h3>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            {Array.isArray(country.recommendedSupport) 
              ? country.recommendedSupport.join(' / ')
              : country.recommendedSupport}
          </p>
        </div>
      )}
    </div>
  );
}
