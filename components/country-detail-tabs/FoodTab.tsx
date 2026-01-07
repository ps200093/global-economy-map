'use client';

import { Wheat, TrendingUp, AlertTriangle, Package, Tractor, Import, Droplet, Sprout } from 'lucide-react';
import { formatNumber } from '@/utils/helpers';
import { FoodTabProps } from './types';

export default function FoodTab({ country, foodSecurityData, loading }: FoodTabProps) {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Wheat size={18} className="text-green-500" />
        <h3 className="text-base font-bold text-slate-800">Food Security</h3>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-green-500"></div>
          <span className="ml-3 text-slate-500">Loading data...</span>
        </div>
      ) : (
        <>
          {/* Key Indicator Cards */}
          <div className="grid grid-cols-2 gap-3">
            {country.indicators?.foodProductionIndex && (
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="text-green-600" size={16} />
                  <p className="text-xs text-green-700 font-medium">Food Production Index</p>
                </div>
                <p className="text-2xl font-bold text-green-800">
                  {country.indicators.foodProductionIndex.toFixed(1)}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Production relative to base year</p>
              </div>
            )}
            
            {country.scores?.foodSecurity !== undefined && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-orange-600" size={16} />
                  <p className="text-xs text-orange-700 font-medium">Food Security Score</p>
                </div>
                <p className="text-2xl font-bold text-orange-800">
                  {country.scores.foodSecurity.toFixed(1)}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Out of 100 (higher = more risk)</p>
              </div>
            )}
          </div>

          {/* Agricultural Production */}
          {foodSecurityData && (foodSecurityData.production.cerealProduction.value || foodSecurityData.production.cerealYield.value) && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Tractor className="text-green-600" size={16} />
                <h4 className="text-sm font-bold text-slate-800">Agricultural Production</h4>
              </div>
              <div className="space-y-0">
                {foodSecurityData.production.cerealProduction.value && (
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Cereal Production</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-800">
                        {formatNumber(foodSecurityData.production.cerealProduction.value)} MT
                      </span>
                      {foodSecurityData.production.cerealProduction.year && (
                        <p className="text-[10px] text-slate-400">({foodSecurityData.production.cerealProduction.year})</p>
                      )}
                    </div>
                  </div>
                )}
                {foodSecurityData.production.cerealYield.value && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-slate-600">Cereal Yield</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-800">
                        {formatNumber(foodSecurityData.production.cerealYield.value)} kg/ha
                      </span>
                      {foodSecurityData.production.cerealYield.year && (
                        <p className="text-[10px] text-slate-400">({foodSecurityData.production.cerealYield.year})</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Land Use */}
          {foodSecurityData && (foodSecurityData.land.agriculturalLand.value || foodSecurityData.land.arableLand.value || foodSecurityData.land.irrigatedLand.value) && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sprout className="text-amber-600" size={16} />
                <h4 className="text-sm font-bold text-slate-800">Land Use</h4>
              </div>
              <div className="space-y-0">
                {foodSecurityData.land.agriculturalLand.value && (
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Agricultural Land</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-800">
                        {foodSecurityData.land.agriculturalLand.value.toFixed(1)}%
                      </span>
                      {foodSecurityData.land.agriculturalLand.year && (
                        <p className="text-[10px] text-slate-400">({foodSecurityData.land.agriculturalLand.year})</p>
                      )}
                    </div>
                  </div>
                )}
                {foodSecurityData.land.arableLand.value && (
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Arable Land</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-800">
                        {foodSecurityData.land.arableLand.value.toFixed(1)}%
                      </span>
                      {foodSecurityData.land.arableLand.year && (
                        <p className="text-[10px] text-slate-400">({foodSecurityData.land.arableLand.year})</p>
                      )}
                    </div>
                  </div>
                )}
                {foodSecurityData.land.irrigatedLand.value && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-slate-600">Irrigated Land</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-800">
                        {foodSecurityData.land.irrigatedLand.value.toFixed(1)}%
                      </span>
                      {foodSecurityData.land.irrigatedLand.year && (
                        <p className="text-[10px] text-slate-400">({foodSecurityData.land.irrigatedLand.year})</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Food Trade */}
          {foodSecurityData && (foodSecurityData.trade.foodImports.value || foodSecurityData.trade.foodExports.value) && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Import className="text-blue-600" size={16} />
                <h4 className="text-sm font-bold text-slate-800">Food Trade</h4>
              </div>
              <div className="space-y-0">
                {foodSecurityData.trade.foodImports.value && (
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Food Import Share</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-blue-600">
                        {foodSecurityData.trade.foodImports.value.toFixed(1)}%
                      </span>
                      {foodSecurityData.trade.foodImports.year && (
                        <p className="text-[10px] text-slate-400">({foodSecurityData.trade.foodImports.year})</p>
                      )}
                    </div>
                  </div>
                )}
                {foodSecurityData.trade.foodExports.value && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-slate-600">Food Export Share</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-green-600">
                        {foodSecurityData.trade.foodExports.value.toFixed(1)}%
                      </span>
                      {foodSecurityData.trade.foodExports.year && (
                        <p className="text-[10px] text-slate-400">({foodSecurityData.trade.foodExports.year})</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Infrastructure & Access */}
          {foodSecurityData && foodSecurityData.infrastructure.improvedWaterSource.value && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Droplet className="text-cyan-600" size={16} />
                <h4 className="text-sm font-bold text-slate-800">Infrastructure & Access</h4>
              </div>
              <div className="space-y-0">
                {foodSecurityData.infrastructure.improvedWaterSource.value && (
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Improved Water Access</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-cyan-600">
                        {foodSecurityData.infrastructure.improvedWaterSource.value.toFixed(1)}%
                      </span>
                      {foodSecurityData.infrastructure.improvedWaterSource.year && (
                        <p className="text-[10px] text-slate-400">({foodSecurityData.infrastructure.improvedWaterSource.year})</p>
                      )}
                    </div>
                  </div>
                )}
                {foodSecurityData.infrastructure.ruralPopulation.value && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-slate-600">Rural Population</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-800">
                        {foodSecurityData.infrastructure.ruralPopulation.value.toFixed(1)}%
                      </span>
                      {foodSecurityData.infrastructure.ruralPopulation.year && (
                        <p className="text-[10px] text-slate-400">({foodSecurityData.infrastructure.ruralPopulation.year})</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Nutrition Status */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-red-500" size={16} />
              <h4 className="text-sm font-bold text-slate-800">Nutrition Status</h4>
            </div>
            <div className="space-y-0">
              {(foodSecurityData?.nutrition.malnutrition.value || country.indicators?.malnutritionRate) && (
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Malnutrition Rate</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-red-600">
                      {(foodSecurityData?.nutrition.malnutrition.value || country.indicators?.malnutritionRate)?.toFixed(1)}%
                    </span>
                    {foodSecurityData?.nutrition.malnutrition.year && (
                      <p className="text-[10px] text-slate-400">({foodSecurityData.nutrition.malnutrition.year})</p>
                    )}
                  </div>
                </div>
              )}
              
              {(foodSecurityData?.nutrition.stunting.value || country.indicators?.stuntingRate) && (
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Child Stunting Rate</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-orange-600">
                      {(foodSecurityData?.nutrition.stunting.value || country.indicators?.stuntingRate)?.toFixed(1)}%
                    </span>
                    {foodSecurityData?.nutrition.stunting.year && (
                      <p className="text-[10px] text-slate-400">({foodSecurityData.nutrition.stunting.year})</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Overall Assessment */}
          {country.scores?.foodSecurity !== undefined && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <Wheat className="text-orange-600" size={18} />
                <h4 className="text-sm font-bold text-slate-800">Overall Food Security Assessment</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-orange-700">Risk Level</span>
                    <span className="text-lg font-bold text-orange-700">
                      {country.scores.foodSecurity.toFixed(1)}/100
                    </span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all" 
                      style={{ width: `${country.scores.foodSecurity}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {country.scores.foodSecurity >= 70 
                    ? '⚠️ Food security situation is very serious. Urgent support is needed.'
                    : country.scores.foodSecurity >= 50
                    ? '🔶 Food security requires attention.'
                    : country.scores.foodSecurity >= 30
                    ? '🟡 Food security situation is moderate.'
                    : '✅ Relatively stable food security situation.'}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
