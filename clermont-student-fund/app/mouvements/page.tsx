import MovementsTable from '@/components/movements/MovementsTable';
import movementsData from '@/data/movements.json';
import { Movement } from '@/lib/types';

export default function MouvementsPage() {
  const movements = movementsData.movements as Movement[];

  const buys     = movements.filter(m => m.type === 'BUY');
  const sells    = movements.filter(m => m.type === 'SELL');
  const invested = buys.reduce((s, m) => s + m.totalEUR, 0);
  const divs     = movements.filter(m => m.type === 'DIVIDEND');

  const fmtEur = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  const stats = [
    {
      label: 'Achats',
      value: buys.length,
      sub: 'opérations d\'achat',
      color: '#22c55e',
      bg: 'rgba(34,197,94,0.08)',
      border: 'rgba(34,197,94,0.2)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
        </svg>
      ),
    },
    {
      label: 'Ventes',
      value: sells.length,
      sub: `position${sells.length > 1 ? 's' : ''} cédée${sells.length > 1 ? 's' : ''}`,
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.08)',
      border: 'rgba(239,68,68,0.2)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
        </svg>
      ),
    },
    {
      label: 'Capital déployé',
      value: fmtEur(invested),
      sub: 'total investi',
      color: '#D4AF37',
      bg: 'rgba(212,175,55,0.08)',
      border: 'rgba(212,175,55,0.2)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    ...(divs.length > 0 ? [{
      label: 'Dividendes',
      value: divs.length,
      sub: 'perçus',
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.08)',
      border: 'rgba(59,130,246,0.2)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    }] : []),
  ];

  return (
    <div className="flex flex-col gap-7">

      {/* Header */}
      <div>
        <p className="section-label mb-1">Portefeuille</p>
        <h1 className="font-display font-bold text-2xl text-slate-100">Mouvements</h1>
        <p className="text-sm mt-1" style={{ color: '#4A6080' }}>
          Historique complet des opérations avec leur thèse d'investissement
        </p>
      </div>

      {/* Stats */}
      <div className={`grid gap-4 ${stats.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'}`}>
        {stats.map(({ label, value, sub, color, bg, border, icon }, i) => (
          <div
            key={label}
            className={`relative rounded-xl p-5 overflow-hidden ${stats.length === 3 && i === 2 ? 'col-span-2 sm:col-span-1' : ''}`}
            style={{ background: bg, border: `1px solid ${border}` }}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="section-label">{label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}18`, color }}>
                {icon}
              </div>
            </div>
            <p className="font-display font-bold text-2xl tabular-nums truncate" style={{ color }}>{value}</p>
            <p className="text-xs mt-1.5" style={{ color: '#4A6080' }}>{sub}</p>
          </div>
        ))}
      </div>

      <MovementsTable movements={movements} />
    </div>
  );
}
