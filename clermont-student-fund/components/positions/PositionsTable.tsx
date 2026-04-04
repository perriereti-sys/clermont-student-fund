'use client';

import { EnrichedPosition } from '@/lib/types';

const TYPE_LABELS: Record<string, string> = {
  action: 'Action',
  etf: 'ETF',
  or: 'Or',
  crypto: 'Crypto',
};

const TYPE_STYLES: Record<string, string> = {
  action: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  etf: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  or: 'bg-gold/10 text-gold border-gold/20',
  crypto: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

interface Props {
  positions: EnrichedPosition[];
  cashEUR: number;
}

export default function PositionsTable({ positions, cashEUR }: Props) {
  const fmtUsd = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n);

  const fmtPrice = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(n);

  const totalValue = positions.reduce((s, p) => s + p.currentValueEUR, 0) + cashEUR;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      {/* Gold top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Positions ouvertes</h2>
        <span className="text-[11px] text-gray-500 bg-surface-2 border border-border px-2.5 py-1 rounded-full">
          {positions.length} lignes
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {['Actif', 'Type', 'Qté', 'Prix moy.', 'Prix actuel', 'Valeur', 'P&L', 'P&L %', 'Poids'].map((h) => (
                <th
                  key={h}
                  className="text-left text-[10px] text-gray-600 font-semibold px-4 py-3 uppercase tracking-widest whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {positions.map((pos, idx) => {
              const isPos = pos.pnlEUR >= 0;
              return (
                <tr
                  key={pos.id}
                  className="hover:bg-surface-2 transition-colors duration-150 group"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  {/* Asset name */}
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="font-medium text-white group-hover:text-gold/90 transition-colors row-ticker">
                        {pos.name}
                      </p>
                      <p className="text-gray-600 text-[11px] font-mono mt-0.5">{pos.ticker}</p>
                    </div>
                  </td>
                  {/* Type badge */}
                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${TYPE_STYLES[pos.type] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                      {TYPE_LABELS[pos.type] ?? pos.type}
                    </span>
                  </td>
                  {/* Quantity */}
                  <td className="px-4 py-3.5 text-gray-400 font-mono text-xs">
                    {pos.quantity % 1 === 0 ? pos.quantity : pos.quantity.toFixed(4)}
                  </td>
                  {/* Avg buy price */}
                  <td className="px-4 py-3.5 text-gray-500 font-mono text-xs">
                    {fmtPrice(pos.avgBuyPrice)}
                  </td>
                  {/* Current price */}
                  <td className="px-4 py-3.5 text-white font-mono font-medium text-xs">
                    {fmtPrice(pos.currentPrice)}
                  </td>
                  {/* Value */}
                  <td className="px-4 py-3.5 text-white font-semibold text-xs">
                    {fmtUsd(pos.currentValueEUR)}
                  </td>
                  {/* P&L */}
                  <td className={`px-4 py-3.5 font-semibold text-xs font-mono ${isPos ? 'text-gain' : 'text-loss'}`}>
                    {isPos ? '+' : ''}{fmtUsd(pos.pnlEUR)}
                  </td>
                  {/* P&L % */}
                  <td className={`px-4 py-3.5 font-semibold text-xs ${isPos ? 'text-gain' : 'text-loss'}`}>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] border ${
                      isPos ? 'bg-gain/10 border-gain/20' : 'bg-loss/10 border-loss/20'
                    }`}>
                      {isPos ? '+' : ''}{pos.pnlPercent.toFixed(1)}%
                    </span>
                  </td>
                  {/* Weight bar */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 min-w-[80px]">
                      <div className="flex-1 bg-surface-3 rounded-full h-1">
                        <div
                          className="bg-gold/60 h-1 rounded-full transition-all"
                          style={{ width: `${Math.min(pos.weight, 100)}%` }}
                        />
                      </div>
                      <span className="text-gray-500 text-[10px] font-mono w-8 text-right">
                        {pos.weight.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Cash row */}
            <tr className="bg-surface-2/40 border-t border-border">
              <td className="px-4 py-3.5">
                <div>
                  <p className="font-medium text-gray-400 text-sm">Liquidités</p>
                  <p className="text-gray-600 text-[11px] font-mono mt-0.5">Cash USD</p>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold border bg-gray-500/10 text-gray-500 border-gray-500/20">
                  Cash
                </span>
              </td>
              <td colSpan={3} />
              <td className="px-4 py-3.5 text-gray-300 font-semibold text-xs">
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
