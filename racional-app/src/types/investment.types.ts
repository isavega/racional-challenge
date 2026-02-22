export type Currency = 'CLP' | 'USD';

export type TimeRange = '1M' | '3M' | '6M' | '1Y' | 'YTD' | 'ALL';

export interface EvolutionEntry {
  date: string;
  value: number;
  dailyReturn: number;
  contributions: number;
  portfolioIndex: number;
}

export interface InvestmentEvolutionDocument {
  evolution: EvolutionEntry[];
  currency: Currency;
}

export interface InvestmentEvolutionState {
  data: EvolutionEntry[] | null;
  currency: Currency;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}
