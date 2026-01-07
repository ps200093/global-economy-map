'use client';

import { CountryData } from '@/types';
import { X, MapPin } from 'lucide-react';
import { formatNumber, formatCurrency } from '@/utils/helpers';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  countries: CountryData[];
  onCountryClick: (country: CountryData) => void;
  statType: 'poverty' | 'povertyRate' | 'funding' | 'crisis';
}

export default function StatsModal({ 
  isOpen, 
  onClose, 
  title, 
  countries, 
  onCountryClick,
  statType 
}: StatsModalProps) {
  if (!isOpen) return null;

  const getStatValue = (country: CountryData) => {
    switch (statType) {
      case 'poverty':
        const povertyRate = country.indicators?.poverty || 0;
        const pop = country.population || 0;
        return pop * povertyRate / 100;
      case 'povertyRate':
        return country.indicators?.poverty || 0;
      case 'funding':
        const rate = country.indicators?.poverty || 0;
        const population = country.population || 0;
        const povertyPop = population * rate / 100;
        return povertyPop * 500;
      case 'crisis':
        return country.scores?.overall || 0;
      default:
        return 0;
    }
  };

  const formatStatValue = (value: number) => {
    switch (statType) {
      case 'poverty':
        return formatNumber(value);
      case 'povertyRate':
        return `${value.toFixed(1)}%`;
      case 'funding':
        return formatCurrency(value);
      case 'crisis':
        return `${value.toFixed(1)} pts`;
      default:
        return value.toString();
    }
  };

  const getReasonText = (country: CountryData, value: number) => {
    switch (statType) {
      case 'poverty':
        return `${(country.indicators?.poverty || 0).toFixed(1)}% of population in poverty`;
      case 'povertyRate':
        return `Poverty rate among total population`;
      case 'funding':
        return `${formatNumber((country.population || 0) * (country.indicators?.poverty || 0) / 100)} people need support`;
      case 'crisis':
        const urgencyLabels: Record<string, string> = {
          critical: 'Critical',
          high: 'High',
          medium: 'Medium',
          low: 'Low',
          stable: 'Stable'
        };
        return `Urgency: ${urgencyLabels[country.urgencyLevel] || country.urgencyLevel}`;
      default:
        return '';
    }
  };

  // Gradient from red (worst) to lighter red/orange (less severe)
  const getRankBadgeStyle = (index: number) => {
    if (index <= 2) return 'bg-red-600 text-white';
    if (index <= 5) return 'bg-red-500 text-white';
    if (index <= 7) return 'bg-orange-500 text-white';
    return 'bg-orange-400 text-white';
  };

  // Extract top 10 countries
  const sortedCountries = [...countries]
    .map(country => ({
      country,
      value: getStatValue(country)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const handleCountryClick = (country: CountryData) => {
    onCountryClick(country);
    onClose();
  };

  // Get title without "Top 10"
  const getCleanTitle = () => {
    switch (statType) {
      case 'poverty':
        return 'Countries by Poverty Population';
      case 'povertyRate':
        return 'Countries by Poverty Rate';
      case 'funding':
        return 'Countries by Funding Needed';
      case 'crisis':
        return 'Countries by Crisis Level';
      default:
        return title;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div 
        className="bg-card border rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden mx-4 shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{getCleanTitle()}</h2>
            <p className="text-white/80 text-xs mt-1">Click to view on map</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Country List */}
        <div className="overflow-y-auto max-h-[calc(80vh-100px)] p-4">
          <div className="space-y-2">
            {sortedCountries.map(({ country, value }, index) => (
              <button
                key={country.id}
                onClick={() => handleCountryClick(country)}
                className="w-full bg-muted/50 hover:bg-muted border rounded-lg p-3 text-left group transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getRankBadgeStyle(index)}`}>
                    {index + 1}
                  </div>

                  {/* Country Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                        {country.name}
                      </h3>
                      <MapPin size={12} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {getReasonText(country, value)}
                    </p>
                  </div>

                  {/* Value Display */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-bold text-red-600">
                      {formatStatValue(value)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Pop: {formatNumber(country.population || 0)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
