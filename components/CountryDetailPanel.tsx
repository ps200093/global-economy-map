'use client';

import { CountryData } from '@/types';
import { X, DollarSign, Activity, GraduationCap, Wheat, Shield, Home, TrendingUp, TrendingDown, Users, Info } from 'lucide-react';
import { formatNumber, formatCurrency, getUrgencyColor, getCountryFlagUrl } from '@/utils/helpers';
import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  OverviewTab,
  EconomyTab,
  HealthTab,
  EducationTab,
  FoodTab,
  ScoresTab,
  ConflictTab,
  RefugeeTab,
  FoodSecurityAPIData,
  ConflictAPIData,
  RefugeeAPIData,
  EconomyAPIData,
  HealthAPIData,
  EducationAPIData,
  urgencyLabels,
} from './country-detail-tabs';

interface CountryDetailPanelProps {
  country: CountryData | null;
  onClose: () => void;
}

type TabType = 'overview' | 'economy' | 'health' | 'education' | 'food' | 'scores' | 'conflict' | 'refugee';

export default function CountryDetailPanel({ country, onClose }: CountryDetailPanelProps) {
  if (!country) return null;

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [foodSecurityData, setFoodSecurityData] = useState<FoodSecurityAPIData | null>(null);
  const [loadingFoodData, setLoadingFoodData] = useState(false);
  const [conflictData, setConflictData] = useState<ConflictAPIData | null>(null);
  const [loadingConflictData, setLoadingConflictData] = useState(false);
  const [refugeeData, setRefugeeData] = useState<RefugeeAPIData | null>(null);
  const [loadingRefugeeData, setLoadingRefugeeData] = useState(false);
  const [economyData, setEconomyData] = useState<EconomyAPIData | null>(null);
  const [loadingEconomyData, setLoadingEconomyData] = useState(false);
  const [healthData, setHealthData] = useState<HealthAPIData | null>(null);
  const [loadingHealthData, setLoadingHealthData] = useState(false);
  const [educationData, setEducationData] = useState<EducationAPIData | null>(null);
  const [loadingEducationData, setLoadingEducationData] = useState(false);

  // Drag scroll for tab navigation
  const tabNavRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!tabNavRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tabNavRef.current.offsetLeft);
    setScrollLeft(tabNavRef.current.scrollLeft);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !tabNavRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabNavRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    tabNavRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  // Reset data when country changes
  useEffect(() => {
    setFoodSecurityData(null);
    setConflictData(null);
    setRefugeeData(null);
    setEconomyData(null);
    setHealthData(null);
    setEducationData(null);
    setActiveTab('overview');
  }, [country?.iso3]);

  // Fetch food security data
  useEffect(() => {
    if (activeTab === 'food' && country && !foodSecurityData) {
      setLoadingFoodData(true);
      fetch(`/api/countries/${country.iso3}/food-security`)
        .then(res => res.json())
        .then(response => {
          if (response.success) {
            setFoodSecurityData(response.data);
          }
        })
        .catch(error => console.error('Error loading food security data:', error))
        .finally(() => setLoadingFoodData(false));
    }
  }, [activeTab, country, foodSecurityData]);

  // Fetch conflict data
  useEffect(() => {
    if (activeTab === 'conflict' && country && !conflictData) {
      setLoadingConflictData(true);
      fetch(`/api/countries/${country.iso3}/conflict`)
        .then(res => res.json())
        .then(response => {
          if (response.success) {
            setConflictData(response.data);
          }
        })
        .catch(error => console.error('Error loading conflict data:', error))
        .finally(() => setLoadingConflictData(false));
    }
  }, [activeTab, country, conflictData]);

  // Fetch refugee data
  useEffect(() => {
    if (activeTab === 'refugee' && country && !refugeeData) {
      setLoadingRefugeeData(true);
      fetch(`/api/countries/${country.iso3}/refugee`)
        .then(res => res.json())
        .then(response => {
          if (response.success) {
            setRefugeeData(response.data);
          }
        })
        .catch(error => console.error('Error loading refugee data:', error))
        .finally(() => setLoadingRefugeeData(false));
    }
  }, [activeTab, country, refugeeData]);

  // Fetch economy data
  useEffect(() => {
    if (activeTab === 'economy' && country && !economyData) {
      setLoadingEconomyData(true);
      fetch(`/api/countries/${country.iso3}/economy`)
        .then(res => res.json())
        .then(response => {
          if (response.success) {
            setEconomyData(response.data);
          }
        })
        .catch(error => console.error('Error loading economy data:', error))
        .finally(() => setLoadingEconomyData(false));
    }
  }, [activeTab, country, economyData]);

  // Fetch health data
  useEffect(() => {
    if (activeTab === 'health' && country && !healthData) {
      setLoadingHealthData(true);
      fetch(`/api/countries/${country.iso3}/health`)
        .then(res => res.json())
        .then(response => {
          if (response.success) {
            setHealthData(response.data);
          }
        })
        .catch(error => console.error('Error loading health data:', error))
        .finally(() => setLoadingHealthData(false));
    }
  }, [activeTab, country, healthData]);

  // Fetch education data
  useEffect(() => {
    if (activeTab === 'education' && country && !educationData) {
      setLoadingEducationData(true);
      fetch(`/api/countries/${country.iso3}/education`)
        .then(res => res.json())
        .then(response => {
          if (response.success) {
            setEducationData(response.data);
          }
        })
        .catch(error => console.error('Error loading education data:', error))
        .finally(() => setLoadingEducationData(false));
    }
  }, [activeTab, country, educationData]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'economy', label: 'Economy', icon: DollarSign },
    { id: 'health', label: 'Health', icon: Activity },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'food', label: 'Food', icon: Wheat },
    { id: 'conflict', label: 'Conflict', icon: Shield },
    { id: 'refugee', label: 'Refugee', icon: Home },
    { id: 'scores', label: 'Scores', icon: TrendingUp },
  ] as const;

  // Determine color based on overall score
  const getScoreColor = (score: number) => {
    if (score >= 70) return { bg: 'bg-destructive', text: 'text-white', label: 'Critical' };
    if (score >= 50) return { bg: 'bg-orange-500', text: 'text-white', label: 'Warning' };
    if (score >= 30) return { bg: 'bg-yellow-500', text: 'text-white', label: 'Caution' };
    return { bg: 'bg-primary', text: 'text-primary-foreground', label: 'Stable' };
  };

  function renderTabContent() {
    const validCountry = country as CountryData;
    
    switch (activeTab) {
      case 'overview':
        return <OverviewTab country={validCountry} />;
      case 'economy':
        return <EconomyTab country={validCountry} economyData={economyData} loading={loadingEconomyData} />;
      case 'health':
        return <HealthTab country={validCountry} healthData={healthData} loading={loadingHealthData} />;
      case 'education':
        return <EducationTab country={validCountry} educationData={educationData} loading={loadingEducationData} />;
      case 'food':
        return <FoodTab country={validCountry} foodSecurityData={foodSecurityData} loading={loadingFoodData} />;
      case 'scores':
        return <ScoresTab country={validCountry} />;
      case 'conflict':
        return <ConflictTab country={validCountry} conflictData={conflictData} loading={loadingConflictData} />;
      case 'refugee':
        return <RefugeeTab country={validCountry} refugeeData={refugeeData} loading={loadingRefugeeData} />;
      default:
        return <OverviewTab country={validCountry} />;
    }
  }

  return (
    <div className="w-[480px] flex-shrink-0 border-l bg-card flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-card to-accent/20"></div>
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url(${getCountryFlagUrl(country.iso3, 'w160')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
          }}
        ></div>
        
        <div className="relative p-5">
          {/* Top bar - Close button */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                {country.iso3}
              </span>
              <span className="text-xs text-muted-foreground">Country Details</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <X size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          </div>

          {/* Main country info */}
          <div className="flex items-start gap-4">
            {/* Flag */}
            <div className="flex-shrink-0 relative">
              <img 
                src={getCountryFlagUrl(country.iso3, 'w160')}
                alt={`${country.name} flag`}
                className="w-20 h-14 object-cover rounded-lg shadow-md border-2 border-card"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Urgency badge */}
              <div 
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card shadow"
                style={{ backgroundColor: getUrgencyColor(country.urgencyLevel) }}
              ></div>
            </div>
            
            {/* Country name and basic info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-foreground mb-2 truncate">
                {country.name}
              </h2>
              
              {/* Urgency tag */}
              <div className="flex items-center gap-2 flex-wrap">
                <span 
                  className="px-2.5 py-1 text-xs font-bold rounded-full text-white"
                  style={{ 
                    backgroundColor: getUrgencyColor(country.urgencyLevel),
                  }}
                >
                  {urgencyLabels[country.urgencyLevel]}
                </span>
                {country.scores?.overall !== undefined && (
                  <span className={cn(
                    "px-2.5 py-1 text-xs font-bold rounded-full",
                    getScoreColor(country.scores.overall).bg,
                    getScoreColor(country.scores.overall).text
                  )}>
                    {country.scores.overall.toFixed(0)} pts
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Key indicator cards - 3 column grid */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {/* Population */}
            <div className="bg-card/80 rounded-lg border p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Users size={12} className="text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground uppercase font-medium">Population</span>
              </div>
              <p className="text-sm font-bold text-foreground">
                {formatNumber(country.population || 0)}
              </p>
            </div>
            
            {/* GDP */}
            <div className="bg-card/80 rounded-lg border p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <DollarSign size={12} className="text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground uppercase font-medium">GDP/Capita</span>
              </div>
              <p className="text-sm font-bold text-primary">
                {country.gdpPerCapita ? formatCurrency(country.gdpPerCapita) : 'N/A'}
              </p>
            </div>
            
            {/* Poverty Rate */}
            <div className="bg-card/80 rounded-lg border p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingDown size={12} className="text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground uppercase font-medium">Poverty</span>
              </div>
              <p className="text-sm font-bold text-orange-600">
                {country.indicators?.poverty ? `${country.indicators.poverty.toFixed(1)}%` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Scrollable horizontal with drag support */}
      <div className="flex-shrink-0 border-y bg-muted/50">
        <div 
          ref={tabNavRef}
          className={cn(
            "flex overflow-x-auto px-3 py-2 gap-1.5 scrollbar-hide",
            isDragging ? "cursor-grabbing select-none" : "cursor-grab"
          )}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => !isDragging && setActiveTab(tab.id as TabType)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors",
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto bg-muted/30">{renderTabContent()}</div>
    </div>
  );
}
