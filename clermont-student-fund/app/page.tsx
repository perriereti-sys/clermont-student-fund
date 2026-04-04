import PortfolioHeader from '@/components/dashboard/PortfolioHeader';
import MetricsCards from '@/components/dashboard/MetricsCards';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import AutoRefresh from '@/components/AutoRefresh';
import { getPortfolioMetrics, getHistoricalChartData } from '@/lib/getPortfolioMetrics';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function DashboardPage() {
  // Fetch current metrics and historical chart data in parallel
  const [portfolio, chartData] = await Promise.all([
    getPortfolioMetrics().catch(() => ({
      totalValue: 100000,
      totalCost: 100000,
      totalPnL: 0,
      totalPnLPercent: 0,
      sharpeRatio: 0,
      beta: 1.0,
      var95: 0,
      maxDrawdown: 0,
      positions: [],
      cashEUR: 0,
      lastUpdated: new Date().toISOString(),
    })),
    getHistoricalChartData().catch(() => []),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-gray-400 text-sm">
            Clermont Student Fund — Prix en temps réel
          </p>
        </div>
        <AutoRefresh intervalMs={300_000} />
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

      {chartData.length >= 2 && <PerformanceChart data={chartData} />}

      <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-5">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
          À propos du portefeuille
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {[
            { label: 'Date de création', value: '01/01/2026' },
            { label: 'Capital initial',  value: '$100 000' },
            { label: 'Stratégie',        value: 'Multi-actifs' },
            { label: 'Devise de référence', value: 'USD' },
          ].map(({ label, value }) => (
            <div key={label} className="border-l-2 border-gold/20 pl-3">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">{label}</p>
              <p className="text-white font-semibold text-sm">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
