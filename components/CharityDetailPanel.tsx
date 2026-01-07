'use client';

import { X, Heart, DollarSign, TrendingUp, Globe, Calendar, ExternalLink, MapPin, Building, FileText, PieChart, BarChart3 } from 'lucide-react';
import { formatNumber } from '@/utils/helpers';
import { cn } from '@/lib/utils';

interface CharityDetailPanelProps {
  charity: any;
  onClose: () => void;
}

export default function CharityDetailPanel({ charity, onClose }: CharityDetailPanelProps) {
  if (!charity) return null;

  // MongoDB data structure: totalRevenue, totalExpenses, totalAssets, netAssets, year, operatingExpenseRatio
  const hasFinancials = charity.latestFiling != null && (
    charity.latestFiling.totalRevenue !== undefined || 
    charity.latestFiling.totalExpenses !== undefined
  );

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Education': 'bg-blue-500',
      'Health': 'bg-red-500',
      'Food': 'bg-primary',
      'Refugee': 'bg-purple-500',
      'Disaster Relief': 'bg-orange-500',
      'Human Rights': 'bg-pink-500',
      'Economic Development': 'bg-sky-500',
      'Water & Sanitation': 'bg-cyan-500',
      'Women Rights': 'bg-rose-500',
      'Child Welfare': 'bg-indigo-500',
      'Environment': 'bg-emerald-500',
      'Climate': 'bg-lime-500',
    };
    return colors[category] || 'bg-muted-foreground';
  };

  const getTransparencyColor = (score: number) => {
    if (score >= 90) return { bg: 'bg-primary', text: 'text-white', label: 'Excellent' };
    if (score >= 75) return { bg: 'bg-blue-500', text: 'text-white', label: 'Good' };
    if (score >= 60) return { bg: 'bg-yellow-500', text: 'text-white', label: 'Fair' };
    if (score >= 40) return { bg: 'bg-orange-500', text: 'text-white', label: 'Average' };
    return { bg: 'bg-destructive', text: 'text-white', label: 'Needs Improvement' };
  };

  return (
    <div className="w-[480px] flex-shrink-0 border-l bg-card flex flex-col overflow-hidden">
      {/* Header - CountryDetailPanel과 동일한 스타일 */}
      <div className="flex-shrink-0 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-card to-accent/20"></div>
        
        <div className="relative p-5">
          {/* Top bar - Close button */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                {charity.ein || 'N/A'}
              </span>
              <span className="text-xs text-muted-foreground">Charity Details</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <X size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          </div>

          {/* Main charity info */}
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 relative">
              <div className="w-20 h-14 bg-primary/10 rounded-lg shadow-md border-2 border-card flex items-center justify-center">
                <Heart size={28} className="text-primary" />
              </div>
              {/* Transparency badge */}
              {charity.transparencyScore !== undefined && (
                <div 
                  className={cn(
                    "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card shadow flex items-center justify-center text-[8px] font-bold text-white",
                    getTransparencyColor(charity.transparencyScore).bg
                  )}
                >
                  {charity.financialGrade || ''}
                </div>
              )}
            </div>
            
            {/* Charity name and basic info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
                {charity.name}
              </h2>
              
              {/* Score tags */}
              <div className="flex items-center gap-2 flex-wrap">
                {charity.transparencyScore !== undefined ? (
                  <span className={cn(
                    "px-2.5 py-1 text-xs font-bold rounded-full",
                    getTransparencyColor(charity.transparencyScore).bg,
                    getTransparencyColor(charity.transparencyScore).text
                  )}>
                    {charity.transparencyScore}/100
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-muted text-muted-foreground">
                    Pending
                  </span>
                )}
                {charity.financialGrade && (
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-500 text-white">
                    Grade {charity.financialGrade}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Key indicator cards - 3 column grid (CountryDetailPanel과 동일) */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {/* Revenue */}
            <div className="bg-card/80 rounded-lg border p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <DollarSign size={12} className="text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground uppercase font-medium">Revenue</span>
              </div>
              <p className="text-sm font-bold text-primary truncate">
                {charity.latestFiling?.totalRevenue 
                  ? `$${formatNumber(charity.latestFiling.totalRevenue)}` 
                  : 'N/A'}
              </p>
            </div>
            
            {/* Expenses */}
            <div className="bg-card/80 rounded-lg border p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <PieChart size={12} className="text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground uppercase font-medium">Expenses</span>
              </div>
              <p className="text-sm font-bold text-orange-600 truncate">
                {charity.latestFiling?.totalExpenses 
                  ? `$${formatNumber(charity.latestFiling.totalExpenses)}` 
                  : 'N/A'}
              </p>
            </div>
            
            {/* Assets */}
            <div className="bg-card/80 rounded-lg border p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <BarChart3 size={12} className="text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground uppercase font-medium">Assets</span>
              </div>
              <p className="text-sm font-bold text-purple-600 truncate">
                {charity.latestFiling?.totalAssets 
                  ? `$${formatNumber(charity.latestFiling.totalAssets)}` 
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto bg-muted/30 p-4 space-y-4">
        {/* Description */}
        {charity.description && (
          <div className="bg-card rounded-lg border p-4">
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <FileText size={16} className="text-muted-foreground" />
              About
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{charity.description}</p>
          </div>
        )}

        {/* Organization info */}
        {charity.organization && (charity.organization.city || charity.organization.state || charity.organization.foundedYear) && (
          <div className="bg-card rounded-lg border p-4">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Building size={16} className="text-muted-foreground" />
              Organization Info
            </h3>
            <div className="space-y-2">
              {(charity.organization.city || charity.organization.state) && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={14} />
                  <span>
                    {[charity.organization.city, charity.organization.state, charity.organization.zipcode]
                      .filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
              {charity.organization.foundedYear && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={14} />
                  <span>Founded: {charity.organization.foundedYear}</span>
                </div>
              )}
              {charity.organization.nteeCode && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText size={14} />
                  <span>NTEE: {charity.organization.nteeCode}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Focus areas */}
        {charity.category && charity.category.length > 0 && (
          <div className="bg-card rounded-lg border p-4">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Globe size={16} className="text-primary" />
              Focus Areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {charity.category.map((cat: string, idx: number) => (
                <span
                  key={idx}
                  className={cn("px-3 py-1 rounded-full text-xs font-semibold text-white", getCategoryColor(cat))}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Financial Details */}
        {hasFinancials && (
          <div className="bg-card rounded-lg border p-4">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <DollarSign size={16} className="text-primary" />
              Financial Details
              {charity.latestFiling?.year && (
                <span className="text-xs text-muted-foreground font-normal ml-auto flex items-center gap-1">
                  <Calendar size={12} />
                  FY {charity.latestFiling.year}
                </span>
              )}
            </h3>
            <div className="space-y-2">
              {charity.latestFiling?.totalRevenue !== undefined && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Total Revenue</span>
                  <span className="text-sm font-bold text-primary">
                    ${formatNumber(charity.latestFiling.totalRevenue)}
                  </span>
                </div>
              )}
              {charity.latestFiling?.contributions !== undefined && charity.latestFiling.contributions > 0 && (
                <div className="flex justify-between items-center py-1.5 pl-3">
                  <span className="text-xs text-muted-foreground">└ Donations</span>
                  <span className="text-xs font-medium text-foreground">
                    ${formatNumber(charity.latestFiling.contributions)}
                  </span>
                </div>
              )}
              {charity.latestFiling?.totalExpenses !== undefined && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Total Expenses</span>
                  <span className="text-sm font-bold text-orange-600">
                    ${formatNumber(charity.latestFiling.totalExpenses)}
                  </span>
                </div>
              )}
              {charity.latestFiling?.netAssets !== undefined && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Net Assets</span>
                  <span className="text-sm font-bold text-purple-600">
                    ${formatNumber(charity.latestFiling.netAssets)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Efficiency metrics */}
        {(charity.latestFiling?.programExpenseRatio !== undefined || 
          charity.latestFiling?.operatingExpenseRatio !== undefined) && (
          <div className="bg-card rounded-lg border p-4">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-purple-500" />
              Efficiency Metrics
            </h3>
            <div className="space-y-4">
              {/* Program expense ratio */}
              {charity.latestFiling?.programExpenseRatio !== undefined && charity.latestFiling.programExpenseRatio > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-muted-foreground">Program Expenses</span>
                    <span className={cn(
                      "text-sm font-bold",
                      charity.latestFiling.programExpenseRatio >= 70 ? 'text-primary' : 
                      charity.latestFiling.programExpenseRatio >= 50 ? 'text-yellow-600' : 'text-destructive'
                    )}>
                      {charity.latestFiling.programExpenseRatio.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className={cn(
                        "h-2.5 rounded-full transition-all",
                        charity.latestFiling.programExpenseRatio >= 70 ? 'bg-primary' : 
                        charity.latestFiling.programExpenseRatio >= 50 ? 'bg-yellow-500' : 'bg-destructive'
                      )}
                      style={{ width: `${Math.min(charity.latestFiling.programExpenseRatio, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Used for mission (Goal: 70%+)</p>
                </div>
              )}
              
              {/* Operating efficiency */}
              {charity.latestFiling?.operatingExpenseRatio !== undefined && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-muted-foreground">Operating Efficiency</span>
                    <span className={cn(
                      "text-sm font-bold",
                      charity.latestFiling.operatingExpenseRatio <= 80 ? 'text-primary' : 
                      charity.latestFiling.operatingExpenseRatio <= 95 ? 'text-yellow-600' : 'text-destructive'
                    )}>
                      {charity.latestFiling.operatingExpenseRatio.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className={cn(
                        "h-2.5 rounded-full transition-all",
                        charity.latestFiling.operatingExpenseRatio <= 80 ? 'bg-primary' : 
                        charity.latestFiling.operatingExpenseRatio <= 95 ? 'bg-yellow-500' : 'bg-destructive'
                      )}
                      style={{ width: `${Math.min(charity.latestFiling.operatingExpenseRatio, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Expense/Revenue ratio (Lower is better)</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-2">
          {/* IRS Form 990 link */}
          {charity.latestFiling?.pdfUrl && (
            <a
              href={charity.latestFiling.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-muted hover:bg-accent text-foreground font-medium text-sm transition-colors"
            >
              <FileText size={16} />
              View IRS Form 990
              <ExternalLink size={14} />
            </a>
          )}

          {/* Donate button */}
          {charity.website && (
            <a
              href={charity.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-lg transition-colors"
            >
              <Heart size={18} />
              Visit Donation Page
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
