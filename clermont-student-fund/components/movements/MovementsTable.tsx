'use client';

import { useState } from 'react';
import { Movement } from '@/lib/types';

interface Props { movements: Movement[] }

const TYPE_CFG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  BUY:      { label: 'Achat',     color: '#0A8E62', bg: 'rgba(10,142,98,0.08)',   border: 'rgba(10,142,98,0.2)'   },
  SELL:     { label: 'Vente',     color: '#C93048', bg: 'rgba(201,48,72,0.08)',   border: 'rgba(201,48,72,0.2)'   },
  DIVIDEND: { label: 'Dividende', color: '#2563EB', bg: 'rgba(37,99,235,0.08)',   border: 'rgba(37,99,235,0.2)'   },
};

const fmtDate  = (s: string) => new Date(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtTotal = (n: number, _cur?: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtPrice = (n: number, _cur?: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const fmtQty   = (n: number) => n % 1 === 0 ? n.toString() : n.toFixed(4);

export default function MovementsTable({ movements }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...movements].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="card-static relative overflow-hidden rounded-2xl">

      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(26,37,64,0.08)', background: '#FAFBFD' }}
      >
        <div>
          <h2 className="text-sm font-display font-semibold" style={{ color: '#1A2540' }}>Historique des opérations</h2>
          <p className="text-xs mt-0.5" style={{ color: '#8496B2' }}>Cliquez sur une ligne pour la thèse d'investissement</p>
        </div>
        <span className="badge badge-gray">{movements.length} opérations</span>
      </div>

      {/* Column headers — desktop only */}
      <div
        className="hidden sm:flex items-center px-6 py-2.5 gap-4"
        style={{ background: '#F7F8FC', borderBottom: '1px solid rgba(26,37,64,0.06)' }}
      >
        <p className="section-label flex-1 min-w-0">Actif</p>
        <p className="section-label w-20 text-center">Type</p>
        <p className="section-label w-32 text-right">Date</p>
        <p className="section-label w-40 text-right">Détail</p>
        <p className="section-label w-28 text-right">Montant</p>
        <div className="w-5" />
      </div>

      {/* Rows */}
      <div className="divide-y" style={{ borderColor: 'rgba(26,37,64,0.05)' }}>
        {sorted.map((mov) => {
          const cfg    = TYPE_CFG[mov.type] ?? { label: mov.type, color: '#8496B2', bg: 'rgba(26,37,64,0.05)', border: 'rgba(26,37,64,0.1)' };
          const isOpen = expandedId === mov.id;

          return (
            <div key={mov.id}>
              <button
                onClick={() => setExpandedId(isOpen ? null : mov.id)}
                aria-expanded={isOpen}
                className="w-full text-left transition-colors duration-150"
                style={{ background: isOpen ? 'rgba(184,150,58,0.04)' : undefined }}
              >
                {/* ── Desktop row ── */}
                <div
                  className="hidden sm:flex items-center px-6 py-4 gap-4 group transition-colors"
                  style={{ background: isOpen ? 'rgba(184,150,58,0.03)' : undefined }}
                  onMouseEnter={(e) => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = 'rgba(26,37,64,0.025)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = isOpen ? 'rgba(184,150,58,0.03)' : ''; }}
                >
                  {/* Asset */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                    >
                      {mov.type === 'BUY' ? '↑' : mov.type === 'SELL' ? '↓' : '$'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate transition-colors" style={{ color: '#1A2540' }}>{mov.name}</p>
                      <p className="font-mono text-[11px] mt-0.5" style={{ color: '#8496B2' }}>{mov.ticker}</p>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="w-20 flex justify-center">
                    <span
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                    >
                      {cfg.label}
                    </span>
                  </div>

                  {/* Date */}
                  <p className="w-32 text-right text-sm tabular-nums" style={{ color: '#8496B2' }}>{fmtDate(mov.date)}</p>

                  {/* Qty × Price */}
                  <p className="w-40 text-right font-mono text-xs tabular-nums" style={{ color: '#8496B2' }}>
                    {fmtQty(mov.quantity)} × {fmtPrice(mov.price, mov.currency)}
                  </p>

                  {/* Total */}
                  <p className="w-28 text-right font-mono font-bold text-base tabular-nums" style={{ color: '#1A2540' }}>
                    {fmtTotal(mov.totalEUR, mov.currency)}
                  </p>

                  {/* Chevron */}
                  <div
                    className="w-5 flex items-center justify-center transition-transform duration-200"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: '#8496B2' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {/* ── Mobile card ── */}
                <div className="sm:hidden px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                      >
                        {mov.type === 'BUY' ? '↑' : mov.type === 'SELL' ? '↓' : '$'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: '#1A2540' }}>{mov.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="font-mono text-[11px]" style={{ color: '#8496B2' }}>{mov.ticker}</p>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-mono font-bold text-base tabular-nums" style={{ color: '#1A2540' }}>{fmtTotal(mov.totalEUR, mov.currency)}</p>
                      <p className="text-[11px] mt-0.5 tabular-nums" style={{ color: '#8496B2' }}>{fmtDate(mov.date)}</p>
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-between mt-2 pt-2"
                    style={{ borderTop: '1px solid rgba(26,37,64,0.07)' }}
                  >
                    <p className="font-mono text-xs tabular-nums" style={{ color: '#8496B2' }}>
                      {fmtQty(mov.quantity)} × {fmtPrice(mov.price, mov.currency)}
                    </p>
                    <div
                      className="transition-transform duration-200"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: '#8496B2' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded thesis */}
              {isOpen && (
                <div
                  className="px-4 sm:px-6 pb-5 pt-1"
                  style={{ background: '#F7F8FC', borderTop: '1px solid rgba(26,37,64,0.06)' }}
                >
                  <div
                    className="rounded-xl p-5 mt-2"
                    style={{ background: '#FFFFFF', border: `1px solid ${cfg.border}` }}
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                      >
                        {cfg.label} · {fmtDate(mov.date)}
                      </span>
                      <span
                        className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(184,150,58,0.08)', color: '#B8963A', border: '1px solid rgba(184,150,58,0.2)' }}
                      >
                        {fmtQty(mov.quantity)} × {fmtPrice(mov.price, mov.currency)} = {fmtTotal(mov.totalEUR, mov.currency)}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold tracking-widest uppercase mb-2" style={{ color: '#B8963A' }}>
                      Thèse d'investissement
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: '#5C6E8A' }}>
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
