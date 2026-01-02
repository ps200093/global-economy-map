'use client';

import { FEWSMarketPrice, FEWSCropCondition, FEWSTradeFlow } from '@/types/api';
import { TrendingUp, TrendingDown, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface FEWSDataVisualizationProps {
  marketPrices: FEWSMarketPrice[];
  cropConditions: FEWSCropCondition[];
  tradeFlows: FEWSTradeFlow[];
  country: string;
}

export default function FEWSDataVisualization({
  marketPrices,
  cropConditions,
  tradeFlows,
  country,
}: FEWSDataVisualizationProps) {
  // 가격 변화율 데이터 준비
  const priceChangeData = marketPrices.map(p => ({
    commodity: p.commodity,
    change: p.price_change_percentage,
    price: p.price,
  }));

  return (
    <div className="space-y-6">
      {/* 시장 가격 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <TrendingUp className="text-blue-600" size={24} />
          시장 가격 동향
        </h3>

        {marketPrices.length === 0 ? (
          <p className="text-gray-500 text-center py-4">시장 가격 데이터가 없습니다</p>
        ) : (
          <>
            {/* 가격 변화율 차트 */}
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={priceChangeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="commodity" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    fontSize={12}
                  />
                  <YAxis label={{ value: '변화율 (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)}%`, '가격 변화']}
                  />
                  <Bar 
                    dataKey="change" 
                    fill="#3b82f6"
                    label={{ position: 'top', fontSize: 11 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 가격 상세 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketPrices.map((price, idx) => (
                <MarketPriceCard key={idx} price={price} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 작황 상태 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <CheckCircle className="text-green-600" size={24} />
          작황 및 농업 지표
        </h3>

        {cropConditions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">작황 데이터가 없습니다</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cropConditions.map((crop, idx) => (
              <CropConditionCard key={idx} crop={crop} />
            ))}
          </div>
        )}
      </div>

      {/* 교역 흐름 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <MapPin className="text-purple-600" size={24} />
          교역 및 공급 흐름
        </h3>

        {tradeFlows.length === 0 ? (
          <p className="text-gray-500 text-center py-4">교역 데이터가 없습니다</p>
        ) : (
          <div className="space-y-4">
            {tradeFlows.map((flow, idx) => (
              <TradeFlowCard key={idx} flow={flow} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 시장 가격 카드
function MarketPriceCard({ price }: { price: FEWSMarketPrice }) {
  const isIncreasing = price.price_change_percentage > 0;
  const isSignificant = Math.abs(price.price_change_percentage) > 10;

  return (
    <div className={`p-4 rounded-lg border-2 ${
      isSignificant && isIncreasing ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-gray-800">{price.commodity}</h4>
          <p className="text-sm text-gray-600">{price.market}</p>
        </div>
        <div className={`flex items-center gap-1 ${
          isIncreasing ? 'text-red-600' : 'text-green-600'
        }`}>
          {isIncreasing ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="font-bold text-sm">
            {isIncreasing ? '+' : ''}{price.price_change_percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-2xl font-bold text-gray-800">
            {price.price.toFixed(2)} <span className="text-sm text-gray-600">{price.currency}</span>
          </p>
          <p className="text-xs text-gray-500">per {price.unit}</p>
        </div>
        <p className="text-xs text-gray-500">{price.date}</p>
      </div>

      {isSignificant && isIncreasing && (
        <div className="mt-2 flex items-center gap-1 text-xs text-red-700">
          <AlertTriangle size={12} />
          <span>가격 급등 경고</span>
        </div>
      )}
    </div>
  );
}

// 작황 상태 카드
function CropConditionCard({ crop }: { crop: FEWSCropCondition }) {
  const conditionColors = {
    excellent: 'bg-green-100 text-green-800 border-green-300',
    good: 'bg-blue-100 text-blue-800 border-blue-300',
    fair: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    poor: 'bg-orange-100 text-orange-800 border-orange-300',
    failed: 'bg-red-100 text-red-800 border-red-300',
  };

  const rainfallIcons = {
    above_normal: '🌧️',
    normal: '☁️',
    below_normal: '☀️',
  };

  const soilIcons = {
    adequate: '💧',
    moderate: '💦',
    deficit: '🏜️',
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${conditionColors[crop.condition]}`}>
      <div className="mb-3">
        <h4 className="font-bold text-gray-800">{crop.crop_type}</h4>
        <p className="text-xs text-gray-600">{crop.region}</p>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">상태:</span>
          <span className="font-semibold capitalize">{crop.condition}</span>
        </div>

        {crop.yield_estimate && (
          <div className="flex justify-between">
            <span className="text-gray-600">예상 수확량:</span>
            <span className="font-semibold">{crop.yield_estimate} t/ha</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-gray-600">강수량:</span>
          <span className="flex items-center gap-1">
            {rainfallIcons[crop.rainfall_status]}
            <span className="text-xs capitalize">{crop.rainfall_status.replace('_', ' ')}</span>
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">토양 수분:</span>
          <span className="flex items-center gap-1">
            {soilIcons[crop.soil_moisture]}
            <span className="text-xs capitalize">{crop.soil_moisture}</span>
          </span>
        </div>

        <div className="pt-2 border-t border-gray-300">
          <p className="text-xs text-gray-600">{crop.season}</p>
        </div>
      </div>
    </div>
  );
}

// 교역 흐름 카드
function TradeFlowCard({ flow }: { flow: FEWSTradeFlow }) {
  const statusColors = {
    normal: 'bg-green-100 text-green-800',
    restricted: 'bg-yellow-100 text-yellow-800',
    blocked: 'bg-red-100 text-red-800',
  };

  const statusIcons = {
    normal: '✓',
    restricted: '⚠',
    blocked: '✕',
  };

  return (
    <div className="p-4 rounded-lg border border-gray-300 bg-gray-50 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-gray-800">{flow.origin_country}</span>
            <span className="text-gray-400">→</span>
            <span className="font-bold text-gray-800">{flow.destination_country}</span>
          </div>
          <p className="text-sm text-gray-600">{flow.commodity}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[flow.flow_status]}`}>
          {statusIcons[flow.flow_status]} {flow.flow_status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">물량:</p>
          <p className="font-semibold">{flow.quantity.toLocaleString()} MT</p>
        </div>
        <div>
          <p className="text-gray-600">가격 차이:</p>
          <p className="font-semibold text-blue-700">{flow.price_differential.toFixed(1)}%</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-300">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <MapPin size={12} />
          <span>{flow.trade_route}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">국경: {flow.border_point}</p>
      </div>
    </div>
  );
}

