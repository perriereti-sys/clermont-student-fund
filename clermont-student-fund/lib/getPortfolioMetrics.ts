import portfolioData from '@/data/portfolio.json';
import { EnrichedPosition, PortfolioMetrics, HistoryPoint, ChartPoint } from '@/lib/types';
import { fetchPrice, fetchPrices, fetchHistoricalPrices, HistoricalBar } from '@/lib/fetchPrice';
import {
  computeSharpeRatio,
  computeMaxDrawdown,
  computeVaR95,
  computeBeta,
  getDailyReturns,
} from '@/lib/calculations';

// ─── Helpers ────────────────────────────────────────────────────────────────

async function getEurUsdRate(): Promise<number> {
  const price = await fetchPrice('EURUSD=X');
  return price ?? 1.09;
}

/**
 * Forward-fills a price map (date → price) so every date has a value.
 */
function forwardFill(
  dates: string[],
  raw: Record<string, number>
): Record<string, number> {
  const result: Record<string, number> = {};
  let last: number | null = null;
  for (const d of dates) {
    if (raw[d] != null) last = raw[d];
    if (last != null) result[d] = last;
  }
  return result;
}

function barsToMap(bars: HistoricalBar[]): Record<string, number> {
  const m: Record<string, number> = {};
  bars.forEach((b) => { m[b.date] = b.close; });
  return m;
}

// ─── Historical data fetch ────────────────────────────────────────────────

interface HistoricalDataResult {
  /** date → filled price for every portfolio ticker + EURUSD + URTH + QQQ */
  prices: Record<string, Record<string, number>>;
  /** sorted list of all weekly dates covered */
  dates: string[];
}

async function fetchAllHistoricalData(): Promise<HistoricalDataResult> {
  const START_TS = Math.floor(new Date('2025-01-01').getTime() / 1000);
  const END_TS = Math.floor(Date.now() / 1000);

  const positions = portfolioData.positions;
  const tickersNeeded = [
    ...positions.map((p) => p.ticker),
    'EURUSD=X',
    'URTH',  // MSCI World ETF proxy
    'QQQ',   // Nasdaq 100
  ];

  // Fetch all in parallel
  const results = await Promise.all(
    tickersNeeded.map((t) => fetchHistoricalPrices(t, START_TS, END_TS))
  );

  // Build raw maps
  const rawMaps: Record<string, Record<string, number>> = {};
  tickersNeeded.forEach((t, i) => {
    rawMaps[t] = barsToMap(results[i]);
  });

  // Collect all dates
  const allDatesSet = new Set<string>();
  Object.values(rawMaps).forEach((m) =>
    Object.keys(m).forEach((d) => allDatesSet.add(d))
  );
  const dates = Array.from(allDatesSet)
    .filter((d) => d >= '2025-01-01')
    .sort();

  // Forward-fill each ticker
  const filled: Record<string, Record<string, number>> = {};
  for (const ticker of tickersNeeded) {
    filled[ticker] = forwardFill(dates, rawMaps[ticker]);
  }

  return { prices: filled, dates };
}

// ─── Portfolio history reconstruction ────────────────────────────────────

/**
 * For each weekly date, computes the estimated total portfolio value.
 * – positions not yet bought contribute their cost basis (cash proxy).
 * – positions already held contribute their historical market price.
 */
function buildPortfolioHistory(
  dates: string[],
  prices: Record<string, Record<string, number>>
): HistoryPoint[] {
  const positions = portfolioData.positions;
  const cashUSD = portfolioData.cashUSD;

  return dates.map((date) => {
    const eurUsd = prices['EURUSD=X']?.[date] ?? 1.09;
    let value = cashUSD;

    for (const pos of positions) {
      const toUsd = pos.currency === 'EUR' ? eurUsd : 1;

      if (date < pos.buyDate) {
        // Not yet purchased → add cost basis as virtual cash
        value += pos.quantity * pos.avgBuyPrice * toUsd;
      } else {
        // Held position → mark to market
        const px = prices[pos.ticker]?.[date];
        if (px != null && px > 0) {
          value += pos.quantity * px * toUsd;
        } else {
          // Fallback: cost basis
          value += pos.quantity * pos.avgBuyPrice * toUsd;
        }
      }
    }

    return { date, value };
  });
}

