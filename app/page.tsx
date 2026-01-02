'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { RegionData, CharityOrganization, CountryData } from '@/types';
import { CountryScore } from '@/types/country';
import GlobalStatsDashboard from '@/components/GlobalStatsDashboard';
import RegionCharts from '@/components/RegionCharts';
import RegionDetailPanel from '@/components/RegionDetailPanel';
import CountryDetailPanel from '@/components/CountryDetailPanel';
import CharityList from '@/components/CharityList';
import { Globe, Heart, TrendingUp, Info, Loader2 } from 'lucide-react';

// 클라이언트 사이드에서만 지도 렌더링 (Leaflet은 SSR 지원 안함)
const WorldMap = dynamic(() => import('@/components/WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-600">지도를 불러오는 중...</p>
    </div>
  ),
});

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'charities' | 'about'>('map');
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [charitiesData, setCharitiesData] = useState<CharityOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // MongoDB에서 국가 데이터 로드
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // MongoDB에서 전체 국가 데이터 가져오기
        const [countriesResponse, charitiesResponse] = await Promise.all([
          fetch('/api/countries').then(r => r.json()),
          fetch('/api/charities').then(r => r.json()),
        ]);

        if (countriesResponse.success) {
          // CountryScore를 CountryData로 변환
          const countryData: CountryData[] = countriesResponse.data.map((c: CountryScore) => ({
            id: c.iso3.toLowerCase(),
            name: c.name,
            nameKo: c.nameKo,
            iso3: c.iso3,
            coordinates: c.coordinates,
            indicators: {
              ...c.indicators,
              poverty: c.indicators.povertyRate || 0, // povertyRate를 poverty로 매핑
            },
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
          setError('국가 데이터를 불러오지 못했습니다.');
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
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 글로벌 통계 계산 (국가 데이터 기반)
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

  // 패널이 열릴 때 스크롤 방지
  useEffect(() => {
    if (selectedCountry) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedCountry]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 헤더 */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="text-blue-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Global Economy Monitor</h1>
                <p className="text-sm text-gray-600">세계 경제 이슈와 기부 가이드</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-600">빈곤층 인구</p>
                <p className="text-lg font-bold text-red-600">
                  {(globalStats.totalPopulationInPoverty / 1000000000).toFixed(2)}B
                </p>
              </div>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <nav className="flex gap-4 mt-4 border-t pt-4">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'map'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp size={20} />
              경제 이슈 지도
            </button>
            <button
              onClick={() => setActiveTab('charities')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'charities'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart size={20} />
              기부 단체
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'about'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Info size={20} />
              소개
            </button>
          </nav>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'map' && (
          <>
            {/* 글로벌 통계 대시보드 */}
            <GlobalStatsDashboard stats={globalStats} />

            {/* 차트는 국가 데이터로 표시하므로 주석 처리 */}
            {/* <RegionCharts regions={regionsData} /> */}

            {/* 지도 섹션 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">세계 경제 위기 지도</h2>
                <p className="text-gray-600">
                  각 원을 클릭하여 해당 국가의 상세 정보와 추천 기부 단체를 확인하세요
                </p>
                <div className="flex gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-600" />
                    <span>매우 높음 (Critical)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-orange-500" />
                    <span>높음 (High)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500" />
                    <span>보통 (Medium)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                    <span>낮음 (Low)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-400" />
                    <span>안정 (Stable)</span>
                  </div>
                </div>
              </div>
              <div className="h-[600px] rounded-lg overflow-hidden">
                <WorldMap
                  countries={countries}
                  onCountryClick={setSelectedCountry}
                  selectedCountry={selectedCountry}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'charities' && (
          <CharityList charities={charitiesData} />
        )}

        {activeTab === 'about' && (
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">프로젝트 소개</h2>
            
            <section className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-blue-600">목적</h3>
              <p className="text-gray-700 leading-relaxed">
                Global Economy Monitor는 전 세계의 경제적 이슈와 빈곤 문제에 대한 인식을 높이고, 
                학생들이 경제에 관심을 가질 수 있도록 돕기 위해 만들어졌습니다. 
                인터랙티브한 지도와 데이터 시각화를 통해 복잡한 경제 문제를 이해하기 쉽게 전달하고, 
                실질적인 도움을 줄 수 있는 신뢰할 수 있는 기부 단체를 소개합니다.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-blue-600">주요 기능</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>인터랙티브 세계 지도:</strong> 각 지역의 경제 상황을 시각적으로 확인하고 상세 정보를 탐색할 수 있습니다</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>실시간 데이터 시각화:</strong> 차트와 그래프로 복잡한 경제 데이터를 쉽게 이해할 수 있습니다</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>신뢰할 수 있는 기부 단체 정보:</strong> 투명성 점수와 평가를 통해 검증된 단체를 추천합니다</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>지역별 맞춤 정보:</strong> 각 지역에 필요한 구체적인 지원 분야를 확인할 수 있습니다</span>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-blue-600">데이터 출처</h3>
              <p className="text-gray-700 mb-3">
                이 프로젝트의 데이터는 다음 신뢰할 수 있는 국제 기관들의 정보를 기반으로 합니다:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• 세계은행(World Bank) - 경제 지표 및 빈곤 통계</li>
                <li>• 국제연합(UN) - 지속가능발전목표(SDGs) 데이터</li>
                <li>• Charity Navigator - 기부 단체 평가 및 투명성 점수</li>
                <li>• GuideStar - 비영리 단체 정보</li>
              </ul>
            </section>

            <section className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-blue-600">함께 만드는 더 나은 세상</h3>
              <p className="text-gray-700 leading-relaxed">
                작은 기부도 큰 변화를 만들 수 있습니다. 
                이 플랫폼을 통해 전 세계의 경제적 어려움을 이해하고, 
                여러분의 도움이 필요한 곳에 효과적으로 지원할 수 있기를 바랍니다.
              </p>
            </section>
        </div>
        )}
      </main>

      {/* 국가 상세 패널 */}
      {selectedCountry && (
        <CountryDetailPanel
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}

      {/* 푸터 */}
      <footer className="bg-gray-800 text-white mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2026 Global Economy Monitor</p>
          <p className="text-gray-400 text-sm">
            모든 데이터는 교육 목적으로 제공되며, 실제 수치는 변동될 수 있습니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
