import PortfolioHeader from '@/components/dashboard/PortfolioHeader';
import MetricsCards from '@/components/dashboard/MetricsCards';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import AutoRefresh from '@/components/AutoRefresh';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import EmailCapture from '@/components/EmailCapture';
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
    <div className="flex flex-col gap-10">

      {/* Hero marketing */}
      <HeroSection />

      {/* ── PORTFOLIO ─────────────────────────────────── */}
      <section id="portfolio" className="flex flex-col gap-6 scroll-mt-20">

        <div className="flex items-center justify-between">
          <div>
            <p className="section-label mb-1">Portefeuille live</p>
            <h2 className="font-display font-bold text-xl text-slate-100">Performances en temps réel</h2>
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

        <div
          className="rounded-xl px-6 py-5"
          style={{ background: 'linear-gradient(145deg, #172E4A 0%, #112338 100%)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="section-label mb-4">Informations du fond</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {[
              { label: 'Création',   value: '01/10/2025'   },
              { label: 'Capital',    value: '$100 000'     },
              { label: 'Stratégie',  value: 'Multi-actifs' },
              { label: 'Devise',     value: 'USD'          },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="section-label mb-1">{label}</p>
                <p className="text-sm font-medium text-slate-200">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.2))' }} />
        <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: '#2d4a6a' }}>À propos</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.2), transparent)' }} />
      </div>

      {/* About */}
      <AboutSection />

      {/* Email capture */}
      <EmailCapture />

    </div>
  );
}
