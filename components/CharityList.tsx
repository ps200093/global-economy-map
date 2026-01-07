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

  // Filtering
  const filteredCharities = charities.filter(charity => {
    const matchesSearch = charity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         charity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFocus = selectedFocusArea === 'all' || charity.focusAreas.includes(selectedFocusArea);
    return matchesSearch && matchesFocus;
  });

  // Sorting
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

  const focusAreas: (EconomicIssueType | 'all')[] = ['all', 'Poverty', 'Unemployment', 'Food Shortage', 'Education', 'Health', 'Infrastructure', 'Environment'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Trusted Charity Organizations</h2>
      
      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter and Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter size={16} className="inline mr-1" />
              Focus Area
            </label>
            <select
              value={selectedFocusArea}
              onChange={(e) => setSelectedFocusArea(e.target.value as EconomicIssueType | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {focusAreas.map(area => (
                <option key={area} value={area}>
                  {area === 'all' ? 'All' : area}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'transparency' | 'impact')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="rating">Highest Rating</option>
              <option value="transparency">Highest Transparency</option>
              <option value="impact">Highest Impact</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result Count */}
      <p className="text-sm text-gray-600 mb-4">
        Found {sortedCharities.length} organizations
      </p>

      {/* Charity List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedCharities.map(charity => (
          <CharityCard key={charity.id} charity={charity} />
        ))}
      </div>

      {sortedCharities.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No search results</p>
          <p className="text-sm mt-2">Try different search terms or filters</p>
        </div>
      )}
    </div>
  );
}

