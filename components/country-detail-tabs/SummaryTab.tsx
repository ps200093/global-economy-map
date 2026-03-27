'use client';

import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { CountryData } from '@/types';
import type {
  EconomyAPIData,
  HealthAPIData,
  EducationAPIData,
  FoodSecurityAPIData,
  ConflictAPIData,
  RefugeeAPIData,
} from './types';

interface SummaryTabProps {
  country: CountryData;
  economyData?: EconomyAPIData | null;
  healthData?: HealthAPIData | null;
  educationData?: EducationAPIData | null;
  foodSecurityData?: FoodSecurityAPIData | null;
  conflictData?: ConflictAPIData | null;
  refugeeData?: RefugeeAPIData | null;
  loadingEconomy?: boolean;
  loadingHealth?: boolean;
  loadingEducation?: boolean;
  loadingFood?: boolean;
  loadingConflict?: boolean;
  loadingRefugee?: boolean;
}

export default function SummaryTab({ 
  country,
  economyData,
  healthData,
  educationData,
  foodSecurityData,
  conflictData,
  refugeeData,
  loadingEconomy,
  loadingHealth,
  loadingEducation,
  loadingFood,
  loadingConflict,
  loadingRefugee,
}: SummaryTabProps) {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // 모든 데이터가 로드되었는지 확인
  const isLoadingAnyData = loadingEconomy || loadingHealth || loadingEducation || 
                           loadingFood || loadingConflict || loadingRefugee;

  const generateSummary = async () => {
    setLoading(true);
    setError('');
    
    try {
      // 모든 데이터를 하나의 객체로 결합
      const completeData = {
        country,
        economyData,
        healthData,
        educationData,
        foodSecurityData,
        conflictData,
        refugeeData,
      };

      const response = await fetch(`/api/countries/${country.iso3}/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeData),
      });

      const data = await response.json();

      if (data.success) {
        setSummary(data.data.summary);
      } else {
        setError(data.error || 'Failed to generate summary.');
      }
    } catch (err) {
      setError('An error occurred while generating the summary.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={18} className="text-purple-500" />
          <h3 className="text-sm font-bold text-slate-800">AI Country Analysis</h3>
        </div>
        <p className="text-xs text-slate-600">
          Comprehensive analysis of this country's economic, social, and health data using OpenAI.
        </p>
      </div>

      {/* Data Loading Notice */}
      {isLoadingAnyData && !summary && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <Loader2 size={20} className="text-blue-500 animate-spin flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Collecting Data</h4>
              <p className="text-xs text-blue-700">
                Gathering data from all tabs. Please wait...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      {!summary && !loading && (
        <button
          onClick={generateSummary}
          disabled={isLoadingAnyData}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles size={20} />
          {isLoadingAnyData ? 'Collecting Data...' : 'Generate Summary'}
        </button>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl p-8 border border-slate-200 flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto text-purple-500" size={24} />
          </div>
          <p className="text-sm text-slate-600 font-medium">AI is analyzing the data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-1">Error Occurred</h4>
              <p className="text-sm text-red-700">{error}</p>
              {error.includes('API key') && (
                <p className="text-xs text-red-600 mt-2">
                  Please add OPENAI_API_KEY to your .env.local file.
                </p>
              )}
            </div>
          </div>
          <button
            onClick={generateSummary}
            className="mt-3 w-full bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      )}

      {/* Summary Display */}
      {summary && !loading && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="prose prose-sm max-w-none">
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {summary}
              </div>
            </div>
          </div>

          {/* Regenerate Button */}
          <button
            onClick={generateSummary}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            Generate New Summary
          </button>
        </div>
      )}

      {/* Info Footer */}
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
        <p className="text-xs text-blue-700">
          <strong>Note:</strong> This summary is AI-generated and should be used for reference only. 
          Additional verification is recommended for actual support decisions.
        </p>
      </div>
    </div>
  );
}
