'use client';

import { useState } from 'react';
import { EnhancedCharityOrganization, CrisisCategory } from '@/types/api';
import { Search, MapPin, ChevronRight, ExternalLink } from 'lucide-react';
import { getRatingStars, getIssueColor } from '@/utils/helpers';

interface CharitySidebarProps {
  charities: EnhancedCharityOrganization[];
  selectedCategories: CrisisCategory[];
  onCharitySelect: (charity: EnhancedCharityOrganization | null) => void;
  selectedCharity: EnhancedCharityOrganization | null;
}

export default function CharitySidebar({
  charities,
  selectedCategories,
  onCharitySelect,
  selectedCharity,
}: CharitySidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'transparency' | 'impact'>('rating');

  // 필터링
  const filteredCharities = charities.filter((charity) => {
    const matchesSearch =
      charity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charity.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      charity.focusAreas.some((area) => selectedCategories.includes(area));

    return matchesSearch && matchesCategory;
  });

  // 정렬
  const sortedCharities = [...filteredCharities].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'transparency':
        return b.transparencyScore - a.transparencyScore;
      case 'impact':
        return b.impactMetrics.peopleBenefited - a.impactMetrics.peopleBenefited;
      default:
        return 0;
    }
  });

  return (
    <div className="h-full flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-xl font-bold mb-2">기부 단체</h2>
        <p className="text-sm text-blue-100">
          {sortedCharities.length}개의 신뢰할 수 있는 단체
        </p>
      </div>

      {/* 검색 및 정렬 */}
      <div className="p-4 border-b space-y-3">
        {/* 검색 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="단체명 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* 정렬 */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="rating">평점 높은 순</option>
          <option value="transparency">투명성 높은 순</option>
          <option value="impact">영향력 큰 순</option>
        </select>
      </div>

      {/* 기부 단체 목록 */}
      <div className="flex-1 overflow-y-auto">
        {sortedCharities.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>검색 결과가 없습니다</p>
          </div>
        ) : (
          <div className="divide-y">
            {sortedCharities.map((charity) => (
              <CharityItem
                key={charity.id}
                charity={charity}
                isSelected={selectedCharity?.id === charity.id}
                onSelect={() => onCharitySelect(charity)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 기부 단체 아이템 컴포넌트
function CharityItem({
  charity,
  isSelected,
  onSelect,
}: {
  charity: EnhancedCharityOrganization;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`p-4 cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-gray-800 text-sm flex-1">{charity.name}</h3>
        <ChevronRight
          className={`text-gray-400 transition-transform ${isSelected ? 'rotate-90' : ''}`}
          size={18}
        />
      </div>

      {/* 평점 및 투명성 */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center gap-1">
          <span className="text-yellow-500 text-xs">{getRatingStars(charity.rating)}</span>
          <span className="text-xs text-gray-600">{charity.rating}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-16 bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full"
              style={{ width: `${charity.transparencyScore}%` }}
            />
          </div>
          <span className="text-xs text-gray-600">{charity.transparencyScore}%</span>
        </div>
      </div>

      {/* 활동 분야 */}
      <div className="flex flex-wrap gap-1 mb-2">
        {charity.focusAreas.slice(0, 2).map((area, idx) => (
          <span
            key={idx}
            className="text-xs px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: getIssueColor(area) }}
          >
            {area}
          </span>
        ))}
        {charity.focusAreas.length > 2 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
            +{charity.focusAreas.length - 2}
          </span>
        )}
      </div>

      {/* 활동 지역 */}
      <div className="flex items-center gap-1 text-xs text-gray-600">
        <MapPin size={12} />
        <span>{charity.regions.length}개 지역에서 활동</span>
      </div>

      {/* 확장된 정보 (선택시) */}
      {isSelected && (
        <div className="mt-3 pt-3 border-t space-y-2">
          <p className="text-xs text-gray-700">{charity.description}</p>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-blue-50 p-2 rounded">
              <p className="text-gray-600">지원한 사람</p>
              <p className="font-bold text-blue-700">
                {(charity.impactMetrics.peopleBenefited / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="bg-green-50 p-2 rounded">
              <p className="text-gray-600">활동 국가</p>
              <p className="font-bold text-green-700">
                {charity.impactMetrics.countriesActive}개국
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href={charity.donationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs font-semibold flex items-center justify-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              기부하기 <ExternalLink size={12} />
            </a>
            <a
              href={charity.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-xs font-semibold"
              onClick={(e) => e.stopPropagation()}
            >
              더보기
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

