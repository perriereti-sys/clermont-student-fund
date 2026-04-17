import { NextResponse } from 'next/server';
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

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function getEurUsdRate(): Promise<number> {
  const price = await fetchPrice('EURUSD=X');
  return price ?? 1.09;
}

export async function GET() {
  try {
    const eurUsd = await getEurUsdRate();

    const tickers = portfolioData.positions.map((p) => p.ticker);
    const priceMap = await fetchPrices(tickers);

    // Everything is computed in USD
    const positions: EnrichedPosition[] = (portfolioData.positions as any[]).map((pos) => {
      const currentPrice = priceMap[pos.ticker] ?? pos.avgBuyPrice;
      // EUR positions are converted to USD, USD positions stay as-is
      const toUsd = pos.currency === 'EUR' ? eurUsd : 1;
      const currentValueEUR = pos.quantity * currentPrice * toUsd;  // actually USD
      const costBasisEUR = pos.quantity * pos.avgBuyPrice * toUsd;  // actually USD
      const pnlEUR = currentValueEUR - costBasisEUR;                // actually USD
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

    const metrics: PortfolioMetrics = {
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
      chartData: [],
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Portfolio API error:', error);
    return NextResponse.json(
      { error: 'Impossible de récupérer les données' },
      { status: 500 }
    );
  }
}
