'use client';

import { useState } from 'react';
import { Movement } from '@/lib/types';

interface Props {
  movements: Movement[];
}

const TYPE_CONFIG: Record<string, { label: string; style: string }> = {
  BUY:      { label: 'ACHAT',  style: 'bg-gain/10 text-gain border-gain/20' },
  SELL:     { label: 'VENTE',  style: 'bg-loss/10 text-loss border-loss/20' },
  DIVIDEND: { label: 'DIV',    style: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
};

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
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      {/* Gold top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Historique des opérations</h2>
          <p className="text-[11px] text-gray-600 mt-0.5">Cliquez sur une ligne pour voir la thèse</p>
        </div>
        <span className="text-[11px] text-gray-500 bg-surface-2 border border-border px-2.5 py-1 rounded-full">
          {movements.length} opérations
        </span>
      </div>

      <div className="divide-y divide-border/40">
        {sorted.map((mov) => {
          const cfg = TYPE_CONFIG[mov.type] ?? { label: mov.type, style: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
          const isExpanded = expandedId === mov.id;

          return (
            <div key={mov.id} className="group">
              <button
                className={`w-full text-left transition-colors duration-150 ${
                  isExpanded ? 'bg-surface-2' : 'hover:bg-surface-2/60'
                }`}
                onClick={() => setExpandedId(isExpanded ? null : mov.id)}
              >
                <div className="px-5 py-4 flex items-center gap-4">
                  {/* Type badge */}
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border min-w-[52px] text-center shrink-0 ${cfg.style}`}>
                    {cfg.label}
                  </span>

                  {/* Asset info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-white text-sm group-hover:text-gold/90 transition-colors">
                        {mov.name}
                      </p>
                      <span className="text-gray-600 text-[11px] font-mono">
                        {mov.ticker}
                      </span>
                    </div>
                    <p className="text-gray-600 text-[11px] mt-0.5">{fmtDate(mov.date)}</p>
                  </div>

                  {/* Amount */}
                  <div className="text-right hidden sm:block shrink-0">
                    <p className="text-white font-semibold text-sm">{fmtUsd(mov.totalEUR)}</p>
                    <p className="text-gray-600 text-[11px] font-mono mt-0.5">
                      {mov.quantity % 1 === 0 ? mov.quantity : mov.quantity.toFixed(4)}
                      {' × '}
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 2,
                      }).format(mov.price)}
                    </p>
                  </div>

                  {/* Expand indicator */}
                  <span className={`text-gray-600 text-xs ml-1 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                </div>
              </button>

              {/* Expanded thesis */}
              {isExpanded && (
                <div className="px-5 pb-4 ml-[68px]">
                  <div className="bg-surface-3 border border-border rounded-lg p-4">
                    <p className="text-[10px] text-gold/70 uppercase tracking-widest font-semibold mb-2">
                      Thèse d'investissement
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {mov.justification}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
