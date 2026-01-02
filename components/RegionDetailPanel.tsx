'use client';

import { RegionData, CharityOrganization } from '@/types';
import { X, Users, TrendingDown, DollarSign, AlertTriangle, ExternalLink } from 'lucide-react';
import { formatNumber, formatCurrency, getIssueColor, getUrgencyColor, getRatingStars } from '@/utils/helpers';

interface RegionDetailPanelProps {
  region: RegionData | null;
  onClose: () => void;
  charities?: CharityOrganization[];
}

export default function RegionDetailPanel({ region, onClose, charities = [] }: RegionDetailPanelProps) {
  if (!region) return null;

  // 해당 지역에서 활동하는 기부 단체 필터링
  const relevantCharities = charities.filter(charity => 
    charity.focusAreas.some(area => region.issues.includes(area))
  );

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto">
      {/* 헤더 */}
      <div 
        className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-start z-10"
      >
        <div>
          <h2 className="text-2xl font-bold mb-2">{region.name}</h2>
          <p className="text-blue-100">인구: {formatNumber(region.population)}명</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
          aria-label="닫기"
        >
          <X size={24} />
        </button>
      </div>

      {/* 긴급도 표시 */}
      <div 
        className="p-4 text-white font-semibold flex items-center gap-2"
        style={{ backgroundColor: getUrgencyColor(region.urgencyLevel) }}
      >
        <AlertTriangle size={20} />
        긴급도: {region.urgencyLevel === 'critical' ? '매우 높음' : 
                 region.urgencyLevel === 'high' ? '높음' : 
                 region.urgencyLevel === 'medium' ? '보통' : '낮음'}
      </div>

      <div className="p-6">
        {/* 기본 통계 */}
        <section className="mb-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">기본 통계</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Users className="text-blue-600 mb-2" size={24} />
              <p className="text-sm text-gray-600">총 인구</p>
              <p className="text-xl font-bold text-gray-800">{formatNumber(region.population)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <TrendingDown className="text-red-600 mb-2" size={24} />
              <p className="text-sm text-gray-600">빈곤율</p>
              <p className="text-xl font-bold text-gray-800">{region.economicData.povertyRate.toFixed(1)}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <TrendingDown className="text-amber-600 mb-2" size={24} />
              <p className="text-sm text-gray-600">실업률</p>
              <p className="text-xl font-bold text-gray-800">{region.economicData.unemploymentRate.toFixed(1)}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <DollarSign className="text-green-600 mb-2" size={24} />
              <p className="text-sm text-gray-600">1인당 GDP</p>
              <p className="text-xl font-bold text-gray-800">{formatCurrency(region.economicData.gdpPerCapita)}</p>
            </div>
          </div>
        </section>

        {/* 경제 이슈 */}
        <section className="mb-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">주요 경제 이슈</h3>
          {region.issues && region.issues.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {region.issues.map((issue, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-white text-sm font-semibold"
                  style={{ backgroundColor: getIssueColor(issue) }}
                >
                  {issue}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">이슈 정보가 없습니다.</p>
          )}
        </section>

        {/* 추천 기부 단체 */}
        <section>
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            이 지역을 돕는 기부 단체 ({relevantCharities.length})
          </h3>
          {relevantCharities.length === 0 ? (
            <p className="text-gray-600 text-center py-4">해당 지역에서 활동하는 기부 단체 정보가 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {relevantCharities.slice(0, 5).map((charity) => (
                <CharityCard key={charity.id} charity={charity} compact />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// 기부 단체 카드 컴포넌트
function CharityCard({ charity, compact = false }: { charity: CharityOrganization; compact?: boolean }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-gray-800">{charity.name}</h4>
        <div className="flex flex-col items-end">
          <span className="text-yellow-500 text-sm">{getRatingStars(charity.rating)}</span>
          <span className="text-xs text-gray-600">{charity.rating}/5</span>
        </div>
      </div>
      
      {!compact && <p className="text-sm text-gray-700 mb-3">{charity.description}</p>}
      
      {/* 청렴도 점수 */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-gray-600">투명성 지수</span>
          <span className="text-xs font-bold text-blue-600">{charity.transparencyScore}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
            style={{ width: `${charity.transparencyScore}%` }}
          />
        </div>
      </div>

      {/* 활동 분야 */}
      <div className="flex flex-wrap gap-1 mb-3">
        {charity.focusAreas.slice(0, 3).map((area, idx) => (
          <span
            key={idx}
            className="text-xs px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: getIssueColor(area) }}
          >
            {area}
          </span>
        ))}
        {charity.focusAreas.length > 3 && (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
            +{charity.focusAreas.length - 3}
          </span>
        )}
      </div>

      {/* 영향력 지표 */}
      {!compact && charity.impactMetrics && (
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div className="bg-blue-50 p-2 rounded">
            <p className="text-gray-600">지원한 사람</p>
            <p className="font-bold text-blue-700">{formatNumber(charity.impactMetrics.peopleBenefited || 0)}</p>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <p className="text-gray-600">완료 프로젝트</p>
            <p className="font-bold text-green-700">{formatNumber(charity.impactMetrics.projectsCompleted || 0)}</p>
          </div>
        </div>
      )}

      {/* 인증 배지 */}
      {charity.certifications && charity.certifications.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-1">인증</p>
          <div className="flex flex-wrap gap-1">
            {charity.certifications.map((cert, idx) => (
              <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 기부 버튼 */}
      <div className="flex gap-2">
        <a
          href={charity.donationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center justify-center gap-1"
        >
          기부하기 <ExternalLink size={14} />
        </a>
        <a
          href={charity.website}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-semibold"
        >
          상세보기
        </a>
      </div>
    </div>
  );
}

export { CharityCard };

