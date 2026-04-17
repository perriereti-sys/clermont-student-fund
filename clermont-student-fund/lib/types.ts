export type AssetType = 'action' | 'etf' | 'or' | 'crypto';
export type Currency = 'USD' | 'EUR';
export type MovementType = 'BUY' | 'SELL' | 'DIVIDEND';

export interface Position {
  id: string;
  name: string;
  ticker: string;
  type: AssetType;
  sector: string;
  quantity: number;
  avgBuyPrice: number;
  currency: Currency;
  buyDate: string;
  lastBuyDate?: string;
}

export interface PortfolioData {
  positions: Position[];
  cashUSD: number;
  initialValueUSD: number;
  startDate: string;
  baseCurrency: 'USD';
}

export interface Movement {
  id: string;
  date: string;
  type: MovementType;
  ticker: string;
  name: string;
  quantity: number;
  price: number;
  currency: string;
  totalEUR: number;
  justification: string;
}

export interface HistoryPoint {
  date: string;
  value: number;
}

export interface EnrichedPosition extends Position {
  currentPrice: number;
  currentValueEUR: number;
  costBasisEUR: number;
  pnlEUR: number;
  pnlPercent: number;
  weight: number;
}

export interface PortfolioMetrics {
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  totalPnLPercent: number;
  sharpeRatio: number;
  beta: number;
  var95: number;
  maxDrawdown: number;
  positions: EnrichedPosition[];
  cashEUR: number;
  chartData: ChartPoint[];
  lastUpdated: string;
}

export interface Alert {
  type: 'warning' | 'danger';
  message: string;
  value: number;
  limit: number;
  ticker?: string;
}

export interface ChartPoint {
  date: string;
  portfolio: number;
  msciWorld: number | null;
  nasdaq100: number | null;
}
