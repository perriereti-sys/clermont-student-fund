'use client';

import { Movement } from '@/lib/types';

interface Props {
  movements: Movement[];
}

export default function RealizedPnL({ movements }: Props) {
  const sells = movements
    .filter(m => m.type === 'SELL' && m.buyPrice != null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sells.length === 0) return null;

  const rows = sells.map(m => {
    const pnl = (m.price - m.buyPrice!) * m.quantity;
    const pnlPct = ((m.price - m.buyPrice!) / m.buyPrice!) * 100;
    return { m, pnl, pnlPct };
  });

  const totalPnl = rows.reduce((s, r) => s + r.pnl, 0);
  const isTotal  = totalPnl >= 0;

  const fmtUsd = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
  const fmtPrice = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="card-static rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(26,37,64,0.08)' }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="section-label mb-0.5">Portefeuille</p>
            <h2 className="font-display font-bold text-lg text-navy">Résultats réalisés</h2>
            <p className="text-xs mt-0.5" style={{ color: '#8496B2' }}>
              Plus-values et moins-values sur positions cédées
            </p>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg"
            style={{
              background: isTotal ? 'rgba(10,142,98,0.10)' : 'rgba(201,48,72,0.10)',
              color: isTotal ? '#0A8E62' : '#C93048',
              border: `1px solid ${isTotal ? 'rgba(10,142,98,0.25)' : 'rgba(201,48,72,0.25)'}`,
            }}
          >
            {isTotal ? '▲' : '▼'} {isTotal ? '+' : ''}{fmtUsd(totalPnl)}
            <span className="text-sm font-normal opacity-70">P&amp;L total réalisé</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th className="text-left">Ticker</th>
              <th className="text-left">Nom</th>
              <th className="text-right hidden sm:table-cell">Date vente</th>
              <th className="text-right hidden sm:table-cell">Qté</th>
              <th className="text-right hidden sm:table-cell">PRU</th>
              <th className="text-right hidden sm:table-cell">Prix vente</th>
              <th className="text-right">P&amp;L $</th>
              <th className="text-right">P&amp;L %</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ m, pnl, pnlPct }) => {
              const isPos = pnl >= 0;
              return (
                <tr key={m.id}>
                  <td className="text-left">
                    <span className="font-mono text-sm font-semibold text-navy">{m.ticker}</span>
                  </td>
                  <td className="text-left">
                    <div>
                      <span className="text-sm text-navy">{m.name}</span>
                      {m.quantity < (movements.find(x => x.ticker === m.ticker && x.type === 'BUY')?.quantity ?? m.quantity) && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: 'rgba(212,175,55,0.12)', color: '#B8963A' }}>
                          partielle
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-right hidden sm:table-cell font-mono text-xs" style={{ color: '#8496B2' }}>
                    {fmtDate(m.date)}
                  </td>
                  <td className="text-right hidden sm:table-cell font-mono text-sm" style={{ color: '#8496B2' }}>
                    {m.quantity}
                  </td>
                  <td className="text-right hidden sm:table-cell font-mono text-sm" style={{ color: '#8496B2' }}>
                    {fmtPrice(m.buyPrice!)}
                  </td>
                  <td className="text-right hidden sm:table-cell font-mono text-sm font-semibold text-navy">
                    {fmtPrice(m.price)}
                  </td>
                  <td className="text-right font-mono text-sm">
                    <span className={`font-bold ${isPos ? 'text-gain' : 'text-loss'}`}>
                      {isPos ? '+' : ''}{fmtUsd(pnl)}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className={`badge ${isPos ? 'badge-gain' : 'badge-loss'}`}>
                      {isPos ? '▲' : '▼'} {Math.abs(pnlPct).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
