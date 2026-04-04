import PortfolioHeader from '@/components/dashboard/PortfolioHeader';
import MetricsCards from '@/components/dashboard/MetricsCards';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import AutoRefresh from '@/components/AutoRefresh';
import { getPortfolioMetrics, getHistoricalChartData } from '@/lib/getPortfolioMetrics';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function DashboardPage() {
  const [portfolio, chartData] = await Promise.all([
    getPortfolioMetrics().catch(() => ({
      totalValue: 100000, totalCost: 100000, totalPnL: 0, totalPnLPercent: 0,
      sharpeRatio: 0, beta: 1.0, var95: 0, maxDrawdown: 0,
      positions: [], cashEUR: 0, lastUpdated: new Date().toISOString(),
    })),
    getHistoricalChartData().catch(() => []),
  ]);

  return (
    <div className="flex flex-col gap-7">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-100 leading-tight">
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: '#4A6080' }}>
            Clermont Student Fund · Prix en temps réel
          </p>
        </div>
        <AutoRefresh intervalMs={300_000} />
      </div>

      {/* ── Portfolio value hero ── */}
      <PortfolioHeader
        totalValue={portfolio.totalValue}
        totalPnL={portfolio.totalPnL}
        totalPnLPercent={portfolio.totalPnLPercent}
        lastUpdated={portfolio.lastUpdated}
      />

      {/* ── Risk metrics ── */}
      <MetricsCards
        sharpeRatio={portfolio.sharpeRatio}
        beta={portfolio.beta}
        var95={portfolio.var95}
        maxDrawdown={portfolio.maxDrawdown}
        totalValue={portfolio.totalValue}
      />

      {/* ── Performance chart ── */}
      {chartData.length >= 2 && <PerformanceChart data={chartData} />}

      {/* ── Fund info ── */}
      <div className="card-static relative overflow-hidden rounded-2xl">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="px-6 py-5">
          <p className="section-label mb-5">À propos du fonds</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: 'Création',           value: '01/01/2026' },
              { label: 'Capital initial',    value: '$100 000'   },
              { label: 'Stratégie',          value: 'Multi-actifs' },
              { label: 'Devise de référence',value: 'USD'        },
            ].map(({ label, value }) => (
              <div key={label} className="border-l-2 pl-4" style={{ borderColor: 'rgba(212,175,55,0.25)' }}>
                <p className="section-label mb-1.5">{label}</p>
                <p className="text-sm font-semibold text-slate-200">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
