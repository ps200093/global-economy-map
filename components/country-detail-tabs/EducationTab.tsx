'use client';

import { 
  GraduationCap, BookOpen, Users, TrendingUp, 
  School, Award, AlertTriangle, Clock,
  UserCheck, DollarSign, BookMarked
} from 'lucide-react';
import { EducationTabProps } from './types';

export default function EducationTab({ country, educationData, loading }: EducationTabProps) {
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

  // Enrollment rate color determination
  const getEnrollmentColor = (value: number) => {
    if (value >= 95) return 'text-green-600';
    if (value >= 80) return 'text-blue-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <GraduationCap size={18} className="text-indigo-500" />
        <h3 className="text-base font-bold text-slate-800">Education Indicators</h3>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-indigo-500"></div>
          <span className="ml-3 text-slate-500">Loading data...</span>
        </div>
      ) : (
        <>
          {/* Literacy Rates */}
          {(educationData?.literacy?.overall?.value || 
            educationData?.literacy?.youth?.value ||
            educationData?.literacy?.female?.value ||
            educationData?.literacy?.male?.value) && (
            <div className="bg-white rounded-xl p-4 border border-indigo-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <BookOpen size={16} className="text-indigo-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Literacy Rates</h4>
              </div>
              
              {/* Overall Literacy */}
              {educationData?.literacy?.overall?.value && (
                <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-indigo-600">Adult Literacy Rate</span>
                    <span className="text-2xl font-bold text-indigo-700">
                      {educationData.literacy.overall.value.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-indigo-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-full rounded-full"
                      style={{ width: `${Math.min(educationData.literacy.overall.value, 100)}%` }}
                    ></div>
                  </div>
                  {educationData.literacy.trend && educationData.literacy.trend.length > 0 && (
                    <div className="flex items-center justify-between mt-3">
                      {renderSparkline(educationData.literacy.trend, '#6366f1')}
                      <span className="text-[10px] text-slate-500">
                        {educationData.literacy.trend[0]?.year} - {educationData.literacy.trend[educationData.literacy.trend.length - 1]?.year}
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Literacy by Gender/Age */}
              <div className="grid grid-cols-3 gap-2">
                {educationData?.literacy?.youth?.value && (
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500 mb-1">Youth</p>
                    <p className="text-lg font-bold text-slate-700">
                      {educationData.literacy.youth.value.toFixed(1)}%
                    </p>
                    <p className="text-[10px] text-slate-400">Ages 15-24</p>
                  </div>
                )}
                
                {educationData?.literacy?.female?.value && (
                  <div className="bg-pink-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-pink-500 mb-1">Female</p>
                    <p className="text-lg font-bold text-pink-600">
                      {educationData.literacy.female.value.toFixed(1)}%
                    </p>
                  </div>
                )}
                
                {educationData?.literacy?.male?.value && (
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-blue-500 mb-1">Male</p>
                    <p className="text-lg font-bold text-blue-600">
                      {educationData.literacy.male.value.toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* School Enrollment */}
          {(educationData?.enrollment?.preprimary?.value || 
            educationData?.enrollment?.primary?.value ||
            educationData?.enrollment?.secondary?.value ||
            educationData?.enrollment?.tertiary?.value) && (
            <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <School size={16} className="text-green-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">School Enrollment</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {educationData?.enrollment?.preprimary?.value && (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <BookMarked size={12} className="text-slate-500" />
                      <p className="text-xs text-slate-600">Pre-Primary</p>
                    </div>
                    <p className={`text-lg font-bold ${getEnrollmentColor(educationData.enrollment.preprimary.value)}`}>
                      {educationData.enrollment.preprimary.value.toFixed(1)}%
                    </p>
                  </div>
                )}
                
                {educationData?.enrollment?.primary?.value && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <School size={12} className="text-green-500" />
                      <p className="text-xs text-green-600">Primary</p>
                    </div>
                    <p className={`text-lg font-bold ${getEnrollmentColor(educationData.enrollment.primary.value)}`}>
                      {educationData.enrollment.primary.value.toFixed(1)}%
                    </p>
                  </div>
                )}
                
                {educationData?.enrollment?.secondary?.value && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <School size={12} className="text-blue-500" />
                      <p className="text-xs text-blue-600">Secondary</p>
                    </div>
                    <p className={`text-lg font-bold ${getEnrollmentColor(educationData.enrollment.secondary.value)}`}>
                      {educationData.enrollment.secondary.value.toFixed(1)}%
                    </p>
                  </div>
                )}
                
                {educationData?.enrollment?.tertiary?.value && (
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <GraduationCap size={12} className="text-purple-500" />
                      <p className="text-xs text-purple-600">Tertiary</p>
                    </div>
                    <p className={`text-lg font-bold ${getEnrollmentColor(educationData.enrollment.tertiary.value)}`}>
                      {educationData.enrollment.tertiary.value.toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Completion Rates */}
          {(educationData?.completion?.primary?.value || 
            educationData?.completion?.lowerSecondary?.value ||
            educationData?.completion?.upperSecondary?.value) && (
            <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Award size={16} className="text-amber-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Completion Rates</h4>
              </div>
              
              <div className="space-y-3">
                {educationData?.completion?.primary?.value && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600">Primary School</span>
                      <span className="text-sm font-semibold text-amber-600">
                        {educationData.completion.primary.value.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-amber-100 rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${Math.min(educationData.completion.primary.value, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {educationData?.completion?.lowerSecondary?.value && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600">Lower Secondary</span>
                      <span className="text-sm font-semibold text-amber-600">
                        {educationData.completion.lowerSecondary.value.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-amber-100 rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${Math.min(educationData.completion.lowerSecondary.value, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {educationData?.completion?.upperSecondary?.value && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600">Upper Secondary</span>
                      <span className="text-sm font-semibold text-amber-600">
                        {educationData.completion.upperSecondary.value.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-amber-100 rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${Math.min(educationData.completion.upperSecondary.value, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Out-of-School Children */}
          {(educationData?.outOfSchool?.primary?.value || 
            educationData?.outOfSchool?.secondary?.value ||
            educationData?.outOfSchool?.childrenCount?.value) && (
            <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={16} className="text-red-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Out-of-School Children</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {educationData?.outOfSchool?.primary?.value !== null && educationData?.outOfSchool?.primary?.value !== undefined && (
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Users size={12} className="text-red-500" />
                      <p className="text-xs text-red-600">Primary Age</p>
                    </div>
                    <p className={`text-lg font-bold ${educationData.outOfSchool.primary.value > 10 ? 'text-red-600' : 'text-orange-600'}`}>
                      {educationData.outOfSchool.primary.value.toFixed(1)}%
                    </p>
                  </div>
                )}
                
                {educationData?.outOfSchool?.secondary?.value !== null && educationData?.outOfSchool?.secondary?.value !== undefined && (
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Users size={12} className="text-red-500" />
                      <p className="text-xs text-red-600">Secondary Age</p>
                    </div>
                    <p className={`text-lg font-bold ${educationData.outOfSchool.secondary.value > 20 ? 'text-red-600' : 'text-orange-600'}`}>
                      {educationData.outOfSchool.secondary.value.toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
              
              {educationData?.outOfSchool?.childrenCount?.value && (
                <div className="mt-3 flex items-center justify-between py-2 border-t border-slate-100">
                  <span className="text-sm text-slate-600">Out-of-School Children</span>
                  <span className="text-sm font-semibold text-red-600">
                    {(educationData.outOfSchool.childrenCount.value / 1000).toFixed(0)}K
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Education Quality */}
          {(educationData?.quality?.pupilTeacherPrimary?.value || 
            educationData?.quality?.pupilTeacherSecondary?.value ||
            educationData?.quality?.trainedTeachers?.value) && (
            <div className="bg-white rounded-xl p-4 border border-teal-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                  <UserCheck size={16} className="text-teal-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Education Quality</h4>
              </div>
              
              <div className="space-y-3">
                {educationData?.quality?.pupilTeacherPrimary?.value && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Pupil-Teacher Ratio (Primary)</span>
                    <span className={`text-sm font-semibold ${educationData.quality.pupilTeacherPrimary.value > 40 ? 'text-red-600' : 'text-teal-600'}`}>
                      {educationData.quality.pupilTeacherPrimary.value.toFixed(0)}
                    </span>
                  </div>
                )}
                
                {educationData?.quality?.pupilTeacherSecondary?.value && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Pupil-Teacher Ratio (Secondary)</span>
                    <span className={`text-sm font-semibold ${educationData.quality.pupilTeacherSecondary.value > 30 ? 'text-red-600' : 'text-teal-600'}`}>
                      {educationData.quality.pupilTeacherSecondary.value.toFixed(0)}
                    </span>
                  </div>
                )}
                
                {educationData?.quality?.trainedTeachers?.value && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-600">Trained Teachers</span>
                    <span className="text-sm font-semibold text-teal-600">
                      {educationData.quality.trainedTeachers.value.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Education Investment */}
          {(educationData?.expenditure?.percentGdp?.value || 
            educationData?.expenditure?.percentGovt?.value ||
            educationData?.outcomes?.expectedYearsSchooling?.value) && (
            <div className="bg-white rounded-xl p-4 border border-cyan-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                  <DollarSign size={16} className="text-cyan-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Education Investment & Outcomes</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {educationData?.expenditure?.percentGdp?.value && (
                  <div className="bg-cyan-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingUp size={12} className="text-cyan-500" />
                      <p className="text-xs text-cyan-600">% of GDP</p>
                    </div>
                    <p className="text-lg font-bold text-cyan-700">
                      {educationData.expenditure.percentGdp.value.toFixed(1)}%
                    </p>
                  </div>
                )}
                
                {educationData?.expenditure?.percentGovt?.value && (
                  <div className="bg-cyan-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <DollarSign size={12} className="text-cyan-500" />
                      <p className="text-xs text-cyan-600">% of Govt Spending</p>
                    </div>
                    <p className="text-lg font-bold text-cyan-700">
                      {educationData.expenditure.percentGovt.value.toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
              
              {educationData?.outcomes?.expectedYearsSchooling?.value && (
                <div className="mt-3 bg-indigo-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-indigo-500" />
                      <span className="text-sm text-indigo-600">Expected Years of Schooling</span>
                    </div>
                    <span className="text-xl font-bold text-indigo-700">
                      {educationData.outcomes.expectedYearsSchooling.value.toFixed(1)} yrs
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Education Score */}
          {country.scores?.education !== undefined && (
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-indigo-700">Education Score</span>
                <span className="text-xl font-bold text-indigo-600">{country.scores.education.toFixed(1)}/100</span>
              </div>
              <div className="w-full bg-indigo-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full rounded-full transition-all" style={{ width: `${country.scores.education}%` }}></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
