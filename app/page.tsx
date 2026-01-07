'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { RegionData, CharityOrganization, CountryData } from '@/types';
import { CountryScore } from '@/types/country';
import GlobalStatsDashboard from '@/components/GlobalStatsDashboard';
import CountryDetailPanel from '@/components/CountryDetailPanel';
import CharityDetailPanel from '@/components/CharityDetailPanel';
import StatsModal from '@/components/StatsModal';
import SearchPanel from '@/components/SearchPanel';
import { Globe, BarChart3 } from 'lucide-react';

// Client-side only map rendering (Leaflet doesn't support SSR)
const WorldMap = dynamic(() => import('@/components/WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-muted-foreground font-medium">Loading map...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedCharity, setSelectedCharity] = useState<any>(null);
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [charitiesData, setCharitiesData] = useState<CharityOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [selectedStatType, setSelectedStatType] = useState<'poverty' | 'povertyRate' | 'funding' | 'crisis'>('poverty');

  // Load country data from MongoDB
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Fetch all country data from MongoDB
        const [countriesResponse, charitiesResponse] = await Promise.all([
          fetch('/api/countries').then(r => r.json()),
          fetch('/api/charities').then(r => r.json()),
        ]);

        if (countriesResponse.success) {
          // Convert CountryScore to CountryData
          const countryData: CountryData[] = countriesResponse.data.map((c: CountryScore) => ({
            id: c.iso3.toLowerCase(),
            name: c.name,
            nameKo: c.nameKo,
            iso3: c.iso3,
            coordinates: c.coordinates,
            indicators: {
              ...c.indicators,
              poverty: c.indicators.povertyRate || 0,
            },
            scores: c.scores,
            urgencyLevel: c.urgencyLevel,
            population: c.indicators.population || 0,
            gdpPerCapita: c.indicators.gdpPerCapita,
            unemploymentRate: c.indicators.unemploymentRate,
            suggestedNGOs: c.suggestedNGOs || [],
            recommendedSupport: c.recommendedSupport,
          }));
          setCountries(countryData);
        } else {
          console.warn('Failed to load countries:', countriesResponse.error);
          setError('Failed to load country data.');
        }

        if (charitiesResponse.success) {
          const charities: CharityOrganization[] = charitiesResponse.data.map((charity: any) => ({
            id: charity.id,
            name: charity.name,
            description: charity.description,
            transparencyScore: charity.transparencyScore,
            rating: charity.rating,
            focusAreas: charity.focusAreas || [],
            website: charity.website,
            donationLink: charity.donationLink,
          }));
          setCharitiesData(charities);
        } else {
          console.warn('Failed to load charities:', charitiesResponse.error);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('An error occurred while loading data.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Calculate global statistics (based on country data)
  const globalStats = {
    totalPopulationInPoverty: countries.reduce((sum, c) => {
      const povertyRate = c.indicators?.poverty || 0;
      const pop = c.population || 0;
      return sum + (pop * povertyRate / 100);
    }, 0),
    averagePovertyRate: countries.length > 0 
      ? countries.reduce((sum, c) => sum + (c.indicators?.poverty || 0), 0) / countries.length 
      : 0,
    totalFundingNeeded: countries.reduce((sum, c) => {
      const povertyRate = c.indicators?.poverty || 0;
      const pop = c.population || 0;
      const povertyPopulation = pop * povertyRate / 100;
      return sum + (povertyPopulation * 500);
    }, 0),
    regionsInCrisis: countries.filter(c => 
      c.urgencyLevel === 'critical' || c.urgencyLevel === 'high'
    ).length,
  };

  // Get modal title
  const getModalTitle = (statType: 'poverty' | 'povertyRate' | 'funding' | 'crisis') => {
    switch (statType) {
      case 'poverty':
        return 'Top 10 Countries by Poverty Population';
      case 'povertyRate':
        return 'Top 10 Countries by Poverty Rate';
      case 'funding':
        return 'Top 10 Countries by Funding Needed';
      case 'crisis':
        return 'Top 10 Countries by Crisis Level';
      default:
        return '';
    }
  };

  // Stats click handler
  const handleStatClick = (statType: 'poverty' | 'povertyRate' | 'funding' | 'crisis') => {
    setSelectedStatType(statType);
    setStatsModalOpen(true);
  };

  // Modal country click handler (move to map)
  const handleModalCountryClick = (country: CountryData) => {
    setSelectedCharity(null); // Close charity panel
    setSelectedCountry(country);
  };

  // Search panel country select handler
  const handleSearchCountrySelect = (country: CountryData | null) => {
    setSelectedCharity(null); // Close charity panel when country is selected
    setSelectedCountry(country);
  };

  // Search panel charity select handler
  const handleSearchCharitySelect = (charity: any) => {
    setSelectedCountry(null); // Close country panel when charity is selected
    setSelectedCharity(charity);
  };

  // Map country click handler
  const handleMapCountryClick = (country: CountryData | null) => {
    setSelectedCharity(null); // Close charity panel when country is clicked on map
    setSelectedCountry(country);
  };

  // Close all panels when clicking outside
  const handleOutsideClick = () => {
    setSelectedCountry(null);
    setSelectedCharity(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-muted rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
            <Globe className="absolute inset-0 m-auto text-primary" size={32} />
          </div>
          <p className="text-muted-foreground mt-6 font-medium">Loading data...</p>
          <p className="text-muted-foreground/60 text-sm mt-1">Collecting information from 200+ countries</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center bg-card p-8 rounded-lg shadow-sm border max-w-md">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="text-destructive" size={32} />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">Global Economy Monitor</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted text-sm">
              <BarChart3 size={14} className="text-primary" />
              <span className="text-muted-foreground">
                <span className="font-bold text-primary">{countries.length}</span> Countries
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-destructive/10 text-sm">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">
                <span className="font-bold text-destructive">{globalStats.regionsInCrisis}</span> Critical
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Dashboard */}
      <div className="flex-shrink-0 border-b bg-muted/30">
        <div className="container py-2">
          <GlobalStatsDashboard stats={globalStats} onStatClick={handleStatClick} />
        </div>
      </div>

      {/* Main Content - Three column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Search Panel */}
        <div className="w-80 flex-shrink-0 border-r bg-card overflow-y-auto">
          <SearchPanel
            countries={countries}
            onCountrySelect={handleSearchCountrySelect}
            onCharitySelect={handleSearchCharitySelect}
          />
        </div>

        {/* Center - Map View */}
        <div className="flex-1 relative">
          <WorldMap
            countries={countries}
            onCountryClick={handleMapCountryClick}
            onMapClick={handleOutsideClick}
            selectedCountry={selectedCountry}
          />
          
          {/* Legend - Bottom Right */}
          <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur rounded-lg border p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-3 bg-gradient-to-b from-destructive to-primary rounded-full"></div>
              <h3 className="text-xs font-bold text-foreground">Crisis Level</h3>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                  <span>Critical</span>
                </div>
                <span className="text-muted-foreground">≥90</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span>High</span>
                </div>
                <span className="text-muted-foreground">70-89</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span>Medium</span>
                </div>
                <span className="text-muted-foreground">50-69</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span>Low</span>
                </div>
                <span className="text-muted-foreground">30-49</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground" />
                  <span>Stable</span>
                </div>
                <span className="text-muted-foreground">&lt;30</span>
              </div>
            </div>
          </div>

          {/* Data Source - Bottom Left */}
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur rounded-md border px-2.5 py-1 flex items-center gap-2 text-[11px] text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            <span>Live Data | World Bank, UNHCR, ACLED</span>
          </div>
        </div>

        {/* Right Sidebar - Detail Panels (Country or Charity) */}
        {selectedCountry && (
          <CountryDetailPanel
            country={selectedCountry}
            onClose={() => setSelectedCountry(null)}
          />
        )}
        {selectedCharity && (
          <CharityDetailPanel
            charity={selectedCharity}
            onClose={() => setSelectedCharity(null)}
          />
        )}
      </div>

      {/* Stats Modal */}
      <StatsModal
        isOpen={statsModalOpen}
        onClose={() => setStatsModalOpen(false)}
        title={getModalTitle(selectedStatType)}
        countries={countries}
        onCountryClick={handleModalCountryClick}
        statType={selectedStatType}
      />
    </div>
  );
}
