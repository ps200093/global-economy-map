'use client';

import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Tooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RegionData, CountryData } from '@/types';
import { getUrgencyColor, formatNumber, formatCurrency } from '@/utils/helpers';

interface WorldMapProps {
  regions?: RegionData[];
  countries?: CountryData[];
  onRegionClick?: (region: RegionData) => void;
  onCountryClick?: (country: CountryData) => void;
  onMapClick?: () => void;
  selectedRegion?: RegionData | null;
  selectedCountry?: CountryData | null;
}

// Map center adjustment component
function MapController({ selectedRegion, selectedCountry }: { 
  selectedRegion?: RegionData | null;
  selectedCountry?: CountryData | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedCountry) {
      map.flyTo(selectedCountry.coordinates, 6, {
        duration: 1.5,
      });
    } else if (selectedRegion) {
      map.flyTo(selectedRegion.coordinates, 5, {
        duration: 1.5,
      });
    }
  }, [selectedRegion, selectedCountry, map]);

  return null;
}

// Map click handler component
function MapClickHandler({ onMapClick }: { onMapClick?: () => void }) {
  useMapEvents({
    click: (e) => {
      // Check if click is on a marker or cluster
      const target = e.originalEvent?.target as HTMLElement;
      if (target?.closest('.custom-marker') || target?.closest('.custom-cluster-icon')) {
        return; // Don't trigger map click for marker/cluster clicks
      }
      onMapClick?.();
    },
  });
  return null;
}

// Create icon by urgency level
function createCustomIcon(urgencyLevel: 'critical' | 'high' | 'medium' | 'low' | 'stable') {
  const color = getUrgencyColor(urgencyLevel);
  const size = urgencyLevel === 'critical' ? 44 : 
               urgencyLevel === 'high' ? 40 : 
               urgencyLevel === 'medium' ? 36 : 
               urgencyLevel === 'low' ? 32 : 28;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 3px 6px rgba(15, 23, 42, 0.4);
        position: relative;
        cursor: pointer;
        transition: transform 0.2s;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${size - 8}px;
          height: ${size - 8}px;
          background-color: rgba(255,255,255,0.3);
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// Custom cluster icon creation function
const createClusterCustomIcon = (cluster: any) => {
  const childMarkers = cluster.getAllChildMarkers();
  
  // Count by urgency level
  const urgencyCounts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    stable: 0,
  };

  childMarkers.forEach((marker: any) => {
    const urgencyLevel = marker.options.urgencyLevel as 'critical' | 'high' | 'medium' | 'low' | 'stable';
    if (urgencyLevel && urgencyCounts.hasOwnProperty(urgencyLevel)) {
      urgencyCounts[urgencyLevel]++;
    }
  });

  const totalCount = childMarkers.length;
  
  // Determine highest urgency level
  let dominantUrgency: 'critical' | 'high' | 'medium' | 'low' | 'stable' = 'stable';
  if (urgencyCounts.critical > 0) dominantUrgency = 'critical';
  else if (urgencyCounts.high > 0) dominantUrgency = 'high';
  else if (urgencyCounts.medium > 0) dominantUrgency = 'medium';
  else if (urgencyCounts.low > 0) dominantUrgency = 'low';

  const dominantColor = getUrgencyColor(dominantUrgency);

  return L.divIcon({
    html: `
      <div style="
        background: ${dominantColor};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 8px rgba(15, 23, 42, 0.3);
        font-weight: bold;
        color: white;
        font-size: 14px;
      ">
        +${totalCount}
      </div>
      <div class="cluster-tooltip" style="
        position: absolute;
        top: -80px;
        left: 50%;
        transform: translateX(-50%);
        background: #FFFFFF;
        padding: 8px 12px;
        border-radius: 8px;
        border: 1px solid #E2E8F0;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
        white-space: nowrap;
        font-size: 12px;
        z-index: 1000;
      ">
        ${urgencyCounts.critical > 0 ? `<div style="color: #B91C1C;">🔴 Critical: ${urgencyCounts.critical}</div>` : ''}
        ${urgencyCounts.high > 0 ? `<div style="color: #EA580C;">🟠 High: ${urgencyCounts.high}</div>` : ''}
        ${urgencyCounts.medium > 0 ? `<div style="color: #CA8A04;">🟡 Medium: ${urgencyCounts.medium}</div>` : ''}
        ${urgencyCounts.low > 0 ? `<div style="color: #22C55E;">🟢 Low: ${urgencyCounts.low}</div>` : ''}
        ${urgencyCounts.stable > 0 ? `<div style="color: #9CA3AF;">⚪ Stable: ${urgencyCounts.stable}</div>` : ''}
      </div>
    `,
    className: 'custom-cluster-icon',
    iconSize: L.point(40, 40, true),
  });
};

