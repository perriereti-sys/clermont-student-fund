'use client';

import { useState } from 'react';
import { Movement } from '@/lib/types';

interface Props { movements: Movement[] }

const TYPE_CFG: Record<string, { label: string; badge: string }> = {
  BUY:      { label: 'Achat',    badge: 'badge-gain'  },
  SELL:     { label: 'Vente',    badge: 'badge-loss'  },
  DIVIDEND: { label: 'Dividende',badge: 'badge-blue'  },
};

export default function MovementsTable({ movements }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...movements].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const fmtAmount = (n: number, currency: string) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'EUR' ? 'EUR' : 'USD',
      maximumFractionDigits: 0,
    }).format(n);
  const fmtPrice = (n: number, currency: string) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'EUR' ? 'EUR' : 'USD',
      maximumFractionDigits: 2,
    }).format(n);
  const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="card-static relative overflow-hidden rounded-2xl">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Header */}
      <div className="px-6 py-4 border-b border-navy-600 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-display font-semibold text-slate-100">Historique des opérations</h2>
          <p className="text-xs mt-0.5" style={{ color: '#4A6080' }}>Cliquez sur une ligne pour voir la thèse d'investissement</p>
        </div>
        <span className="badge badge-gray">{movements.length} opérations</span>
      </div>

      {/* Table header */}
      <div className="hidden sm:grid grid-cols-[180px_100px_1fr_1fr_140px_32px] gap-4 px-6 py-2.5 border-b border-navy-600"
        style={{ background: 'rgba(9,15,26,0.4)' }}>
        {['Actif', 'Type', 'Date', 'Montant', 'Détail', ''].map(h => (
          <p key={h} className="section-label">{h}</p>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-navy-600">
        {sorted.map((mov) => {
          const cfg = TYPE_CFG[mov.type] ?? { label: mov.type, badge: 'badge-gray' };
          const isOpen = expandedId === mov.id;

          return (
            <div key={mov.id}>
              <button
                onClick={() => setExpandedId(isOpen ? null : mov.id)}
                className={`w-full text-left transition-colors duration-150 group ${isOpen ? 'bg-navy-700' : 'hover:bg-navy-700/60'}`}
              >
                <div className="px-6 py-4 grid sm:grid-cols-[180px_100px_1fr_1fr_140px_32px] items-center gap-4">
                  {/* Asset name */}
                  <div>
                    <p className="font-medium text-sm text-slate-100 group-hover:text-gold transition-colors duration-150 asset-name">
                      {mov.name}
                    </p>
                    <p className="font-mono text-2xs mt-0.5" style={{ color: '#4A6080' }}>{mov.ticker}</p>
                  </div>
                  {/* Type badge */}
                  <div>
                    <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
                  </div>
                  {/* Date */}
                  <p className="text-sm" style={{ color: '#6B8099' }}>{fmtDate(mov.date)}</p>
                  {/* Amount */}
                  <p className="font-mono font-semibold text-sm text-slate-100">{fmtAmount(mov.totalEUR, mov.currency)}</p>
                  {/* Price detail */}
                  <p className="font-mono text-xs hidden sm:block" style={{ color: '#4A6080' }}>
                    {mov.quantity % 1 === 0 ? mov.quantity : mov.quantity.toFixed(4)} × {fmtPrice(mov.price, mov.currency)}
                  </p>
                  {/* Expand icon */}
                  <span className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    style={{ color: '#4A6080' }}>
                    ▾
                  </span>
                </div>
              </button>

              {/* Thesis panel */}
              {isOpen && (
                <div className="px-6 pb-5 pt-1 border-t border-navy-600"
                  style={{ background: 'rgba(9,15,26,0.3)' }}>
                  <div className="rounded-xl p-4 border" style={{ background: '#0B1C2C', borderColor: 'rgba(212,175,55,0.15)' }}>
                    <p className="section-label mb-2.5" style={{ color: 'rgba(212,175,55,0.6)' }}>
                      Thèse d'investissement
                    </p>
                    <p className="text-sm leading-relaxed text-slate-300">
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
