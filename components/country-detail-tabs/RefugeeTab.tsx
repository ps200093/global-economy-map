'use client';

import { Home, Users } from 'lucide-react';
import { formatNumber } from '@/utils/helpers';
import { RefugeeTabProps } from './types';

export default function RefugeeTab({ country, refugeeData, loading }: RefugeeTabProps) {
  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-bold text-slate-800 mb-4">🏃 Refugee Data (UNHCR)</h3>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-blue-500"></div>
          <span className="ml-3 text-slate-500">Loading data...</span>
        </div>
      ) : refugeeData?.hasData ? (
        <>
          {/* Key Statistics Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Home className="text-blue-600" size={16} />
                <p className="text-xs text-blue-700 font-medium">Refugees Originating</p>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {formatNumber(refugeeData.summary.refugeesOriginating)}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Refugees from this country
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-green-600" size={16} />
                <p className="text-xs text-green-700 font-medium">Refugees Hosted</p>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {formatNumber(refugeeData.summary.refugeesAsylum)}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Refugees hosted by this country
              </p>
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-3">📊 Detailed Statistics ({refugeeData.summary.year})</h4>
            <div className="space-y-2.5">
              {refugeeData.summary.idps > 0 && (
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">🏠 Internally Displaced (IDPs)</span>
                  <span className="text-sm font-semibold text-orange-600">
                    {formatNumber(refugeeData.summary.idps)}
                  </span>
                </div>
              )}
              {refugeeData.summary.asylumSeekers > 0 && (
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">📝 Asylum Seekers</span>
                  <span className="text-sm font-semibold text-purple-600">
                    {formatNumber(refugeeData.summary.asylumSeekers)}
                  </span>
                </div>
              )}
              {refugeeData.summary.returnedRefugees > 0 && (
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">🔄 Returned Refugees</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatNumber(refugeeData.summary.returnedRefugees)}
                  </span>
                </div>
              )}
              {refugeeData.summary.returnedIDPs > 0 && (
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">🔙 Returned IDPs</span>
                  <span className="text-sm font-semibold text-cyan-600">
                    {formatNumber(refugeeData.summary.returnedIDPs)}
                  </span>
                </div>
              )}
              {refugeeData.summary.stateless > 0 && (
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">👤 Stateless Persons</span>
                  <span className="text-sm font-semibold text-slate-600">
                    {formatNumber(refugeeData.summary.stateless)}
                  </span>
                </div>
              )}
              {refugeeData.summary.ooc > 0 && (
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">⚠️ Other Persons of Concern</span>
                  <span className="text-sm font-semibold text-orange-600">
                    {formatNumber(refugeeData.summary.ooc)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between py-2 pt-3 border-t-2 border-slate-200">
                <span className="text-sm text-slate-800 font-bold">Total Displaced</span>
                <span className="text-lg font-bold text-red-600">
                  {formatNumber(refugeeData.summary.totalDisplaced)}
                </span>
              </div>
            </div>
          </div>

          {/* Global Comparison */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-200">
            <h4 className="text-sm font-bold text-purple-700 mb-3">🌏 Global Statistics ({refugeeData.summary.year})</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-slate-600 mb-1">Refugees</p>
                <p className="text-lg font-bold text-purple-600">
                  {formatNumber(refugeeData.globalStats.refugees)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-slate-600 mb-1">Asylum Seekers</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatNumber(refugeeData.globalStats.asylumSeekers)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-slate-600 mb-1">IDPs</p>
                <p className="text-lg font-bold text-orange-600">
                  {formatNumber(refugeeData.globalStats.idps)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-slate-600 mb-1">Stateless</p>
                <p className="text-lg font-bold text-slate-600">
                  {formatNumber(refugeeData.globalStats.stateless)}
                </p>
              </div>
            </div>
          </div>

          {/* Top Destinations */}
          {refugeeData.topDestinations.length > 0 && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-3">🌍 Top Destination Countries</h4>
              <div className="space-y-2">
                {refugeeData.topDestinations.map((dest, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400 w-5">#{idx + 1}</span>
                      <span className="text-sm text-slate-800">{dest.country}</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">
                      {formatNumber(dest.count)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Origins */}
          {refugeeData.topOrigins.length > 0 && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-3">🌍 Top Origin Countries</h4>
              <div className="space-y-2">
                {refugeeData.topOrigins.map((origin, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400 w-5">#{idx + 1}</span>
                      <span className="text-sm text-slate-800">{origin.country}</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      {formatNumber(origin.count)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Source */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <Home className="text-blue-600 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-semibold text-blue-700 mb-2">UNHCR Database</p>
                <p className="text-xs text-slate-700 leading-relaxed mb-2">
                  The UN Refugee Agency (UNHCR) collects and manages data on refugees, asylum seekers, and internally displaced persons worldwide.
                </p>
                <p className="text-[10px] text-blue-600 font-medium">
                  💡 This data is used to inform humanitarian assistance and refugee protection policies.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-slate-50 rounded-xl p-6 text-center border border-slate-200">
          <p className="text-sm text-slate-500">No refugee data available for this country.</p>
        </div>
      )}
    </div>
  );
}
