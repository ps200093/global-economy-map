'use client';

import { CountryData } from '@/types';
import { X, ExternalLink, Heart, TrendingDown, Users } from 'lucide-react';
import { formatNumber, formatCurrency, getUrgencyColor } from '@/utils/helpers';

interface CountryDetailPanelProps {
  country: CountryData | null;
  onClose: () => void;
}

export default function CountryDetailPanel({ country, onClose }: CountryDetailPanelProps) {
  if (!country) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div 
          className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg"
          style={{ 
            backgroundImage: `linear-gradient(135deg, ${getUrgencyColor(country.urgencyLevel)}dd 0%, ${getUrgencyColor(country.urgencyLevel)} 100%)`
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-1">{country.nameKo || country.name}</h2>
              <p className="text-white text-opacity-90">{country.name} ({country.iso3})</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="mt-4 flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
              {country.urgencyLevel === 'critical' ? '🚨 매우 긴급' : 
               country.urgencyLevel === 'high' ? '⚠️ 긴급' : 
               country.urgencyLevel === 'medium' ? '📊 주의' : 
               country.urgencyLevel === 'low' ? '✅ 낮음' : '✅ 안정'}
            </span>
            <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
              인구: {formatNumber(country.population || 0)}
            </span>
          </div>
        </div>

        {/* 주요 지표 */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">주요 경제 지표</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="text-red-600" size={20} />
                <span className="text-sm text-gray-600 font-medium">빈곤율</span>
              </div>
              <p className="text-3xl font-bold text-red-600">
                {country.indicators?.poverty ? country.indicators.poverty.toFixed(1) : 'N/A'}%
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-blue-600" size={20} />
                <span className="text-sm text-gray-600 font-medium">1인당 GDP</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {country.gdpPerCapita ? formatCurrency(country.gdpPerCapita) : 'N/A'}
              </p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="text-amber-600" size={20} />
                <span className="text-sm text-gray-600 font-medium">실업률</span>
              </div>
              <p className="text-3xl font-bold text-amber-600">
                {country.unemploymentRate ? country.unemploymentRate.toFixed(1) : 'N/A'}%
              </p>
            </div>
          </div>

          {/* 추천 지원 분야 */}
          {country.recommendedSupport && (
            <div className="bg-purple-50 border border-purple-200 p-5 rounded-lg mb-6">
              <h4 className="font-bold text-purple-900 mb-2 text-lg">💡 추천 지원 분야</h4>
              <p className="text-purple-800 text-base">{country.recommendedSupport}</p>
            </div>
          )}

          {/* 추천 NGO */}
          {country.suggestedNGOs && country.suggestedNGOs.length > 0 ? (
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Heart className="text-pink-600" size={24} />
                추천 기부 단체
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                투명도가 검증된 신뢰할 수 있는 단체들입니다
              </p>
              
              <div className="space-y-4">
                {country.suggestedNGOs.map((ngo, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-pink-50 to-purple-50 p-5 rounded-lg border-2 border-pink-200">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-xl text-gray-800">{ngo.name}</h4>
                      <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold">
                        투명도 {ngo.transparencyScore}/100
                      </span>
                    </div>
                    {ngo.focusAreas && ngo.focusAreas.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {ngo.focusAreas.map((area, aIdx) => (
                          <span key={aIdx} className="bg-white px-3 py-1 rounded-full text-xs text-gray-700 border border-gray-300 font-medium">
                            {area}
                          </span>
                        ))}
                      </div>
                    )}
                    {ngo.website && (
                      <a
                        href={ngo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline"
                      >
                        웹사이트 방문하기
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-105">
                💝 안전하게 기부하기
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-600">현재 추천 가능한 기부 단체 정보가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
