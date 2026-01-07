'use client';

import { TrendingUp } from 'lucide-react';
import { TabProps } from './types';

export default function ScoresTab({ country }: TabProps) {
  if (!country.scores) {
    return (
      <div className="p-5">
        <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
          <TrendingUp className="mx-auto mb-3 text-slate-400" size={32} />
          <p className="text-slate-500 text-sm">No score data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp size={20} className="text-blue-500" />
        <h3 className="text-lg font-bold text-slate-800">Composite Scoring System</h3>
      </div>
      
      <div className="space-y-4">
        {/* Poverty Score */}
        <div className="bg-red-50 rounded-xl p-5 border border-red-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-red-700">Poverty Score</span>
            <span className="text-2xl font-bold text-red-600">{country.scores.poverty.toFixed(1)}</span>
          </div>
          <div className="w-full bg-red-200 rounded-full h-3 mb-3 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-400 h-full rounded-full transition-all" style={{ width: `${country.scores.poverty}%` }}></div>
          </div>
          <span className="text-xs text-slate-500">Weight: 40%</span>
        </div>

        {/* Economy Score */}
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-blue-700">Economy Score</span>
            <span className="text-2xl font-bold text-blue-600">{country.scores.economy.toFixed(1)}</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-3 mb-3 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all" style={{ width: `${country.scores.economy}%` }}></div>
          </div>
          <span className="text-xs text-slate-500">Weight: 20%</span>
        </div>

        {/* Health Score */}
        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-green-700">Health Score</span>
            <span className="text-2xl font-bold text-green-600">{country.scores.health.toFixed(1)}</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-3 mb-3 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all" style={{ width: `${country.scores.health}%` }}></div>
          </div>
          <span className="text-xs text-slate-500">Weight: 20%</span>
        </div>

        {/* Education Score */}
        <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-purple-700">Education Score</span>
            <span className="text-2xl font-bold text-purple-600">{country.scores.education.toFixed(1)}</span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-3 mb-3 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full transition-all" style={{ width: `${country.scores.education}%` }}></div>
          </div>
          <span className="text-xs text-slate-500">Weight: 10%</span>
        </div>

        {/* Food Security Score */}
        <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-orange-700">Food Security Score</span>
            <span className="text-2xl font-bold text-orange-600">{country.scores.foodSecurity.toFixed(1)}</span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-3 mb-3 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-400 h-full rounded-full transition-all" style={{ width: `${country.scores.foodSecurity}%` }}></div>
          </div>
          <span className="text-xs text-slate-500">Weight: 10%</span>
        </div>

        {/* Overall Score */}
        <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl p-6 border-2 border-slate-300 mt-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-base font-bold text-slate-800">Overall Score</span>
            <span className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{country.scores.overall.toFixed(1)}</span>
          </div>
          <div className="w-full bg-slate-300 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all" 
              style={{ width: `${country.scores.overall}%` }}
            ></div>
          </div>
          <p className="text-sm text-slate-600 mt-4">
            Higher scores indicate greater urgency for support
          </p>
        </div>
      </div>
    </div>
  );
}
