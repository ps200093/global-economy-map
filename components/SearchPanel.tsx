'use client';

import { useState, useMemo, useEffect } from 'react';
import { CountryData } from '@/types';
import { Search, X, MapPin, TrendingUp, Users, Heart, Cloud, Globe } from 'lucide-react';
import { formatNumber, getCountryFlagUrl } from '@/utils/helpers';
import { cn } from '@/lib/utils';

interface SearchPanelProps {
  countries: CountryData[];
  onCountrySelect: (country: CountryData) => void;
  onCharitySelect?: (charity: any) => void;
}

type PanelMode = 'search' | 'charity' | 'disaster';

export default function SearchPanel({ 
  countries, 
  onCountrySelect,
  onCharitySelect
}: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [panelMode, setPanelMode] = useState<PanelMode>('search');

  // Close country detail panel when tab changes
  const handleTabChange = (mode: PanelMode) => {
    if (mode !== panelMode) {
      onCountrySelect(null as any); // Close country detail panel
      onCharitySelect?.(null); // Close charity detail panel
      setPanelMode(mode);
    }
  };

  // Filter search results
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return countries.sort((a, b) => a.name.localeCompare(b.name, 'en'));
    }

    const query = searchQuery.toLowerCase().trim();
    return countries
      .filter(country => 
        country.name.toLowerCase().includes(query) ||
        country.nameKo?.toLowerCase().includes(query) ||
        country.iso3.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        const aStartsWith = a.name.toLowerCase().startsWith(query);
        const bStartsWith = b.name.toLowerCase().startsWith(query);
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return a.name.localeCompare(b.name, 'en');
      });
  }, [countries, searchQuery]);

  const handleCountryClick = (country: CountryData) => {
    onCharitySelect?.(null); // Close charity panel when country is selected
    onCountrySelect(country);
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      case 'stable': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  };

  const getUrgencyLabel = (level: string) => {
    switch (level) {
      case 'critical': return 'Critical';
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      case 'stable': return 'Stable';
      default: return level;
    }
  };

  const getUrgencyTextColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      case 'stable': return 'text-slate-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b flex-shrink-0">
        {/* Logo area */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Globe className="text-primary-foreground" size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">
              {panelMode === 'search' && 'Country Explorer'}
              {panelMode === 'charity' && 'Charities'}
              {panelMode === 'disaster' && 'Disasters'}
            </h2>
            <p className="text-[10px] text-muted-foreground">
              {panelMode === 'search' && `${filteredCountries.length} countries`}
              {panelMode === 'charity' && 'Verified organizations'}
              {panelMode === 'disaster' && 'GDACS live status'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-3">
          <button
            onClick={() => handleTabChange('search')}
            className={cn(
              "flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
              panelMode === 'search'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            )}
          >
            <Search size={12} />
            Search
          </button>
          <button
            onClick={() => handleTabChange('charity')}
            className={cn(
              "flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
              panelMode === 'charity'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            )}
          >
            <Heart size={12} />
            Donate
          </button>
          <button
            onClick={() => handleTabChange('disaster')}
            className={cn(
              "flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
              panelMode === 'disaster'
                ? 'bg-orange-500 text-white'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            )}
          >
            <Cloud size={12} />
            Disaster
          </button>
        </div>
        
        {/* Search input - only show in search mode */}
        {panelMode === 'search' && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Search className="text-muted-foreground" size={14} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search countries..."
              className="w-full h-8 pl-8 pr-8 rounded-md border bg-background text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center"
              >
                <X className="text-muted-foreground hover:text-foreground transition-colors" size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        {panelMode === 'search' && (
          <SearchContent 
            countries={filteredCountries} 
            onCountrySelect={handleCountryClick} 
            getUrgencyColor={getUrgencyColor} 
            getUrgencyLabel={getUrgencyLabel} 
            getUrgencyTextColor={getUrgencyTextColor} 
          />
        )}
        {panelMode === 'charity' && (
          <CharityContent 
            key="charity-content" 
            onCharitySelect={(charity) => {
              onCountrySelect(null as any); // Close country panel when charity is selected
              onCharitySelect?.(charity);
            }}
          />
        )}
        {panelMode === 'disaster' && <DisasterContent />}
      </div>
    </div>
  );
}

// Search mode content
function SearchContent({ countries, onCountrySelect, getUrgencyColor, getUrgencyLabel, getUrgencyTextColor }: any) {
  return (
    <div className="p-2">
      {countries.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
            <Search className="text-muted-foreground" size={20} />
          </div>
          <p className="text-foreground text-xs font-medium">No results found</p>
          <p className="text-muted-foreground text-[10px] mt-0.5">Try a different search term</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {countries.map((country: CountryData) => (
            <button
              key={country.id}
              onClick={() => onCountrySelect(country)}
              className="w-full p-2.5 rounded-md border bg-card text-left transition-all hover:bg-accent hover:border-primary/50 group"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {getCountryFlagUrl(country.iso3, 'w20') && (
                      <img 
                        src={getCountryFlagUrl(country.iso3, 'w20')}
                        alt={`${country.name} flag`}
                        className="w-4 h-3 object-cover rounded shadow-sm flex-shrink-0 border"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                    <h3 className="font-semibold text-xs text-foreground group-hover:text-primary truncate transition-colors">
                      {country.name}
                    </h3>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{country.iso3}</p>
                </div>
                <span className={cn(
                  "flex-shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase text-white",
                  getUrgencyColor(country.urgencyLevel)
                )}>
                  {getUrgencyLabel(country.urgencyLevel)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                <div className="bg-muted/50 rounded p-1.5">
                  <div className="flex items-center gap-1 mb-0.5">
                    <Users size={9} className="text-muted-foreground" />
                    <span className="text-[9px] text-muted-foreground uppercase">Pop.</span>
                  </div>
                  <p className="text-[10px] font-semibold text-foreground">{formatNumber(country.population)}</p>
                </div>
                
                {country.scores?.overall !== undefined && (
                  <div className="bg-muted/50 rounded p-1.5">
                    <div className="flex items-center gap-1 mb-0.5">
                      <TrendingUp size={9} className="text-muted-foreground" />
                      <span className="text-[9px] text-muted-foreground uppercase">Score</span>
                    </div>
                    <p className={cn("text-[10px] font-bold", getUrgencyTextColor(country.urgencyLevel))}>
                      {country.scores.overall.toFixed(1)} pts
                    </p>
                  </div>
                )}
              </div>

              {country.indicators?.poverty !== undefined && (
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] text-muted-foreground">Poverty Rate</span>
                    <span className="text-[10px] font-bold text-destructive">{country.indicators.poverty.toFixed(1)}%</span>
                  </div>
                  <div className="relative w-full bg-muted rounded-full h-1 overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-destructive rounded-full transition-all"
                      style={{ width: `${Math.min(country.indicators.poverty, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Charity mode content
function CharityContent({ onCharitySelect }: { onCharitySelect: (charity: any) => void }) {
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCharities() {
      try {
        const response = await fetch('/api/charities?limit=100&sortBy=transparencyScore&sortOrder=desc');
        const data = await response.json();
        if (data.success) {
          setCharities(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch charities:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCharities();
  }, []);

  if (loading) {
    return (
      <div className="p-2 text-center py-10">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-muted border-t-primary mx-auto mb-2"></div>
        <p className="text-muted-foreground text-xs">Loading charities...</p>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-1.5">
      {charities.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
            <Heart className="text-muted-foreground" size={20} />
          </div>
          <p className="text-foreground text-xs">No charity information available</p>
        </div>
      ) : (
        charities.map((charity, idx) => (
          <div
            key={charity.ein || idx}
            onClick={() => onCharitySelect(charity)}
            className="p-2.5 rounded-md border bg-card cursor-pointer transition-all hover:bg-accent hover:border-primary/50 group"
          >
            <div className="flex justify-between items-start mb-1.5">
              <div className="flex-1">
                <h4 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors mb-0.5 line-clamp-1">{charity.name}</h4>
                <p className="text-[10px] text-muted-foreground line-clamp-2">{charity.description}</p>
              </div>
              {charity.transparencyScore !== undefined ? (
                <span className="flex-shrink-0 ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground">
                  {charity.transparencyScore}
                </span>
              ) : (
                <span className="flex-shrink-0 ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                  N/A
                </span>
              )}
            </div>
            {charity.category && charity.category.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {charity.category.slice(0, 2).map((cat: string, i: number) => (
                  <span key={i} className="px-1.5 py-0.5 rounded-full text-[9px] border bg-background">
                    {cat}
                  </span>
                ))}
                {charity.category.length > 2 && (
                  <span className="text-[9px] text-muted-foreground font-medium">
                    +{charity.category.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// Disaster mode content
function DisasterContent() {
  const [disasters, setDisasters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchDisasters() {
      try {
        const response = await fetch('https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH');
        const data = await response.json();
        if (data.features) {
          setDisasters(data.features);
        }
      } catch (error) {
        console.error('Failed to fetch disasters:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDisasters();
  }, []);

  if (loading) {
    return (
      <div className="p-2 text-center py-10">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-muted border-t-orange-500 mx-auto mb-2"></div>
        <p className="text-muted-foreground text-xs">Loading disaster info...</p>
      </div>
    );
  }

  // Pagination calculation
  const totalPages = Math.ceil(disasters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDisasters = disasters.slice(startIndex, endIndex);

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'EQ': 'bg-red-500',
      'TC': 'bg-blue-500',
      'FL': 'bg-cyan-500',
      'DR': 'bg-yellow-500',
      'VO': 'bg-orange-500',
      'WF': 'bg-amber-500',
    };
    return colors[type] || 'bg-slate-500';
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'EQ': 'Earthquake',
      'TC': 'Cyclone',
      'FL': 'Flood',
      'DR': 'Drought',
      'VO': 'Volcano',
      'WF': 'Wildfire',
    };
    return labels[type] || type;
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      'Red': 'text-red-600 bg-red-50 border-red-200',
      'Orange': 'text-orange-600 bg-orange-50 border-orange-200',
      'Green': 'text-green-600 bg-green-50 border-green-200',
    };
    return colors[severity] || 'text-slate-600 bg-slate-50 border-slate-200';
  };

  return (
    <div className="p-2">
      {disasters.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
            <Cloud className="text-muted-foreground" size={20} />
          </div>
          <p className="text-foreground text-xs">No disaster information available</p>
        </div>
      ) : (
        <>
          {/* Statistics Summary */}
          <div className="p-2.5 rounded-md mb-2 bg-orange-50 border border-orange-200">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Cloud size={14} className="text-orange-600" />
              <h3 className="font-bold text-xs text-foreground">Statistics</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-muted-foreground">Total:</span>
                <span className="font-bold text-foreground ml-1">{disasters.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Page:</span>
                <span className="font-bold text-foreground ml-1">{currentPage}/{totalPages}</span>
              </div>
            </div>
          </div>

          {/* Disaster List */}
          <div className="space-y-1.5 mb-2">
            {currentDisasters.map((disaster, idx) => {
              const props = disaster.properties || {};
              
              const gdacsReportUrl = typeof props.url === 'object' && props.url?.report 
                ? props.url.report 
                : (props.eventid && props.eventtype && props.episodeid 
                  ? `https://www.gdacs.org/report.aspx?eventid=${props.eventid}&episodeid=${props.episodeid}&eventtype=${props.eventtype}` 
                  : null);
              
              const alertLevel = props.alertlevel || props.episodealertlevel || props.severity;
              
              return (
                <div
                  key={disaster.id || idx}
                  className="p-2.5 rounded-md border bg-card"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={cn("text-white px-1.5 py-0.5 rounded text-[10px] font-bold", getEventTypeColor(props.eventtype))}>
                        {getEventTypeLabel(props.eventtype)}
                      </span>
                      {alertLevel && (
                        <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold border", getSeverityColor(alertLevel))}>
                          {alertLevel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Country and Date */}
                  <div className="mb-1.5">
                    {props.country && (
                      <p className="font-bold text-xs text-foreground mb-0.5">
                        📍 {props.country}
                      </p>
                    )}
                    {props.name && (
                      <p className="text-[10px] text-muted-foreground mb-0.5 line-clamp-1">{props.name}</p>
                    )}
                    {props.fromdate && (
                      <p className="text-[10px] text-muted-foreground">
                        🕐 {new Date(props.fromdate).toLocaleDateString('en-US')}
                      </p>
                    )}
                  </div>

                  {/* GDACS Link */}
                  {gdacsReportUrl && (
                    <a
                      href={gdacsReportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-2 py-1.5 rounded bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-center text-[10px]"
                    >
                      🔗 View Report
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={cn(
                  "px-2.5 py-1 rounded text-[10px] font-medium transition-colors",
                  currentPage === 1
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                Prev
              </button>
              <span className="text-[10px] text-muted-foreground font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={cn(
                  "px-2.5 py-1 rounded text-[10px] font-medium transition-colors",
                  currentPage === totalPages
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
