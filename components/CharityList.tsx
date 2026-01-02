'use client';

import { useState } from 'react';
import { CharityOrganization, EconomicIssueType } from '@/types';
import { CharityCard } from './RegionDetailPanel';
import { Search, Filter } from 'lucide-react';

interface CharityListProps {
  charities: CharityOrganization[];
}

export default function CharityList({ charities }: CharityListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFocusArea, setSelectedFocusArea] = useState<EconomicIssueType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'transparency' | 'impact'>('rating');

  // 필터링
  const filteredCharities = charities.filter(charity => {
    const matchesSearch = charity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         charity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFocus = selectedFocusArea === 'all' || charity.focusAreas.includes(selectedFocusArea);
    return matchesSearch && matchesFocus;
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

  const focusAreas: (EconomicIssueType | 'all')[] = ['all', '빈곤', '실업', '식량 부족', '교육', '보건', '인프라', '환경'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">신뢰할 수 있는 기부 단체</h2>
      
      {/* 검색 및 필터 */}
      <div className="mb-6 space-y-4">
        {/* 검색 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="단체명 또는 설명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 필터 및 정렬 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter size={16} className="inline mr-1" />
              활동 분야
            </label>
            <select
              value={selectedFocusArea}
              onChange={(e) => setSelectedFocusArea(e.target.value as EconomicIssueType | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {focusAreas.map(area => (
                <option key={area} value={area}>
                  {area === 'all' ? '전체' : area}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">정렬 기준</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'transparency' | 'impact')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="rating">평점 높은 순</option>
              <option value="transparency">투명성 높은 순</option>
              <option value="impact">영향력 큰 순</option>
            </select>
          </div>
        </div>
      </div>

      {/* 결과 카운트 */}
      <p className="text-sm text-gray-600 mb-4">
        {sortedCharities.length}개의 단체를 찾았습니다
      </p>

      {/* 기부 단체 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedCharities.map(charity => (
          <CharityCard key={charity.id} charity={charity} />
        ))}
      </div>

      {sortedCharities.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">검색 결과가 없습니다</p>
          <p className="text-sm mt-2">다른 검색어나 필터를 시도해보세요</p>
        </div>
      )}
    </div>
  );
}

