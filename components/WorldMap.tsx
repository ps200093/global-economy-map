'use client';

import { MapContainer, TileLayer, Popup, useMap, Marker, Tooltip } from 'react-leaflet';
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
  selectedRegion?: RegionData | null;
  selectedCountry?: CountryData | null;
}

// 지도 중심 조정 컴포넌트
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

// 긴급도별 아이콘 생성
function createCustomIcon(urgencyLevel: 'critical' | 'high' | 'medium' | 'low' | 'stable') {
  const color = getUrgencyColor(urgencyLevel);
  const size = urgencyLevel === 'critical' ? 26 : 
               urgencyLevel === 'high' ? 24 : 
               urgencyLevel === 'medium' ? 22 : 
               urgencyLevel === 'low' ? 20 : 18;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 3px 6px rgba(0,0,0,0.4);
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

// 커스텀 클러스터 아이콘 생성 함수
const createClusterCustomIcon = (cluster: any) => {
  const childMarkers = cluster.getAllChildMarkers();
  
  // 긴급도별 카운트
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
  
  // 가장 높은 긴급도 결정
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
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
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
        background: white;
        padding: 8px 12px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
        white-space: nowrap;
        font-size: 12px;
        z-index: 1000;
      ">
        ${urgencyCounts.critical > 0 ? `<div style="color: #dc2626;">🔴 Critical: ${urgencyCounts.critical}</div>` : ''}
        ${urgencyCounts.high > 0 ? `<div style="color: #ea580c;">🟠 High: ${urgencyCounts.high}</div>` : ''}
        ${urgencyCounts.medium > 0 ? `<div style="color: #eab308;">🟡 Medium: ${urgencyCounts.medium}</div>` : ''}
        ${urgencyCounts.low > 0 ? `<div style="color: #22c55e;">🟢 Low: ${urgencyCounts.low}</div>` : ''}
        ${urgencyCounts.stable > 0 ? `<div style="color: #9ca3af;">⚪ Stable: ${urgencyCounts.stable}</div>` : ''}
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
  selectedRegion,
  selectedCountry 
}: WorldMapProps) {
  // 태평양 섬나라들의 좌표 조정
  const pacificIslands = ['KIR', 'TON', 'WSM']; // 키리바시, 통가, 사모아
  
  const adjustedCountries = countries.map(country => {
    const [lat, lng] = country.coordinates;
    
    // 음수 경도인 태평양 섬나라들을 오른쪽으로 이동 (360도 더하기)
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
      {/* CartoDB Positron - 영어 레이블, 깔끔한 스타일 */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
        noWrap={false}
        bounds={[[-90, -180], [90, 540]]}
      />
      <MapController selectedRegion={selectedRegion} selectedCountry={selectedCountry} />
      
      {/* 마커 클러스터 그룹 */}
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
        maxClusterRadius={80}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
        zoomToBoundsOnClick={true}
      >
        {/* 국가 마커 */}
        {adjustedCountries.map((country) => (
          <Marker
            key={country.id}
            position={country.coordinates}
            icon={createCustomIcon(country.urgencyLevel)}
            // @ts-ignore - 클러스터링을 위한 커스텀 속성
            urgencyLevel={country.urgencyLevel}
            eventHandlers={{
              click: () => onCountryClick?.(country),
            }}
          >
            {/* 호버 툴팁 */}
            <Tooltip direction="top" offset={[0, -10]} opacity={0.95} permanent={false}>
              <div className="text-sm">
                <div className="font-bold text-base mb-2">{country.nameKo || country.name}</div>
                <div className="text-gray-700 space-y-1">
                  <div className="flex justify-between gap-4">
                    <span>빈곤율:</span>
                    <span className="font-semibold">{(country.indicators?.poverty || 0).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>GDP:</span>
                    <span className="font-semibold">{formatCurrency(country.gdpPerCapita || 0)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>인구:</span>
                    <span className="font-semibold">{formatNumber(country.population || 0)}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-300">
                    <span 
                      className="px-2 py-1 rounded text-white text-xs font-semibold"
                      style={{ backgroundColor: getUrgencyColor(country.urgencyLevel) }}
                    >
                      {country.urgencyLevel === 'critical' ? '🔴 매우 긴급' : 
                       country.urgencyLevel === 'high' ? '🟠 긴급' : 
                       country.urgencyLevel === 'medium' ? '🟡 주의' : 
                       country.urgencyLevel === 'low' ? '🟢 낮음' : '⚪ 안정'}
                    </span>
                  </div>
                </div>
              </div>
            </Tooltip>

            {/* 클릭 시 팝업 */}
            <Popup>
              <div className="p-3 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2">{country.nameKo || country.name}</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>인구:</strong> {formatNumber(country.population || 0)}</p>
                  <p><strong>빈곤율:</strong> {(country.indicators?.poverty || 0).toFixed(1)}%</p>
                  <p><strong>1인당 GDP:</strong> {formatCurrency(country.gdpPerCapita || 0)}</p>
                  <p className="mt-2">
                    <span 
                      className="px-2 py-1 rounded text-white text-xs font-semibold"
                      style={{ backgroundColor: getUrgencyColor(country.urgencyLevel) }}
                    >
                      {country.urgencyLevel === 'critical' ? '매우 긴급' : 
                       country.urgencyLevel === 'high' ? '긴급' : 
                       country.urgencyLevel === 'medium' ? '주의' : 
                       country.urgencyLevel === 'low' ? '낮음' : '안정'}
                    </span>
                  </p>
                  <button 
                    className="mt-3 w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm font-semibold"
                    onClick={() => onCountryClick?.(country)}
                  >
                    상세 정보 보기
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
