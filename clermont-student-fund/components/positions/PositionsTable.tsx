'use client';

import { useState } from 'react';
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
const TYPE_COLOR: Record<string, string> = {
  action: '#3b82f6',
  etf:    '#22c55e',
  or:     '#D4AF37',
  crypto: '#8b5cf6',
};

interface Props { positions: EnrichedPosition[]; cashEUR: number }

export default function PositionsTable({ positions, cashEUR }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const fmtUsd   = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  const fmtPrice = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
  const fmtDate  = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  const toggle = (id: string) => setExpanded(prev => prev === id ? null : id);

  return (
    <div className="card-static relative overflow-hidden rounded-2xl">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Header */}
      <div className="px-6 py-4 border-b border-navy-600 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-display font-semibold text-slate-100">Positions ouvertes</h2>
          <p className="text-xs mt-0.5" style={{ color: '#4A6080' }}>Cliquez sur une ligne pour les détails · Prix en temps réel</p>
        </div>
        <span className="badge badge-gray">{positions.length} lignes</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full data-table">
          <thead>
            <tr>
              {['Actif', 'Type', 'Quantité', 'Prix moy.', 'Prix actuel', 'Valeur', 'P&L', 'P&L %', 'Poids'].map(h => (
                <th key={h} className={h === 'Actif' ? 'text-left' : 'text-right'}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => {
              const isPos     = pos.pnlEUR >= 0;
              const isOpen    = expanded === pos.id;
              const typeColor = TYPE_COLOR[pos.type] ?? '#64748b';

              return (
                <>
                  {/* Main row */}
                  <tr
                    key={pos.id}
                    onClick={() => toggle(pos.id)}
                    className="cursor-pointer select-none"
                    style={{ background: isOpen ? 'rgba(212,175,55,0.04)' : undefined }}
                  >
                    {/* Actif */}
                    <td className="text-left">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex-shrink-0 w-1 self-stretch rounded-full"
                          style={{ background: typeColor, minHeight: 32 }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-100 asset-name text-sm">{pos.name}</p>
                            {pos.lastBuyDate && (
                              <span className="badge badge-blue shrink-0">
                                {pos.buyDate === pos.lastBuyDate ? 'NOUVEAU' : 'RENFORCÉ'}
                              </span>
                            )}
                          </div>
                          <p className="font-mono text-[11px] mt-0.5" style={{ color: '#4A6080' }}>{pos.ticker}</p>
                        </div>
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
                        <div className="w-14 rounded-full overflow-hidden h-1.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <div
                            className="h-1.5 rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(pos.weight, 100)}%`, background: `linear-gradient(90deg, ${typeColor}99, ${typeColor})` }}
                          />
                        </div>
                        <span className="font-mono text-xs w-10 text-right" style={{ color: '#6B8099' }}>
                          {pos.weight.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded detail row */}
                  {isOpen && (
                    <tr key={`${pos.id}-detail`} style={{ background: 'rgba(10,15,30,0.6)' }}>
                      <td colSpan={9} className="p-0">
                        <div
                          className="mx-4 my-3 rounded-xl overflow-hidden"
                          style={{ border: `1px solid ${typeColor}30` }}
                        >
                          {/* Top color bar */}
                          <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${typeColor}, transparent)` }} />

                          <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                              <p className="section-label mb-1">Secteur</p>
                              <p className="text-sm font-medium text-slate-200">{pos.sector}</p>
                            </div>
                            <div>
                              <p className="section-label mb-1">Date d'achat</p>
                              <p className="text-sm font-medium text-slate-200">{fmtDate(pos.buyDate)}</p>
                              {pos.lastBuyDate && pos.lastBuyDate !== pos.buyDate && (
                                <p className="text-xs mt-0.5" style={{ color: '#4A6080' }}>Renforcé le {fmtDate(pos.lastBuyDate)}</p>
                              )}
                            </div>
                            <div>
                              <p className="section-label mb-1">Coût total</p>
                              <p className="text-sm font-mono font-semibold text-slate-200">
                                {fmtUsd(pos.quantity * pos.avgBuyPrice)}
                              </p>
                            </div>
                            <div>
                              <p className="section-label mb-1">Valeur actuelle</p>
                              <p className="text-sm font-mono font-semibold text-slate-200">
                                {fmtUsd(pos.currentValueEUR)}
                              </p>
                            </div>
                          </div>

                          {/* Weight bar full */}
                          <div className="px-5 pb-4">
                            <div className="flex items-center justify-between mb-1.5">
                              <p className="section-label">Poids dans le portefeuille</p>
                              <p className="text-xs font-mono font-semibold" style={{ color: typeColor }}>{pos.weight.toFixed(2)}%</p>
                            </div>
                            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                              <div
                                className="h-2 rounded-full transition-all duration-700"
                                style={{ width: `${Math.min(pos.weight, 100)}%`, background: `linear-gradient(90deg, ${typeColor}80, ${typeColor})` }}
                              />
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-[10px]" style={{ color: '#2d4a6a' }}>0%</span>
                              <span className="text-[10px]" style={{ color: '#2d4a6a' }}>Limite 15%</span>
                              <span className="text-[10px]" style={{ color: '#2d4a6a' }}>100%</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}

            {/* Cash row */}
            <tr style={{ background: 'rgba(26,53,80,0.15)' }}>
              <td className="text-left">
                <div className="flex items-center gap-2.5">
                  <div className="flex-shrink-0 w-1 self-stretch rounded-full" style={{ background: '#64748b', minHeight: 32 }} />
                  <div>
                    <p className="font-medium text-sm" style={{ color: '#6B8099' }}>Liquidités</p>
                    <p className="font-mono text-[11px] mt-0.5" style={{ color: '#4A6080' }}>Cash USD</p>
                  </div>
                </div>
              </td>
              <td className="text-right"><span className="badge badge-gray">Cash</span></td>
              <td colSpan={3} />
              <td className="text-right font-mono font-semibold" style={{ color: '#6B8099' }}>{fmtUsd(cashEUR)}</td>
              <td colSpan={3} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
