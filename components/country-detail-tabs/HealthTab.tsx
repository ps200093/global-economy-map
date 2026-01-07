'use client';

import { 
  Heart, Activity, AlertTriangle, Hospital, 
  Baby, Users, Syringe, Droplets, TrendingUp, TrendingDown,
  Stethoscope, BedDouble, ShieldCheck, Bug, Apple
} from 'lucide-react';
import { HealthTabProps } from './types';

export default function HealthTab({ country, healthData, loading }: HealthTabProps) {
  // Simple sparkline chart rendering
  const renderSparkline = (data: Array<{ year: number; value: number }>, color: string) => {
    if (!data || data.length < 2) return null;
    
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    const width = 120;
    const height = 40;
    const padding = 4;
    
    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((d.value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width={width} height={height} className="flex-shrink-0">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
        />
        <circle
          cx={width - padding}
          cy={height - padding - ((values[values.length - 1] - min) / range) * (height - padding * 2)}
          r="3"
          fill={color}
        />
      </svg>
    );
  };

  // Mortality color determination
  const getMortalityColor = (value: number, type: 'infant' | 'maternal') => {
    if (type === 'infant') {
      if (value > 50) return 'text-red-600';
      if (value > 20) return 'text-orange-600';
      return 'text-green-600';
    } else {
      if (value > 300) return 'text-red-600';
      if (value > 100) return 'text-orange-600';
      return 'text-green-600';
    }
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Activity size={18} className="text-green-500" />
        <h3 className="text-base font-bold text-slate-800">Health Indicators</h3>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-green-500"></div>
          <span className="ml-3 text-slate-500">Loading data...</span>
        </div>
      ) : (
        <>
          {/* Life Expectancy & Mortality */}
          {(healthData?.lifeExpectancy?.current?.value || 
            healthData?.mortality?.infant?.value ||
            healthData?.mortality?.maternal?.value) && (
            <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Heart size={16} className="text-green-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Life Expectancy & Mortality</h4>
              </div>
              
              {/* Life Expectancy */}
              {healthData?.lifeExpectancy?.current?.value && (
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-600">Life Expectancy</span>
                    <span className="text-2xl font-bold text-green-700">
                      {healthData.lifeExpectancy.current.value.toFixed(1)} yrs
                    </span>
                  </div>
                  {healthData.lifeExpectancy.trend && healthData.lifeExpectancy.trend.length > 0 && (
                    <div className="flex items-center justify-between mt-2">
                      {renderSparkline(healthData.lifeExpectancy.trend, '#22c55e')}
                      <span className="text-[10px] text-slate-500">
                        {healthData.lifeExpectancy.trend[0]?.year} - {healthData.lifeExpectancy.trend[healthData.lifeExpectancy.trend.length - 1]?.year}
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Mortality Grid */}
              <div className="grid grid-cols-2 gap-3">
                {healthData?.mortality?.infant?.value && (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Baby size={12} className="text-slate-500" />
                      <p className="text-xs text-slate-600">Infant Mortality</p>
                    </div>
                    <p className={`text-lg font-bold ${getMortalityColor(healthData.mortality.infant.value, 'infant')}`}>
                      {healthData.mortality.infant.value.toFixed(1)}
                    </p>
                    <p className="text-[10px] text-slate-500">per 1,000 births</p>
                  </div>
                )}
                
                {healthData?.mortality?.under5?.value && (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Users size={12} className="text-slate-500" />
                      <p className="text-xs text-slate-600">Under-5 Mortality</p>
                    </div>
                    <p className={`text-lg font-bold ${getMortalityColor(healthData.mortality.under5.value, 'infant')}`}>
                      {healthData.mortality.under5.value.toFixed(1)}
                    </p>
                    <p className="text-[10px] text-slate-500">per 1,000 births</p>
                  </div>
                )}
                
                {healthData?.mortality?.neonatal?.value && (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Baby size={12} className="text-pink-500" />
                      <p className="text-xs text-slate-600">Neonatal Mortality</p>
                    </div>
                    <p className={`text-lg font-bold ${getMortalityColor(healthData.mortality.neonatal.value, 'infant')}`}>
                      {healthData.mortality.neonatal.value.toFixed(1)}
                    </p>
                    <p className="text-[10px] text-slate-500">per 1,000 births</p>
                  </div>
                )}
                
                {healthData?.mortality?.maternal?.value && (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Heart size={12} className="text-red-500" />
                      <p className="text-xs text-slate-600">Maternal Mortality</p>
                    </div>
                    <p className={`text-lg font-bold ${getMortalityColor(healthData.mortality.maternal.value, 'maternal')}`}>
                      {healthData.mortality.maternal.value.toFixed(0)}
                    </p>
                    <p className="text-[10px] text-slate-500">per 100,000 births</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Healthcare Infrastructure */}
          {(healthData?.infrastructure?.physicians?.value || 
            healthData?.infrastructure?.nursesMidwives?.value ||
            healthData?.infrastructure?.hospitalBeds?.value ||
            healthData?.infrastructure?.birthsAttended?.value) && (
            <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Hospital size={16} className="text-blue-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Healthcare Infrastructure</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {healthData?.infrastructure?.physicians?.value && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Stethoscope size={12} className="text-blue-500" />
                      <p className="text-xs text-blue-600">Physicians</p>
                    </div>
                    <p className="text-lg font-bold text-blue-700">
                      {healthData.infrastructure.physicians.value.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-slate-500">per 1,000 people</p>
                  </div>
                )}
                
                {healthData?.infrastructure?.nursesMidwives?.value && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Users size={12} className="text-blue-500" />
                      <p className="text-xs text-blue-600">Nurses/Midwives</p>
                    </div>
                    <p className="text-lg font-bold text-blue-700">
                      {healthData.infrastructure.nursesMidwives.value.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-slate-500">per 1,000 people</p>
                  </div>
                )}
                
                {healthData?.infrastructure?.hospitalBeds?.value && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <BedDouble size={12} className="text-blue-500" />
                      <p className="text-xs text-blue-600">Hospital Beds</p>
                    </div>
                    <p className="text-lg font-bold text-blue-700">
                      {healthData.infrastructure.hospitalBeds.value.toFixed(1)}
                    </p>
                    <p className="text-[10px] text-slate-500">per 1,000 people</p>
                  </div>
                )}
                
                {healthData?.infrastructure?.birthsAttended?.value && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Baby size={12} className="text-green-500" />
                      <p className="text-xs text-green-600">Skilled Birth Attendance</p>
                    </div>
                    <p className="text-lg font-bold text-green-700">
                      {healthData.infrastructure.birthsAttended.value.toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
              
              {/* Health Expenditure */}
              {healthData?.expenditure?.healthExpenditure?.value && (
                <div className="mt-3 flex items-center justify-between py-2 border-t border-slate-100">
                  <span className="text-sm text-slate-600">Health Expenditure (% GDP)</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {healthData.expenditure.healthExpenditure.value.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Immunization */}
          {(healthData?.immunization?.measles?.value || 
            healthData?.immunization?.dpt?.value) && (
            <div className="bg-white rounded-xl p-4 border border-purple-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Syringe size={16} className="text-purple-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Immunization Rates</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {healthData?.immunization?.measles?.value && (
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <ShieldCheck size={12} className="text-purple-500" />
                      <p className="text-xs text-purple-600">Measles</p>
                    </div>
                    <p className="text-lg font-bold text-purple-700">
                      {healthData.immunization.measles.value.toFixed(0)}%
                    </p>
                    <div className="w-full bg-purple-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-purple-500 h-full rounded-full"
                        style={{ width: `${Math.min(healthData.immunization.measles.value, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {healthData?.immunization?.dpt?.value && (
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <ShieldCheck size={12} className="text-purple-500" />
                      <p className="text-xs text-purple-600">DPT</p>
                    </div>
                    <p className="text-lg font-bold text-purple-700">
                      {healthData.immunization.dpt.value.toFixed(0)}%
                    </p>
                    <div className="w-full bg-purple-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-purple-500 h-full rounded-full"
                        style={{ width: `${Math.min(healthData.immunization.dpt.value, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Infectious Diseases */}
          {(healthData?.diseases?.hivPrevalence?.value || 
            healthData?.diseases?.tuberculosis?.value) && (
            <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <Bug size={16} className="text-red-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Infectious Diseases</h4>
              </div>
              
              <div className="space-y-3">
                {healthData?.diseases?.hivPrevalence?.value !== null && healthData?.diseases?.hivPrevalence?.value !== undefined && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <div>
                      <span className="text-sm text-slate-600">HIV Prevalence</span>
                      <p className="text-[10px] text-slate-400">Ages 15-49</p>
                    </div>
                    <span className={`text-lg font-bold ${healthData.diseases.hivPrevalence.value > 1 ? 'text-red-600' : 'text-green-600'}`}>
                      {healthData.diseases.hivPrevalence.value.toFixed(2)}%
                    </span>
                  </div>
                )}
                
                {healthData?.diseases?.tuberculosis?.value && (
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-sm text-slate-600">Tuberculosis Incidence</span>
                      <p className="text-[10px] text-slate-400">per 100,000 people</p>
                    </div>
                    <span className={`text-lg font-bold ${healthData.diseases.tuberculosis.value > 100 ? 'text-red-600' : 'text-orange-600'}`}>
                      {healthData.diseases.tuberculosis.value.toFixed(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Nutrition Status */}
          {(healthData?.nutrition?.malnutrition?.value || 
            healthData?.nutrition?.stunting?.value ||
            healthData?.nutrition?.wasting?.value ||
            healthData?.nutrition?.lowBirthweight?.value) && (
            <div className="bg-white rounded-xl p-4 border border-orange-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Apple size={16} className="text-orange-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Nutrition Status</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {healthData?.nutrition?.malnutrition?.value && (
                  <div className="bg-orange-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertTriangle size={12} className="text-orange-500" />
                      <p className="text-xs text-orange-600">Malnutrition</p>
                    </div>
                    <p className="text-lg font-bold text-orange-700">
                      {healthData.nutrition.malnutrition.value.toFixed(1)}%
                    </p>
                  </div>
                )}
                
                {healthData?.nutrition?.stunting?.value && (
                  <div className="bg-orange-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingDown size={12} className="text-orange-500" />
                      <p className="text-xs text-orange-600">Stunting</p>
                    </div>
                    <p className="text-lg font-bold text-orange-700">
                      {healthData.nutrition.stunting.value.toFixed(1)}%
                    </p>
                  </div>
                )}
                
                {healthData?.nutrition?.wasting?.value && (
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertTriangle size={12} className="text-red-500" />
                      <p className="text-xs text-red-600">Wasting</p>
                    </div>
                    <p className="text-lg font-bold text-red-700">
                      {healthData.nutrition.wasting.value.toFixed(1)}%
                    </p>
                  </div>
                )}
                
                {healthData?.nutrition?.lowBirthweight?.value && (
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Baby size={12} className="text-yellow-600" />
                      <p className="text-xs text-yellow-600">Low Birthweight</p>
                    </div>
                    <p className="text-lg font-bold text-yellow-700">
                      {healthData.nutrition.lowBirthweight.value.toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
              
              {healthData?.nutrition?.overweight?.value && (
                <div className="mt-3 flex items-center justify-between py-2 border-t border-slate-100">
                  <span className="text-sm text-slate-600">Adult Overweight Rate</span>
                  <span className="text-sm font-semibold text-slate-700">
                    {healthData.nutrition.overweight.value.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Water & Sanitation */}
          {(healthData?.sanitation?.basicSanitation?.value || 
            healthData?.sanitation?.improvedWater?.value) && (
            <div className="bg-white rounded-xl p-4 border border-cyan-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                  <Droplets size={16} className="text-cyan-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Water & Sanitation</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {healthData?.sanitation?.improvedWater?.value && (
                  <div className="bg-cyan-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Droplets size={12} className="text-cyan-500" />
                      <p className="text-xs text-cyan-600">Clean Water Access</p>
                    </div>
                    <p className="text-lg font-bold text-cyan-700">
                      {healthData.sanitation.improvedWater.value.toFixed(1)}%
                    </p>
                    <div className="w-full bg-cyan-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-cyan-500 h-full rounded-full"
                        style={{ width: `${Math.min(healthData.sanitation.improvedWater.value, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {healthData?.sanitation?.basicSanitation?.value && (
                  <div className="bg-cyan-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <ShieldCheck size={12} className="text-cyan-500" />
                      <p className="text-xs text-cyan-600">Basic Sanitation</p>
                    </div>
                    <p className="text-lg font-bold text-cyan-700">
                      {healthData.sanitation.basicSanitation.value.toFixed(1)}%
                    </p>
                    <div className="w-full bg-cyan-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-cyan-500 h-full rounded-full"
                        style={{ width: `${Math.min(healthData.sanitation.basicSanitation.value, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Health Score */}
          {country.scores?.health !== undefined && (
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-green-700">Health Score</span>
                <span className="text-xl font-bold text-green-600">{country.scores.health.toFixed(1)}/100</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all" style={{ width: `${country.scores.health}%` }}></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