export default function WorldMap({ 
  regions = [], 
  countries = [],
  onRegionClick, 
  onCountryClick,
  onMapClick,
  selectedRegion,
  selectedCountry 
}: WorldMapProps) {
  // Pacific island countries coordinate adjustment
  const pacificIslands = ['KIR', 'TON', 'WSM']; // Kiribati, Tonga, Samoa
  
  const adjustedCountries = countries.map(country => {
    const [lat, lng] = country.coordinates;
    
    // Move Pacific island countries with negative longitude to the right (add 360 degrees)
    if (pacificIslands.includes(country.iso3) && lng < 0) {
      console.log(`Wrapping ${country.name} (${country.iso3}): ${lng} → ${lng + 360}`);
      return {
        ...country,
        coordinates: [lat, lng + 360] as [number, number]
      };
    }
    
    return country;
  });

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      className="rounded-lg"
      minZoom={2}
      maxZoom={10}
      worldCopyJump={false}
      maxBounds={[[-90, -180], [90, 540]]}
    >
      {/* CartoDB Positron - English labels, clean style */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
        noWrap={false}
        bounds={[[-90, -180], [90, 540]]}
      />
      <MapController selectedRegion={selectedRegion} selectedCountry={selectedCountry} />
      <MapClickHandler onMapClick={onMapClick} />
      
        {/* Marker cluster group */}
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
        maxClusterRadius={80}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
        zoomToBoundsOnClick={true}
      >
        {/* Country markers */}
        {adjustedCountries.map((country) => (
          <Marker
            key={country.id}
            position={country.coordinates}
            icon={createCustomIcon(country.urgencyLevel)}
            // @ts-ignore - Custom property for clustering
            urgencyLevel={country.urgencyLevel}
            eventHandlers={{
              click: (e) => {
                e.target.closeTooltip();
                onCountryClick?.(country);
              },
            }}
          >
            {/* Hover tooltip */}
            <Tooltip direction="top" offset={[0, -10]} opacity={0.95} permanent={false}>
              <div className="text-sm">
                <div className="font-bold text-base mb-2 text-[#0F172A]">{country.name}</div>
                <div className="text-[#475569] space-y-1">
                  <div className="flex justify-between gap-4">
                    <span>Poverty Rate:</span>
                    <span className="font-semibold text-[#B91C1C]">{(country.indicators?.poverty || 0).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>GDP:</span>
                    <span className="font-semibold text-[#2563EB]">{formatCurrency(country.gdpPerCapita || 0)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Population:</span>
                    <span className="font-semibold text-[#0F172A]">{formatNumber(country.population || 0)}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#E2E8F0]">
                    <span 
                      className="px-2 py-1 rounded text-white text-xs font-semibold"
                      style={{ backgroundColor: getUrgencyColor(country.urgencyLevel) }}
                    >
                      {country.urgencyLevel === 'critical' ? '🔴 Critical' : 
                       country.urgencyLevel === 'high' ? '🟠 High' : 
                       country.urgencyLevel === 'medium' ? '🟡 Caution' : 
                       country.urgencyLevel === 'low' ? '🟢 Low' : '⚪ Stable'}
                    </span>
                  </div>
                </div>
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
