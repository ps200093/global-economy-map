'use client';

import { CrisisCategory } from '@/types/api';
import { getIssueColor } from '@/utils/helpers';
import { Filter } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategories: CrisisCategory[];
  onToggleCategory: (category: CrisisCategory) => void;
  onClearAll: () => void;
  onSelectAll: () => void;
}

const CATEGORIES: CrisisCategory[] = [
  '전쟁/분쟁',
  '기아/식량부족',
  '빈곤',
  '교육',
  '보건/의료',
  '난민',
  '자연재해',
  '환경',
];

const CATEGORY_ICONS: Record<CrisisCategory, string> = {
  '전쟁/분쟁': '⚔️',
  '기아/식량부족': '🍞',
  '빈곤': '💰',
  '교육': '📚',
  '보건/의료': '🏥',
  '난민': '🏃',
  '자연재해': '🌪️',
  '환경': '🌱',
};

export default function CategoryFilter({
  selectedCategories,
  onToggleCategory,
  onClearAll,
  onSelectAll,
}: CategoryFilterProps) {
  const allSelected = selectedCategories.length === CATEGORIES.length;
  const noneSelected = selectedCategories.length === 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="text-blue-600" size={24} />
          <h3 className="text-xl font-bold text-gray-800">위기 카테고리 필터</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            disabled={allSelected}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            전체 선택
          </button>
          <button
            onClick={onClearAll}
            disabled={noneSelected}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            전체 해제
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        관심 있는 위기 유형을 선택하면 해당 지역이 지도에 강조 표시됩니다
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => onToggleCategory(category)}
              className={`p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 shadow-md scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{
                backgroundColor: isSelected ? `${getIssueColor(category)}15` : 'white',
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">{CATEGORY_ICONS[category]}</span>
                <span className={`text-sm font-semibold text-center ${
                  isSelected ? 'text-gray-900' : 'text-gray-600'
                }`}>
                  {category}
                </span>
                {isSelected && (
                  <span 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: getIssueColor(category) }}
                  >
                    ✓
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedCategories.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>{selectedCategories.length}개 카테고리</strong>가 선택되었습니다. 
            지도에서 해당 위기가 발생한 지역을 확인하세요.
          </p>
        </div>
      )}
    </div>
  );
}

