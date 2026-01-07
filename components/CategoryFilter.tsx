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
  'War/Conflict',
  'Hunger/Food Shortage',
  'Poverty',
  'Education',
  'Health/Medical',
  'Refugees',
  'Natural Disasters',
  'Environment',
];

const CATEGORY_ICONS: Record<CrisisCategory, string> = {
  'War/Conflict': '⚔️',
  'Hunger/Food Shortage': '🍞',
  'Poverty': '💰',
  'Education': '📚',
  'Health/Medical': '🏥',
  'Refugees': '🏃',
  'Natural Disasters': '🌪️',
  'Environment': '🌱',
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
          <h3 className="text-xl font-bold text-gray-800">Crisis Category Filter</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            disabled={allSelected}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Select All
          </button>
          <button
            onClick={onClearAll}
            disabled={noneSelected}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Select crisis types of interest to highlight those regions on the map
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
            <strong>{selectedCategories.length} categories</strong> selected. 
            View affected regions on the map.
          </p>
        </div>
      )}
    </div>
  );
}