// ─── Public API ──────────────────────────────────────────────────────────

export async function getPortfolioMetrics(): Promise<PortfolioMetrics> {
  const eurUsd = await getEurUsdRate();

  const tickers = portfolioData.positions.map((p) => p.ticker);
  const priceMap = await fetchPrices(tickers);

  const positions: EnrichedPosition[] = (portfolioData.positions as any[]).map((pos) => {
    const currentPrice = priceMap[pos.ticker] ?? pos.avgBuyPrice;
    const toUsd = pos.currency === 'EUR' ? eurUsd : 1;
    const currentValueEUR = pos.quantity * currentPrice * toUsd;
    const costBasisEUR = pos.quantity * pos.avgBuyPrice * toUsd;
    const pnlEUR = currentValueEUR - costBasisEUR;
    const pnlPercent = costBasisEUR > 0 ? (pnlEUR / costBasisEUR) * 100 : 0;

    return {
      ...pos,
      currentPrice,
      currentValueEUR,
      costBasisEUR,
      pnlEUR,
      pnlPercent,
      weight: 0,
    };
  });

  const cashUSD = portfolioData.cashUSD;
  const totalInvested = positions.reduce((s, p) => s + p.currentValueEUR, 0);
  const totalValue = totalInvested + cashUSD;

  positions.forEach((p) => {
    p.weight = totalValue > 0 ? (p.currentValueEUR / totalValue) * 100 : 0;
  });

  const totalCost = portfolioData.initialValueUSD;
  const totalPnL = totalValue - totalCost;
  const totalPnLPercent = (totalPnL / totalCost) * 100;

  // Use historical data for risk metrics when available
  let sharpeRatio = 0;
  let maxDrawdown = 0;
  let var95 = 0;
  let beta = 1.05;

  try {
    const { prices, dates } = await fetchAllHistoricalData();
    const history = buildPortfolioHistory(dates, prices);

    if (history.length >= 5) {
      sharpeRatio = computeSharpeRatio(history);
      maxDrawdown = computeMaxDrawdown(history);
      var95 = computeVaR95(history, totalValue);

      // Beta vs MSCI World (URTH)
      const portfolioReturns = getDailyReturns(history);
      const urthValues = dates
        .map((d) => prices['URTH']?.[d])
        .filter((v): v is number => v != null);
      if (urthValues.length >= 5) {
        const urthReturns: number[] = [];
        for (let i = 1; i < urthValues.length; i++) {
          urthReturns.push((urthValues[i] - urthValues[i - 1]) / urthValues[i - 1]);
        }
        beta = computeBeta(portfolioReturns, urthReturns);
      }
    }
  } catch {
    // Fallback: metrics stay at defaults
  }

  return {
    totalValue,
    totalCost,
    totalPnL,
    totalPnLPercent,
    sharpeRatio,
    beta,
    var95,
    maxDrawdown,
    positions,
    cashEUR: cashUSD,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Returns weekly chart data: CSF portfolio vs MSCI World vs Nasdaq 100,
 * all indexed to base 100 on 2025-01-01.
 */
export async function getHistoricalChartData(): Promise<ChartPoint[]> {
  try {
    const { prices, dates } = await fetchAllHistoricalData();
    const history = buildPortfolioHistory(dates, prices);

    if (history.length === 0) return [];

    const portfolioBase = history[0].value;
    const urthBase = prices['URTH']?.[dates[0]];
    const qqqBase = prices['QQQ']?.[dates[0]];

    return dates.map((date, i) => {
      const portfolioVal = history[i]?.value;
      const urthVal = prices['URTH']?.[date];
      const qqqVal = prices['QQQ']?.[date];

      return {
        date,
        portfolio: portfolioVal != null ? (portfolioVal / portfolioBase) * 100 : null as any,
        msciWorld: urthVal != null && urthBase ? (urthVal / urthBase) * 100 : null,
        nasdaq100: qqqVal != null && qqqBase ? (qqqVal / qqqBase) * 100 : null,
      };
    });
  } catch {
    return [];
  }
}
