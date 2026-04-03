'use client';

import { useState } from 'react';
import { Movement } from '@/lib/types';

interface Props {
  movements: Movement[];
}

export default function MovementsTable({ movements }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...movements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const fmtUsd = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n);

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Historique des mouvements
        </h2>
        <span className="text-gray-400 text-sm">{movements.length} opérations</span>
      </div>

      <div className="divide-y divide-border">
        {sorted.map((mov) => (
          <div key={mov.id}>
            <button
              className="w-full text-left hover:bg-surface-2 transition-colors"
              onClick={() =>
                setExpandedId(expandedId === mov.id ? null : mov.id)
              }
            >
              <div className="px-5 py-4 flex items-center gap-4">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full min-w-[40px] text-center ${
                    mov.type === 'BUY'
                      ? 'bg-gain/10 text-gain'
                      : mov.type === 'SELL'
                      ? 'bg-loss/10 text-loss'
                      : 'bg-blue-500/10 text-blue-400'
                  }`}
                >
                  {mov.type === 'BUY' ? 'ACH' : mov.type === 'SELL' ? 'VTE' : 'DIV'}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-white text-sm">{mov.name}</p>
                    <span className="text-gray-500 text-xs font-mono">
                      {mov.ticker}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">{fmtDate(mov.date)}</p>
                </div>

                <div className="text-right hidden sm:block">
                  <p className="text-white font-medium text-sm">
                    {fmtUsd(mov.totalEUR)}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {mov.quantity % 1 === 0
                      ? mov.quantity
                      : mov.quantity.toFixed(4)}{' '}
                    ×{' '}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 2,
                    }).format(mov.price)}
                  </p>
                </div>

                <span className="text-gray-500 text-xs ml-2">
                  {expandedId === mov.id ? '▲' : '▼'}
                </span>
              </div>
            </button>

            {expandedId === mov.id && (
              <div className="px-5 pb-4 ml-16">
                <div className="bg-surface-2 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">
                    Justification de l'opération
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {mov.justification}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
