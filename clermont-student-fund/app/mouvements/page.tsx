import MovementsTable from '@/components/movements/MovementsTable';
import movementsData from '@/data/movements.json';
import { Movement } from '@/lib/types';

export default function MouvementsPage() {
  const movements = movementsData.movements as Movement[];

  const totalBuys = movements.filter((m) => m.type === 'BUY').length;
  const totalSells = movements.filter((m) => m.type === 'SELL').length;
  const totalInvested = movements
    .filter((m) => m.type === 'BUY')
    .reduce((s, m) => s + m.totalEUR, 0);

  const fmtUsd = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Mouvements</h1>
        <p className="text-gray-400 text-sm">
          Historique de toutes les opérations avec leur justification
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Achats</p>
          <p className="text-2xl font-bold text-gain">{totalBuys}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Ventes</p>
          <p className="text-2xl font-bold text-loss">{totalSells}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Total investi</p>
          <p className="text-2xl font-bold text-white">{fmtUsd(totalInvested)}</p>
        </div>
      </div>

      <MovementsTable movements={movements} />
    </div>
  );
}
