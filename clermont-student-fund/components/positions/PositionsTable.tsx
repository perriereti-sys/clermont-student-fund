'use client';

import { EnrichedPosition } from '@/lib/types';

const TYPE_BADGE: Record<string, string> = {
  action: 'badge-blue',
  etf:    'badge-gain',
  or:     'badge-gold',
  crypto: 'badge-purple',
};
const TYPE_LABEL: Record<string, string> = {
  action: 'Action',
  etf:    'ETF',
  or:     'Or',
  crypto: 'Crypto',
};

interface Props { positions: EnrichedPosition[]; cashEUR: number }

export default function PositionsTable({ positions, cashEUR }: Props) {
  const fmtUsd   = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  const fmtPrice = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);

  return (
    <div className="card-static relative overflow-hidden rounded-2xl">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Header */}
      <div className="px-6 py-4 border-b border-navy-600 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-display font-semibold text-slate-100">Positions ouvertes</h2>
          <p className="text-xs mt-0.5" style={{ color: '#4A6080' }}>Prix en temps réel via Yahoo Finance</p>
        </div>
        <span className="badge badge-gray">{positions.length} lignes</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full data-table">
          <thead>
            <tr>
              {['Actif', 'Type', 'Quantité', 'Prix moy.', 'Prix actuel', 'Valeur ($)', 'P&L', 'P&L %', 'Poids'].map(h => (
                <th key={h} style={{ textAlign: h === 'Actif' ? 'left' : 'right' }}
                  className={h === 'Actif' ? 'text-left' : 'text-right'}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => {
              const isPos = pos.pnlEUR >= 0;
              return (
                <tr key={pos.id}>
                  {/* Actif */}
                  <td className="text-left">
                    <div>
                      <p className="font-medium text-slate-100 asset-name text-sm">{pos.name}</p>
                      <p className="font-mono text-2xs mt-0.5" style={{ color: '#4A6080' }}>{pos.ticker}</p>
                    </div>
                  </td>
                  {/* Type */}
                  <td className="text-right">
                    <span className={`badge ${TYPE_BADGE[pos.type] ?? 'badge-gray'}`}>
                      {TYPE_LABEL[pos.type] ?? pos.type}
                    </span>
                  </td>
                  {/* Quantité */}
                  <td className="text-right font-mono text-slate-400">
                    {pos.quantity % 1 === 0 ? pos.quantity : pos.quantity.toFixed(4)}
                  </td>
                  {/* Prix moy */}
                  <td className="text-right font-mono" style={{ color: '#4A6080' }}>
                    {fmtPrice(pos.avgBuyPrice)}
                  </td>
                  {/* Prix actuel */}
                  <td className="text-right font-mono font-semibold text-slate-100">
                    {fmtPrice(pos.currentPrice)}
                  </td>
                  {/* Valeur */}
                  <td className="text-right font-mono font-semibold text-slate-100">
                    {fmtUsd(pos.currentValueEUR)}
                  </td>
                  {/* P&L */}
                  <td className={`text-right font-mono font-semibold ${isPos ? 'text-gain' : 'text-loss'}`}>
                    {isPos ? '+' : ''}{fmtUsd(pos.pnlEUR)}
                  </td>
                  {/* P&L % */}
                  <td className="text-right">
                    <span className={`badge ${isPos ? 'badge-gain' : 'badge-loss'}`}>
                      {isPos ? '▲' : '▼'} {Math.abs(pos.pnlPercent).toFixed(1)}%
                    </span>
                  </td>
                  {/* Poids */}
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 rounded-full overflow-hidden h-1.5 bg-navy-600">
                        <div className="h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(pos.weight, 100)}%`, background: 'linear-gradient(90deg, #c9a840, #e8c84a)' }} />
                      </div>
                      <span className="font-mono text-xs w-10 text-right" style={{ color: '#6B8099' }}>
                        {pos.weight.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Cash row */}
            <tr style={{ background: 'rgba(26,53,80,0.2)' }}>
              <td className="text-left">
                <div>
                  <p className="font-medium text-sm" style={{ color: '#6B8099' }}>Liquidités</p>
                  <p className="font-mono text-2xs mt-0.5" style={{ color: '#4A6080' }}>Cash USD</p>
                </div>
              </td>
              <td className="text-right">
                <span className="badge badge-gray">Cash</span>
              </td>
              <td colSpan={3} />
              <td className="text-right font-mono font-semibold" style={{ color: '#6B8099' }}>
                {fmtUsd(cashEUR)}
              </td>
              <td colSpan={3} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
