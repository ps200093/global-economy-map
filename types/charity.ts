// Charity data type (for MongoDB)
export interface CharityDocument {
  ein: string; // ProPublica EIN (unique identifier)
  name: string;
  nameKo?: string; // Korean name (if available)
  description?: string;
  website?: string;
  
  // Classification
  category: string[]; // ['Education', 'Health', 'Food', 'Refugees', 'Disaster Relief', 'Human Rights', etc.]
  regions: string[]; // ISO3 country code array
  
  // Organization info (from ProPublica)
  organization?: {
    address?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    nteeCode?: string; // NTEE classification code
    rulingDate?: string; // Tax-exempt qualification date
    foundedYear?: number;
  };
  
  // Evaluation
  transparencyScore?: number; // 0-100
  rating?: number; // 0-5
  financialGrade?: string; // A+ ~ F
  
  // ProPublica financial data (latest)
  latestFiling?: {
    year: number;
    taxPeriod?: string; // YYYYMM format
    pdfUrl?: string; // IRS Form 990 PDF link
    
    // Revenue
    totalRevenue: number;
    contributions: number; // Donations
    programRevenue: number; // Program revenue
    investmentIncome: number; // Investment income
    
    // Expenses
    totalExpenses: number;
    executiveCompensation: number; // Executive compensation
    salariesWages: number; // Salaries and wages
    payrollTax: number; // Payroll tax
    fundraisingExpenses: number; // Fundraising expenses
    
    // Assets
    totalAssets: number;
    totalLiabilities: number; // Total liabilities
    netAssets: number;
    
    // Metrics
    operatingExpenseRatio: number; // Expense/revenue ratio (%)
    programExpenseRatio?: number; // Program expense ratio (%)
    adminExpenseRatio?: number; // Admin expense ratio (%)
    fundraisingRatio?: number; // Fundraising expense ratio (%)
  };
  
  // Historical financial data (for trend analysis)
  historicalData?: {
    year: number;
    totalRevenue: number;
    totalExpenses: number;
    totalAssets: number;
    netAssets: number;
  }[];
  
  // For search
  searchKeywords: string[]; // Combined array of [name, nameKo, category, etc.] for search
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastSyncedAt?: Date; // Last synced from ProPublica
}

