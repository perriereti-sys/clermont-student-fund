import PortfolioHeader from '@/components/dashboard/PortfolioHeader';
import MetricsCards from '@/components/dashboard/MetricsCards';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import AutoRefresh from '@/components/AutoRefresh';
import { getPortfolioMetrics } from '@/lib/getPortfolioMetrics';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function DashboardPage() {
  const portfolio = await getPortfolioMetrics().catch(() => ({
    totalValue: 100000, totalCost: 100000, totalPnL: 0, totalPnLPercent: 0,
    sharpeRatio: 0, beta: 1.0, var95: 0, maxDrawdown: 0,
    positions: [], cashEUR: 0, chartData: [], lastUpdated: new Date().toISOString(),
  }));
  const chartData = portfolio.chartData;

  return (
    <div className="flex flex-col gap-6">

      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Dashboard</h1>
          <p className="text-xs mt-0.5" style={{ color: '#4A6080' }}>Clermont Student Fund</p>
        </div>
        <AutoRefresh intervalMs={300_000} />
      </div>

      {/* Portfolio value */}
      <PortfolioHeader
        totalValue={portfolio.totalValue}
        totalPnL={portfolio.totalPnL}
        totalPnLPercent={portfolio.totalPnLPercent}
        lastUpdated={portfolio.lastUpdated}
      />

      {/* Risk metrics */}
      <MetricsCards
        sharpeRatio={portfolio.sharpeRatio}
        beta={portfolio.beta}
        var95={portfolio.var95}
        maxDrawdown={portfolio.maxDrawdown}
        totalValue={portfolio.totalValue}
      />

      {/* Chart */}
      {chartData.length >= 2 && <PerformanceChart data={chartData} />}

      {/* Fund info */}
      <div className="rounded-xl border border-navy-600 px-6 py-5"
        style={{ background: '#0F2235' }}>
        <p className="section-label mb-4">Informations</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {[
            { label: 'Création',    value: '01/01/2026'  },
            { label: 'Capital',     value: '$100 000'    },
            { label: 'Stratégie',   value: 'Multi-actifs'},
            { label: 'Devise',      value: 'USD'         },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="section-label mb-1">{label}</p>
              <p className="text-sm text-slate-300">{value}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
