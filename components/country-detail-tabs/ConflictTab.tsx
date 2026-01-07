'use client';

import { Shield, AlertTriangle } from 'lucide-react';
import { formatNumber } from '@/utils/helpers';
import { ConflictTabProps } from './types';

export default function ConflictTab({ country, conflictData, loading }: ConflictTabProps) {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Shield size={18} className="text-red-500" />
        <h3 className="text-base font-bold text-slate-800">Conflict/Violence Data (ACLED)</h3>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-red-500"></div>
          <span className="ml-3 text-slate-500">Loading data...</span>
        </div>
      ) : conflictData ? (
        <>
          {/* Key Statistics Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-4 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="text-red-600" size={16} />
                <p className="text-xs text-red-700 font-medium">Political Violence</p>
              </div>
              <p className="text-2xl font-bold text-red-700">
                {formatNumber(conflictData.summary.totalEvents)}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Total events in {conflictData.summary.latestYear}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-orange-600" size={16} />
                <p className="text-xs text-orange-700 font-medium">Fatalities</p>
              </div>
              <p className="text-2xl font-bold text-orange-700">
                {formatNumber(conflictData.summary.totalFatalities)}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Total fatalities in {conflictData.summary.latestYear}
              </p>
            </div>
          </div>

          {/* Event Type Breakdown */}
          {conflictData.eventTypeBreakdown && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-3">📊 Event Type Breakdown (Past Year)</h4>
              <div className="space-y-2.5">
                {conflictData.eventTypeBreakdown.battles > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">⚔️ Battles</span>
                    <span className="text-sm font-semibold text-red-600">
                      {formatNumber(conflictData.eventTypeBreakdown.battles)}
                    </span>
                  </div>
                )}
                {conflictData.eventTypeBreakdown.violenceAgainstCivilians > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">🔴 Violence Against Civilians</span>
                    <span className="text-sm font-semibold text-orange-600">
                      {formatNumber(conflictData.eventTypeBreakdown.violenceAgainstCivilians)}
                    </span>
                  </div>
                )}
                {conflictData.eventTypeBreakdown.explosions > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">💣 Explosions/Remote Violence</span>
                    <span className="text-sm font-semibold text-red-600">
                      {formatNumber(conflictData.eventTypeBreakdown.explosions)}
                    </span>
                  </div>
                )}
                {conflictData.eventTypeBreakdown.protests > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">📢 Protests</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {formatNumber(conflictData.eventTypeBreakdown.protests)}
                    </span>
                  </div>
                )}
                {conflictData.eventTypeBreakdown.riots > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">💥 Riots</span>
                    <span className="text-sm font-semibold text-purple-600">
                      {formatNumber(conflictData.eventTypeBreakdown.riots)}
                    </span>
                  </div>
                )}
                {conflictData.eventTypeBreakdown.strategicDevelopments > 0 && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-600">📋 Strategic Developments</span>
                    <span className="text-sm font-semibold text-slate-600">
                      {formatNumber(conflictData.eventTypeBreakdown.strategicDevelopments)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Yearly Statistics */}
          {conflictData.yearlyStats.length > 0 && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-3">📈 5-Year Trend</h4>
              <div className="space-y-3">
                {conflictData.yearlyStats.slice(0, 5).map((stat) => (
                  <div key={stat.year} className="pb-2 border-b border-slate-100 last:border-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-slate-800">{stat.year}</span>
                      <span className="text-xs text-slate-500">
                        {formatNumber(stat.politicalViolence)} events
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Fatalities:</span>
                        <span className="font-semibold text-red-600">{formatNumber(stat.fatalities)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Civilian:</span>
                        <span className="font-semibold text-orange-600">{formatNumber(stat.civilianFatalities)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Events */}
          {conflictData.recentEvents.length > 0 && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-3">🔴 Recent Events</h4>
              <div className="space-y-3">
                {conflictData.recentEvents.map((event, idx) => (
                  <div key={idx} className="pb-3 border-b border-slate-100 last:border-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-slate-800">{event.type}</span>
                        {event.fatalities > 0 && (
                          <span className="ml-2 text-xs text-red-600 font-semibold">
                            {event.fatalities} fatalities
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{event.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-1">{event.subType}</p>
                    <p className="text-[11px] text-slate-400">{event.location}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Source */}
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-start gap-3">
              <Shield className="text-orange-600 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-semibold text-orange-700 mb-2">ACLED Database</p>
                <p className="text-xs text-slate-700 leading-relaxed mb-2">
                  The Armed Conflict Location & Event Data Project collects and analyzes political violence and protest data worldwide.
                </p>
                <p className="text-[10px] text-orange-600 font-medium">
                  💡 This data is used to assess conflict zones, political stability, and urgency of humanitarian support.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-slate-50 rounded-xl p-6 text-center border border-slate-200">
          <p className="text-sm text-slate-500">No conflict data available for this country.</p>
        </div>
      )}
    </div>
  );
}
