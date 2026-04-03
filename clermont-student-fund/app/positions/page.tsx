import { Suspense } from 'react';
import PositionsTable from '@/components/positions/PositionsTable';
import AllocationCharts from '@/components/positions/AllocationCharts';
import AlertsPanel from '@/components/positions/AlertsPanel';
import AddPositionModal from '@/components/positions/AddPositionModal';
import { PortfolioMetrics, Alert } from '@/lib/types';
import { computeAlerts } from '@/lib/calculations';

async function getPortfolioData(): Promise<PortfolioMetrics> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'}/api/portfolio`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('API error');
    return res.json();
  } catch {
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

export default async function PositionsPage() {
  const portfolio = await getPortfolioData();
  const alerts: Alert[] = computeAlerts(portfolio.positions, portfolio.totalValue);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Positions</h1>
          <p className="text-gray-400 text-sm">
            {portfolio.positions.length} positions ouvertes — Prix en temps réel
          </p>
        </div>
        <AddPositionModal />
      </div>

      <AlertsPanel alerts={alerts} />

      <AllocationCharts
        positions={portfolio.positions}
        cashEUR={portfolio.cashEUR}
        totalValue={portfolio.totalValue}
      />

      <PositionsTable
        positions={portfolio.positions}
        cashEUR={portfolio.cashEUR}
      />
    </div>
  );
}
