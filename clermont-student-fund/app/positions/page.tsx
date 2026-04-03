import PositionsTable from '@/components/positions/PositionsTable';
import AllocationCharts from '@/components/positions/AllocationCharts';
import AlertsPanel from '@/components/positions/AlertsPanel';
import AddPositionModal from '@/components/positions/AddPositionModal';
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
    };
  }

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
