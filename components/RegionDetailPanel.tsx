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

  // Filter charities active in this region
  const relevantCharities = charities.filter(charity => 
    charity.focusAreas.some(area => region.issues.includes(area))
  );

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto">
      {/* Header */}
      <div 
        className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-start z-10"
      >
        <div>
          <h2 className="text-2xl font-bold mb-2">{region.name}</h2>
          <p className="text-blue-100">Population: {formatNumber(region.population)}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>

      {/* Urgency Level */}
      <div 
        className="p-4 text-white font-semibold flex items-center gap-2"
        style={{ backgroundColor: getUrgencyColor(region.urgencyLevel) }}
      >
        <AlertTriangle size={20} />
        Urgency: {region.urgencyLevel === 'critical' ? 'Very High' : 
                 region.urgencyLevel === 'high' ? 'High' : 
                 region.urgencyLevel === 'medium' ? 'Medium' : 'Low'}
      </div>

      <div className="p-6">
        {/* Basic Statistics */}
        <section className="mb-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Basic Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Users className="text-blue-600 mb-2" size={24} />
              <p className="text-sm text-gray-600">Total Population</p>
              <p className="text-xl font-bold text-gray-800">{formatNumber(region.population)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <TrendingDown className="text-red-600 mb-2" size={24} />
              <p className="text-sm text-gray-600">Poverty Rate</p>
              <p className="text-xl font-bold text-gray-800">{region.economicData.povertyRate.toFixed(1)}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <TrendingDown className="text-amber-600 mb-2" size={24} />
              <p className="text-sm text-gray-600">Unemployment Rate</p>
              <p className="text-xl font-bold text-gray-800">{region.economicData.unemploymentRate.toFixed(1)}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <DollarSign className="text-green-600 mb-2" size={24} />
              <p className="text-sm text-gray-600">GDP Per Capita</p>
              <p className="text-xl font-bold text-gray-800">{formatCurrency(region.economicData.gdpPerCapita)}</p>
            </div>
          </div>
        </section>

        {/* Economic Issues */}
        <section className="mb-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Major Economic Issues</h3>
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
            <p className="text-gray-600">No issue information available.</p>
          )}
        </section>

        {/* Recommended Charities */}
        <section>
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            Charities Helping This Region ({relevantCharities.length})
          </h3>
          {relevantCharities.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No charity information available for this region.</p>
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

// Charity card component
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
      
      {/* Transparency Score */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-gray-600">Transparency Index</span>
          <span className="text-xs font-bold text-blue-600">{charity.transparencyScore}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
            style={{ width: `${charity.transparencyScore}%` }}
          />
        </div>
      </div>

      {/* Focus Areas */}
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

      {/* Impact Metrics */}
      {!compact && charity.impactMetrics && (
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div className="bg-blue-50 p-2 rounded">
            <p className="text-gray-600">People Helped</p>
            <p className="font-bold text-blue-700">{formatNumber(charity.impactMetrics.peopleBenefited || 0)}</p>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <p className="text-gray-600">Projects Completed</p>
            <p className="font-bold text-green-700">{formatNumber(charity.impactMetrics.projectsCompleted || 0)}</p>
          </div>
        </div>
      )}

      {/* Certification Badges */}
      {charity.certifications && charity.certifications.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-1">Certifications</p>
          <div className="flex flex-wrap gap-1">
            {charity.certifications.map((cert, idx) => (
              <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Donate Button */}
      <div className="flex gap-2">
        <a
          href={charity.donationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center justify-center gap-1"
        >
          Donate <ExternalLink size={14} />
        </a>
        <a
          href={charity.website}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-semibold"
        >
          Details
        </a>
      </div>
    </div>
  );
}

export { CharityCard };

