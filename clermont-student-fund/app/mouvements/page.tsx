import MovementsTable from '@/components/movements/MovementsTable';
import movementsData from '@/data/movements.json';
import { Movement } from '@/lib/types';

export default function MouvementsPage() {
  const movements = movementsData.movements as Movement[];

  const totalBuys     = movements.filter((m) => m.type === 'BUY').length;
  const totalSells    = movements.filter((m) => m.type === 'SELL').length;
  const totalInvested = movements.filter((m) => m.type === 'BUY').reduce((s, m) => s + m.totalEUR, 0);

  const fmtUsd = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  const stats = [
    { label: 'Opérations d\'achat',  value: totalBuys,            color: 'text-gain',      sub: 'positions ouvertes'    },
    { label: 'Opérations de vente',  value: totalSells,           color: 'text-loss',      sub: 'positions cédées'      },
    { label: 'Capital déployé',      value: fmtUsd(totalInvested),color: 'text-slate-100', sub: 'total investi en USD'  },
  ];

  return (
    <div className="flex flex-col gap-7">

      {/* Page header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-100">Mouvements</h1>
        <p className="text-sm mt-1" style={{ color: '#4A6080' }}>
          Historique complet des opérations avec leur thèse d'investissement
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, color, sub }) => (
          <div key={label} className="card relative overflow-hidden rounded-xl p-5">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
            <p className="section-label mb-3">{label}</p>
            <p className={`font-display font-bold text-2xl font-mono ${color}`}>{value}</p>
            <p className="text-xs mt-1.5" style={{ color: '#4A6080' }}>{sub}</p>
          </div>
        ))}
      </div>

      <MovementsTable movements={movements} />
    </div>
  );
}
