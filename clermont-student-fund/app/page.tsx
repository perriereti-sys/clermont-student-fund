import { Suspense } from 'react';
import PortfolioHeader from '@/components/dashboard/PortfolioHeader';
import MetricsCards from '@/components/dashboard/MetricsCards';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import { PortfolioMetrics, ChartPoint } from '@/lib/types';

async function getPortfolioData(): Promise<PortfolioMetrics> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'}/api/portfolio`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('API error');
    return res.json();
  } catch {
    // Fallback data
    return {
      totalValue: 90600,
      totalCost: 92600,
      totalPnL: -2000,
      totalPnLPercent: -2.16,
      sharpeRatio: 0,
      beta: 1.0,
      var95: 0,
      maxDrawdown: 0,
      positions: [],
      cashEUR: 68100,
      lastUpdated: new Date().toISOString(),
    };
  }
}

async function getBenchmarkData(): Promise<ChartPoint[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'}/api/benchmarks`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.chartPoints;
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const [portfolio, chartData] = await Promise.all([
    getPortfolioData(),
    getBenchmarkData(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-gray-400 text-sm">
          Clermont Student Fund — Prix en temps réel
        </p>
      </div>

      <PortfolioHeader
        totalValue={portfolio.totalValue}
        totalPnL={portfolio.totalPnL}
        totalPnLPercent={portfolio.totalPnLPercent}
        lastUpdated={portfolio.lastUpdated}
      />

      <MetricsCards
        sharpeRatio={portfolio.sharpeRatio}
        beta={portfolio.beta}
        var95={portfolio.var95}
        maxDrawdown={portfolio.maxDrawdown}
        totalValue={portfolio.totalValue}
      />

      {chartData.length > 0 && <PerformanceChart data={chartData} />}

      <div className="bg-surface border border-border rounded-xl p-5">
        <h2 className="text-base font-semibold text-white mb-3">
          À propos du portefeuille
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs mb-1">Date de création</p>
            <p className="text-white font-medium">01/01/2025</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Capital initial</p>
            <p className="text-white font-medium">100 000 $</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Stratégie</p>
            <p className="text-white font-medium">Multi-actifs</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Devise de référence</p>
            <p className="text-white font-medium">USD</p>
          </div>
        </div>
      </div>
    </div>
  );
}
