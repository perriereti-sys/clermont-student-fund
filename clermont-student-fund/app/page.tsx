import PortfolioHeader from '@/components/dashboard/PortfolioHeader';
import MetricsCards from '@/components/dashboard/MetricsCards';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import AutoRefresh from '@/components/AutoRefresh';
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

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-navy-600 to-transparent my-2" />

      {/* About section */}
      <div className="flex flex-col gap-4">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: '#D4AF37' }}>
            Qui sommes-nous ?
          </p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-100 mb-3">
            Un fond étudiant né à Clermont-Ferrand
          </h2>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#6B84A0' }}>
            Le Clermont Student Fund est une association créée par des étudiants passionnés de marchés financiers.
            Notre objectif : apprendre ensemble, analyser des valeurs, construire une thèse d'investissement et la défendre — comme de vrais gérants de portefeuille.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          {[
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              ),
              title: 'Communauté étudiante',
              desc: 'Des étudiants de Clermont-Ferrand qui partagent la même passion pour la bourse et l\'investissement.',
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              ),
              title: 'Portefeuille réel',
              desc: 'On gère un portefeuille virtuel en conditions réelles avec une stratégie multi-actifs définie collectivement.',
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              ),
              title: 'Apprendre ensemble',
              desc: 'Analyses fondamentales, veille macro, lectures financières — on monte en compétences en groupe.',
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="card relative rounded-xl p-6 flex flex-col gap-3">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#D4AF3718', color: '#D4AF37' }}>
                {icon}
              </div>
              <p className="font-semibold text-slate-100 text-sm">{title}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#6B84A0' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Email capture */}
      <EmailCapture />

    </div>
  );
}
