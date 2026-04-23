import PositionsTable from '@/components/positions/PositionsTable';
import AllocationCharts from '@/components/positions/AllocationCharts';
import AlertsPanel from '@/components/positions/AlertsPanel';
import { Alert } from '@/lib/types';
import { computeAlerts } from '@/lib/calculations';
import { getPortfolioMetrics } from '@/lib/getPortfolioMetrics';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function PositionsPage() {
  let portfolio;
  try {
    portfolio = await getPortfolioMetrics();
  } catch {
    portfolio = {
      totalValue: 100000, totalCost: 100000, totalPnL: 0, totalPnLPercent: 0,
      sharpeRatio: 0, beta: 1.0, var95: 0, maxDrawdown: 0,
      positions: [], cashEUR: 0, lastUpdated: new Date().toISOString(),
    };
  }

  const alerts: Alert[] = computeAlerts(portfolio.positions, portfolio.totalValue);

  const bestPos  = [...portfolio.positions].sort((a, b) => b.pnlPercent - a.pnlPercent)[0];
  const worstPos = [...portfolio.positions].sort((a, b) => a.pnlPercent - b.pnlPercent)[0];
  const fmtUsd   = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="flex flex-col gap-7">

      {/* Header */}
      <div>
        <p className="section-label mb-1">Portefeuille</p>
        <h1 className="font-display font-bold text-2xl text-slate-100">Positions ouvertes</h1>
        <p className="text-sm mt-1" style={{ color: '#4A6080' }}>
          {portfolio.positions.length} actifs · Prix en temps réel via Yahoo Finance
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card relative overflow-hidden rounded-xl p-5">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
          <p className="section-label mb-2">Positions</p>
          <p className="font-display font-bold text-2xl text-slate-100">{portfolio.positions.length}</p>
          <p className="text-xs mt-1" style={{ color: '#4A6080' }}>actifs en portefeuille</p>
        </div>

        {bestPos && (
          <div className="card relative overflow-hidden rounded-xl p-5">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gain/20 to-transparent" />
            <p className="section-label mb-2">Meilleure perf.</p>
            <p className="font-display font-bold text-xl text-gain truncate">{bestPos.ticker}</p>
            <p className="text-xs mt-1 font-mono text-gain">+{bestPos.pnlPercent.toFixed(1)}%</p>
          </div>
        )}

        {worstPos && (
          <div className="card relative overflow-hidden rounded-xl p-5">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-loss/20 to-transparent" />
            <p className="section-label mb-2">Pire perf.</p>
            <p className="font-display font-bold text-xl text-loss truncate">{worstPos.ticker}</p>
            <p className="text-xs mt-1 font-mono text-loss">{worstPos.pnlPercent.toFixed(1)}%</p>
          </div>
        )}
      </div>

      {/* Alerts */}
      <AlertsPanel alerts={alerts} />

      {/* Allocation charts */}
      <AllocationCharts
        positions={portfolio.positions}
        cashEUR={portfolio.cashEUR}
        totalValue={portfolio.totalValue}
      />

      {/* Positions table */}
      <PositionsTable positions={portfolio.positions} cashEUR={portfolio.cashEUR} />
    </div>
  );
}
