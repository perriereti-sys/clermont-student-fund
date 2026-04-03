'use client';

import { EnrichedPosition } from '@/lib/types';

const TYPE_LABELS: Record<string, string> = {
  action: 'Action',
  etf: 'ETF',
  or: 'Or',
  crypto: 'Crypto',
};

const TYPE_COLORS: Record<string, string> = {
  action: 'bg-blue-500/10 text-blue-400',
  etf: 'bg-green-500/10 text-green-400',
  or: 'bg-yellow-500/10 text-yellow-400',
  crypto: 'bg-purple-500/10 text-purple-400',
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

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <h2 className="text-lg font-semibold text-white">Positions ouvertes</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {[
                'Actif',
                'Type',
                'Secteur',
                'Qté',
                'Prix moy.',
                'Prix actuel',
                'Valeur ($)',
                'P&L',
                'P&L %',
                'Poids',
              ].map((h) => (
                <th
                  key={h}
                  className="text-left text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => (
              <tr
                key={pos.id}
                className="border-b border-border/50 hover:bg-surface-2 transition-colors"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-white text-sm">{pos.name}</p>
                    <p className="text-gray-500 text-xs">{pos.ticker}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      TYPE_COLORS[pos.type] ?? 'bg-gray-500/10 text-gray-400'
                    }`}
                  >
                    {TYPE_LABELS[pos.type] ?? pos.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-300 text-sm">{pos.sector}</td>
                <td className="px-4 py-3 text-gray-300 text-sm">
                  {pos.quantity % 1 === 0
                    ? pos.quantity
                    : pos.quantity.toFixed(4)}
                </td>
                <td className="px-4 py-3 text-gray-300 text-sm">
                  {fmtPrice(pos.avgBuyPrice)}
                </td>
                <td className="px-4 py-3 text-white font-medium text-sm">
                  {fmtPrice(pos.currentPrice)}
                </td>
                <td className="px-4 py-3 text-white font-medium text-sm">
                  {fmtUsd(pos.currentValueEUR)}
                </td>
                <td
                  className={`px-4 py-3 text-sm font-medium ${
                    pos.pnlEUR >= 0 ? 'text-gain' : 'text-loss'
                  }`}
                >
                  {pos.pnlEUR >= 0 ? '+' : ''}
                  {fmtUsd(pos.pnlEUR)}
                </td>
                <td
                  className={`px-4 py-3 text-sm font-medium ${
                    pos.pnlPercent >= 0 ? 'text-gain' : 'text-loss'
                  }`}
                >
                  {pos.pnlPercent >= 0 ? '+' : ''}
                  {pos.pnlPercent.toFixed(1)}%
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-surface-2 rounded-full h-1.5">
                      <div
                        className="bg-accent h-1.5 rounded-full"
                        style={{ width: `${Math.min(pos.weight, 100)}%` }}
                      />
                    </div>
                    <span className="text-gray-300 text-xs">
                      {pos.weight.toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}

            {/* Cash row */}
            <tr className="border-b border-border/50 bg-surface-2/30">
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-gray-300 text-sm">Liquidités</p>
                  <p className="text-gray-500 text-xs">Cash USD</p>
                </div>
              </td>
              <td colSpan={6} />
              <td className="px-4 py-3 text-white font-medium text-sm">
                {fmtUsd(cashEUR)}
              </td>
              <td colSpan={2} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
