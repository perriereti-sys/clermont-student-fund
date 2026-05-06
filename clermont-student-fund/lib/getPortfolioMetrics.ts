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
  prices: Record<string, Record<string, number>>;
  dates: string[];
}

async function fetchAllHistoricalData(): Promise<HistoricalDataResult> {
  const START_TS = Math.floor(new Date('2026-01-01').getTime() / 1000);
  const END_TS   = Math.floor(Date.now() / 1000);

  const positions    = portfolioData.positions;
  const tickersNeeded = [
    ...positions.map((p) => p.ticker),
    'EURUSD=X',
    'URTH',
    'QQQ',
  ];

  const results = await Promise.all(
    tickersNeeded.map((t) => fetchHistoricalPrices(t, START_TS, END_TS))
  );

  const rawMaps: Record<string, Record<string, number>> = {};
  tickersNeeded.forEach((t, i) => { rawMaps[t] = barsToMap(results[i]); });

  const allDatesSet = new Set<string>();
  Object.values(rawMaps).forEach((m) =>
    Object.keys(m).forEach((d) => allDatesSet.add(d))
  );
  const dates = Array.from(allDatesSet)
    .filter((d) => d >= '2026-01-01')
    .sort();

  const filled: Record<string, Record<string, number>> = {};
  for (const ticker of tickersNeeded) {
    filled[ticker] = forwardFill(dates, rawMaps[ticker]);
  }

  return { prices: filled, dates };
}

// ─── Portfolio history reconstruction (all values in USD) ────────────────

interface EnrichedHistoryPoint extends HistoryPoint {
  investedValue: number;
  costBasis:     number;
}

function buildPortfolioHistory(
  dates: string[],
  prices: Record<string, Record<string, number>>
): EnrichedHistoryPoint[] {
  const positions = portfolioData.positions;
  const cashUSD   = portfolioData.cashUSD;

  return dates.map((date) => {
    const eurUsd = prices['EURUSD=X']?.[date] ?? 1.09;
    let value         = cashUSD;
    let investedValue = 0;
    let costBasis     = 0;

    for (const pos of positions) {
      const toUsd = pos.currency === 'EUR' ? eurUsd : 1;

      if (date < pos.buyDate) {
        // Position not yet held — add cost as placeholder for total value only
        value += pos.quantity * pos.avgBuyPrice * toUsd;
      } else {
        const px = prices[pos.ticker]?.[date];
        const mv = (px != null && px > 0)
          ? pos.quantity * px * toUsd
          : pos.quantity * pos.avgBuyPrice * toUsd;
        value         += mv;
        investedValue += mv;
        costBasis     += pos.quantity * pos.avgBuyPrice * toUsd;
      }
    }

    return { date, value, investedValue, costBasis };
  });
}

// ─── Public API ──────────────────────────────────────────────────────────

export async function getPortfolioMetrics(): Promise<PortfolioMetrics> {
  const eurUsd = await getEurUsdRate();

  const tickers  = portfolioData.positions.map((p) => p.ticker);
  const priceMap = await fetchPrices(tickers);

  // All position values in USD
  const positions: EnrichedPosition[] = (portfolioData.positions as any[]).map((pos) => {
    const currentPrice = priceMap[pos.ticker] ?? pos.avgBuyPrice;
    // EUR positions × eurUsd = USD value
    const toUsd = pos.currency === 'EUR' ? eurUsd : 1;
    const currentValueEUR = pos.quantity * currentPrice * toUsd;
    const costBasisEUR    = pos.quantity * pos.avgBuyPrice * toUsd;
    const pnlEUR          = currentValueEUR - costBasisEUR;
    const pnlPercent      = costBasisEUR > 0 ? (pnlEUR / costBasisEUR) * 100 : 0;

    return { ...pos, currentPrice, currentValueEUR, costBasisEUR, pnlEUR, pnlPercent, weight: 0 };
  });

  const cashUSD      = portfolioData.cashUSD;
  const totalInvested = positions.reduce((s, p) => s + p.currentValueEUR, 0);
  const totalValue    = totalInvested + cashUSD;

  positions.forEach((p) => {
    p.weight = totalValue > 0 ? (p.currentValueEUR / totalValue) * 100 : 0;
  });

  const totalCost       = portfolioData.initialValueUSD;
  const totalPnL        = totalValue - totalCost;
  const totalPnLPercent = (totalPnL / totalCost) * 100;

  let sharpeRatio = 0;
  let maxDrawdown = 0;
  let var95       = 0;
  let beta        = 1.05;
  let chartData: ChartPoint[] = [];

  try {
    const { prices, dates } = await fetchAllHistoricalData();
    const history = buildPortfolioHistory(dates, prices);

    // Anchor last point to actual live value
    if (history.length > 0) {
      history[history.length - 1] = {
        ...history[history.length - 1],
        date:  history[history.length - 1].date,
        value: totalValue,
      };
    }

    const historyForStats: HistoryPoint[] = history.map(h => ({ date: h.date, value: h.value }));

    if (historyForStats.length >= 5) {
      sharpeRatio = computeSharpeRatio(historyForStats);
      maxDrawdown = computeMaxDrawdown(historyForStats);
      var95       = computeVaR95(historyForStats, totalValue);

      const portfolioReturns = getDailyReturns(historyForStats);
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

    // Build chart indexed to 100 from initial capital
    if (history.length > 0) {
      const portfolioBase = totalCost;
      // Find first date with actual URTH/QQQ data (Jan 1 = US holiday, markets closed)
      const urthBase = dates.reduce<number | undefined>((acc, d) => acc ?? prices['URTH']?.[d], undefined);
      const qqqBase  = dates.reduce<number | undefined>((acc, d) => acc ?? prices['QQQ']?.[d],  undefined);

      chartData = dates.map((date, i) => ({
        date,
        portfolio: history[i] != null ? (history[i].value / portfolioBase) * 100 : (null as any),
        deployed: history[i] && history[i].costBasis > 0
          ? (history[i].investedValue / history[i].costBasis) * 100
          : null,
        msciWorld: urthBase && prices['URTH']?.[date] != null
          ? (prices['URTH'][date] / urthBase) * 100
          : null,
        nasdaq100: qqqBase && prices['QQQ']?.[date] != null
          ? (prices['QQQ'][date] / qqqBase) * 100
          : null,
      }));
    }
  } catch {
    // Metrics and chart stay at defaults
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
    eurUsd,
    chartData,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * @deprecated Use getPortfolioMetrics().chartData instead.
 */
export async function getHistoricalChartData(): Promise<ChartPoint[]> {
  const metrics = await getPortfolioMetrics();
  return metrics.chartData;
}
