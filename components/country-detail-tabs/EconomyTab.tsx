'use client';

import { 
  TrendingDown, TrendingUp, Users, DollarSign, 
  Briefcase, Globe, Wallet, Building2, 
  Factory, Store, Tractor, Wifi, Smartphone, Zap, Building
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/helpers';
import { EconomyTabProps } from './types';

export default function EconomyTab({ country, economyData, loading }: EconomyTabProps) {
  // Simple sparkline chart rendering
  const renderSparkline = (data: Array<{ year: number; value: number }>, color: string) => {
    if (!data || data.length < 2) return null;
    
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    const width = 120;
    const height = 40;
    const padding = 4;
    
    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((d.value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width={width} height={height} className="flex-shrink-0">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
        />
        {/* Latest value point */}
        <circle
          cx={width - padding}
          cy={height - padding - ((values[values.length - 1] - min) / range) * (height - padding * 2)}
          r="3"
          fill={color}
        />
      </svg>
    );
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <DollarSign size={18} className="text-blue-500" />
        <h3 className="text-base font-bold text-slate-800">Economic Indicators</h3>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-blue-500"></div>
          <span className="ml-3 text-slate-500">Loading data...</span>
        </div>
      ) : (
        <>
          {/* GDP Section */}
          <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <DollarSign size={16} className="text-blue-500" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">GDP (Gross Domestic Product)</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Total GDP */}
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600 mb-1">Total GDP</p>
                <p className="text-lg font-bold text-blue-700">
                  {economyData?.gdp?.total?.value 
                    ? `$${(economyData.gdp.total.value / 1e9).toFixed(1)}B`
                    : 'N/A'}
                </p>
                {economyData?.gdp?.total?.year && (
                  <p className="text-[10px] text-slate-500">{economyData.gdp.total.year}</p>
                )}
              </div>
              
              {/* GDP per Capita */}
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600 mb-1">GDP per Capita</p>
                <p className="text-lg font-bold text-blue-700">
                  {economyData?.gdp?.perCapita?.value || country.gdpPerCapita 
                    ? formatCurrency(economyData?.gdp?.perCapita?.value || country.gdpPerCapita || 0)
                    : 'N/A'}
                </p>
                {economyData?.gdp?.perCapita?.year && (
                  <p className="text-[10px] text-slate-500">{economyData.gdp.perCapita.year}</p>
                )}
              </div>
            </div>

            {/* GDP Growth Trend */}
            {economyData?.gdp?.growthTrend && economyData.gdp.growthTrend.length > 0 && (
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-green-500" />
                    <span className="text-xs text-slate-600">GDP Growth Trend</span>
                  </div>
                  <span className={`text-sm font-bold ${(economyData.gdp?.growth?.value || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {economyData.gdp?.growth?.value?.toFixed(1) || 'N/A'}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  {renderSparkline(economyData.gdp.growthTrend, (economyData.gdp?.growth?.value || 0) >= 0 ? '#22c55e' : '#ef4444')}
                  <div className="text-[10px] text-slate-500 text-right">
                    <p>{economyData.gdp.growthTrend[0]?.year} - {economyData.gdp.growthTrend[economyData.gdp.growthTrend.length - 1]?.year}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Labor Market */}
          <div className="bg-white rounded-xl p-4 border border-orange-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <Briefcase size={16} className="text-orange-500" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Labor Market</h4>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Unemployment */}
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-xs text-orange-600 mb-1">Unemployment Rate</p>
                <p className="text-lg font-bold text-orange-700">
                  {economyData?.labor?.unemployment?.value || country.unemploymentRate 
                    ? `${(economyData?.labor?.unemployment?.value || country.unemploymentRate)?.toFixed(1)}%`
                    : 'N/A'}
                </p>
              </div>
              
              {/* Labor Participation */}
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-600 mb-1">Labor Participation</p>
                <p className="text-lg font-bold text-green-700">
                  {economyData?.labor?.laborParticipation?.value 
                    ? `${economyData.labor.laborParticipation.value.toFixed(1)}%`
                    : 'N/A'}
                </p>
              </div>
            </div>

            {/* Employment by Sector */}
            {(economyData?.labor?.employmentBySection?.agriculture?.value || 
              economyData?.labor?.employmentBySection?.industry?.value ||
              economyData?.labor?.employmentBySection?.services?.value) && (
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-600 mb-3">Employment by Sector</p>
                <div className="flex gap-2 mb-2">
                  {economyData?.labor?.employmentBySection?.agriculture?.value && (
                    <div className="flex-1 bg-green-100 rounded-lg p-2 text-center">
                      <Tractor size={14} className="text-green-600 mx-auto mb-1" />
                      <p className="text-xs font-bold text-green-700">
                        {economyData.labor.employmentBySection.agriculture.value.toFixed(1)}%
                      </p>
                      <p className="text-[10px] text-green-600">Agriculture</p>
                    </div>
                  )}
                  {economyData?.labor?.employmentBySection?.industry?.value && (
                    <div className="flex-1 bg-blue-100 rounded-lg p-2 text-center">
                      <Factory size={14} className="text-blue-600 mx-auto mb-1" />
                      <p className="text-xs font-bold text-blue-700">
                        {economyData.labor.employmentBySection.industry.value.toFixed(1)}%
                      </p>
                      <p className="text-[10px] text-blue-600">Industry</p>
                    </div>
                  )}
                  {economyData?.labor?.employmentBySection?.services?.value && (
                    <div className="flex-1 bg-purple-100 rounded-lg p-2 text-center">
                      <Store size={14} className="text-purple-600 mx-auto mb-1" />
                      <p className="text-xs font-bold text-purple-700">
                        {economyData.labor.employmentBySection.services.value.toFixed(1)}%
                      </p>
                      <p className="text-[10px] text-purple-600">Services</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Trade & Investment - Show only if data exists */}
          {(economyData?.trade?.tradePercentGdp?.value || 
            economyData?.trade?.exports?.value || 
            economyData?.trade?.imports?.value || 
            (economyData?.trade?.fdiNetInflows?.value !== null && economyData?.trade?.fdiNetInflows?.value !== undefined)) && (
            <div className="bg-white rounded-xl p-4 border border-purple-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Globe size={16} className="text-purple-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Trade & Investment</h4>
              </div>

              <div className="space-y-3">
                {/* Trade Share */}
                {economyData?.trade?.tradePercentGdp?.value && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Trade (% of GDP)</span>
                    <span className="text-sm font-semibold text-purple-600">
                      {economyData.trade.tradePercentGdp.value.toFixed(1)}%
                    </span>
                  </div>
                )}
                
                {/* Exports/Imports */}
                {(economyData?.trade?.exports?.value || economyData?.trade?.imports?.value) && (
                  <div className="grid grid-cols-2 gap-3">
                    {economyData?.trade?.exports?.value && (
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <TrendingUp size={12} className="text-green-500" />
                          <p className="text-xs text-green-600">Exports</p>
                        </div>
                        <p className="text-sm font-bold text-green-700">
                          {economyData.trade.exports.value.toFixed(1)}% GDP
                        </p>
                      </div>
                    )}
                    {economyData?.trade?.imports?.value && (
                      <div className="bg-red-50 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <TrendingDown size={12} className="text-red-500" />
                          <p className="text-xs text-red-600">Imports</p>
                        </div>
                        <p className="text-sm font-bold text-red-700">
                          {economyData.trade.imports.value.toFixed(1)}% GDP
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* FDI */}
                {economyData?.trade?.fdiNetInflows?.value !== null && economyData?.trade?.fdiNetInflows?.value !== undefined && (
                  <div className="flex items-center justify-between py-2 border-t border-slate-100">
                    <span className="text-sm text-slate-600">Foreign Direct Investment (FDI)</span>
                    <span className={`text-sm font-semibold ${(economyData.trade.fdiNetInflows.value || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {economyData.trade.fdiNetInflows.value?.toFixed(2)}% GDP
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Prices & Debt - Show only if data exists */}
          {(economyData?.finance?.inflation?.value || 
            economyData?.finance?.externalDebt?.value ||
            (economyData?.finance?.inflationTrend && economyData.finance.inflationTrend.length > 0)) && (
            <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <Wallet size={16} className="text-red-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Prices & Debt</h4>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Inflation */}
                {economyData?.finance?.inflation?.value && (
                  <div className={`rounded-lg p-3 ${economyData.finance.inflation.value > 10 ? 'bg-red-50' : 'bg-yellow-50'}`}>
                    <p className={`text-xs mb-1 ${economyData.finance.inflation.value > 10 ? 'text-red-600' : 'text-yellow-600'}`}>
                      Inflation
                    </p>
                    <p className={`text-lg font-bold ${economyData.finance.inflation.value > 10 ? 'text-red-700' : 'text-yellow-700'}`}>
                      {economyData.finance.inflation.value.toFixed(1)}%
                    </p>
                    {economyData.finance.inflation.year && (
                      <p className="text-[10px] text-slate-500">{economyData.finance.inflation.year}</p>
                    )}
                  </div>
                )}
                
                {/* External Debt */}
                {economyData?.finance?.externalDebt?.value && (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-600 mb-1">External Debt (% GNI)</p>
                    <p className="text-lg font-bold text-slate-700">
                      {economyData.finance.externalDebt.value.toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>

              {/* Inflation Trend */}
              {economyData?.finance?.inflationTrend && economyData.finance.inflationTrend.length > 0 && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-600">Inflation Trend</span>
                  </div>
                  <div className="flex items-center justify-between">
                    {renderSparkline(economyData.finance.inflationTrend, '#f59e0b')}
                    <div className="text-[10px] text-slate-500 text-right">
                      <p>{economyData.finance.inflationTrend[0]?.year} - {economyData.finance.inflationTrend[economyData.finance.inflationTrend.length - 1]?.year}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Income Inequality - Show only if data exists */}
          {(economyData?.income?.giniIndex?.value || 
            country.indicators?.giniIndex ||
            economyData?.income?.gniPerCapita?.value ||
            economyData?.income?.remittances?.value) && (
            <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Users size={16} className="text-amber-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Income & Inequality</h4>
              </div>

              <div className="space-y-3">
                {/* Gini Index */}
                {(economyData?.income?.giniIndex?.value || country.indicators?.giniIndex) && (
                  <div className="bg-amber-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-amber-600">Gini Index</span>
                      <span className="text-lg font-bold text-amber-700">
                        {(economyData?.income?.giniIndex?.value || country.indicators?.giniIndex)?.toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 h-full rounded-full"
                        style={{ width: `${(economyData?.income?.giniIndex?.value || country.indicators?.giniIndex || 0)}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">0=Perfect equality, 100=Perfect inequality</p>
                  </div>
                )}
                
                {/* GNI */}
                {economyData?.income?.gniPerCapita?.value && (
                  <div className="flex items-center justify-between py-2 border-t border-slate-100">
                    <span className="text-sm text-slate-600">GNI per Capita</span>
                    <span className="text-sm font-semibold text-slate-700">
                      {formatCurrency(economyData.income.gniPerCapita.value)}
                    </span>
                  </div>
                )}
                
                {/* Remittances */}
                {economyData?.income?.remittances?.value && (
                  <div className="flex items-center justify-between py-2 border-t border-slate-100">
                    <span className="text-sm text-slate-600">Remittances (% GDP)</span>
                    <span className="text-sm font-semibold text-green-600">
                      {economyData.income.remittances.value.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Infrastructure & Digital - Show only if data exists */}
          {(economyData?.infrastructure?.accessElectricity?.value || 
            economyData?.infrastructure?.urbanPopulation?.value ||
            economyData?.infrastructure?.internetUsers?.value ||
            economyData?.infrastructure?.mobileSubscriptions?.value) && (
            <div className="bg-white rounded-xl p-4 border border-teal-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                  <Building2 size={16} className="text-teal-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Infrastructure & Digital</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Electricity Access */}
                {economyData?.infrastructure?.accessElectricity?.value && (
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap size={12} className="text-yellow-500" />
                      <p className="text-xs text-yellow-600">Electricity Access</p>
                    </div>
                    <p className="text-sm font-bold text-yellow-700">
                      {economyData.infrastructure.accessElectricity.value.toFixed(1)}%
                    </p>
                  </div>
                )}
                
                {/* Urbanization */}
                {economyData?.infrastructure?.urbanPopulation?.value && (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Building size={12} className="text-slate-500" />
                      <p className="text-xs text-slate-600">Urbanization</p>
                    </div>
                    <p className="text-sm font-bold text-slate-700">
                      {economyData.infrastructure.urbanPopulation.value.toFixed(1)}%
                    </p>
                  </div>
                )}
                
                {/* Internet Usage */}
                {economyData?.infrastructure?.internetUsers?.value && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Wifi size={12} className="text-blue-500" />
                      <p className="text-xs text-blue-600">Internet Usage</p>
                    </div>
                    <p className="text-sm font-bold text-blue-700">
                      {economyData.infrastructure.internetUsers.value.toFixed(1)}%
                    </p>
                  </div>
                )}
                
                {/* Mobile Subscriptions */}
                {economyData?.infrastructure?.mobileSubscriptions?.value && (
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Smartphone size={12} className="text-purple-500" />
                      <p className="text-xs text-purple-600">Mobile Subscriptions</p>
                    </div>
                    <p className="text-sm font-bold text-purple-700">
                      {economyData.infrastructure.mobileSubscriptions.value.toFixed(0)}/100
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Economy Score */}
          {country.scores?.economy !== undefined && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-blue-700">Economic Vulnerability Score</span>
                <span className="text-xl font-bold text-blue-600">{country.scores.economy.toFixed(1)}/100</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all" style={{ width: `${country.scores.economy}%` }}></div>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Higher scores indicate greater need for economic support
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
