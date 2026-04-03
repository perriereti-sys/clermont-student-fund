import portfolioData from '@/data/portfolio.json';
import historyData from '@/data/history.json';
import { EnrichedPosition, PortfolioMetrics } from '@/lib/types';
import { fetchPrice, fetchPrices } from '@/lib/fetchPrice';
import {
  computeSharpeRatio,
  computeMaxDrawdown,
  computeVaR95,
  getDailyReturns,
} from '@/lib/calculations';

async function getEurUsdRate(): Promise<number> {
  const price = await fetchPrice('EURUSD=X');
  return price ?? 1.09;
}

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

  const history = historyData.history;
  const totalCost = portfolioData.initialValueUSD;
  const totalPnL = totalValue - totalCost;
  const totalPnLPercent = (totalPnL / totalCost) * 100;

  return {
    totalValue,
    totalCost,
    totalPnL,
    totalPnLPercent,
    sharpeRatio: computeSharpeRatio(history),
    beta: 1.05,
    var95: computeVaR95(history, totalValue),
    maxDrawdown: computeMaxDrawdown(history),
    positions,
    cashEUR: cashUSD,
    lastUpdated: new Date().toISOString(),
  };
}

export function getBenchmarkChartPoints() {
  const history = historyData.history;
  const portfolioBase = history[0]?.value ?? 92600;
  return history.map((h) => ({
    date: h.date,
    portfolio: (h.value / portfolioBase) * 100,
    msciWorld: null,
    nasdaq100: null,
  }));
}
