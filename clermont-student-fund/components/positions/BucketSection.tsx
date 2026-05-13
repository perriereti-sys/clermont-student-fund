'use client';

import { useState, useRef, useEffect } from 'react';
import { EnrichedPosition } from '@/lib/types';

export type BucketId = 'socle' | 'conviction' | 'opportunite';

export interface BucketConfig {
  id: BucketId;
  label: string;
  color: string;
  description: string;
  targetCount: number;
}

interface Props {
  bucket: BucketConfig;
  positions: EnrichedPosition[];
  eurUsd?: number;
}

const BUCKET_TARGETS: Record<BucketId, { ticker: string; name: string }[]> = {
  socle: [
    { ticker: 'PAASI.PA', name: 'Amundi PEA Asie Émergente' },
    { ticker: 'GC=F',     name: 'Or (Gold)' },
    { ticker: 'SGO.PA',   name: 'Saint-Gobain' },
    { ticker: 'EL.PA',    name: 'EssilorLuxottica' },
    { ticker: 'VIE.PA',   name: 'Veolia Environnement' },
    { ticker: 'SAP.DE',   name: 'SAP' },
    { ticker: 'SAN.MC',   name: 'Banco Santander' },
    { ticker: '0700.HK',  name: 'Tencent Holdings' },
    { ticker: 'SAF.PA',   name: 'Safran' },
  ],
  conviction: [
    { ticker: 'ASTS', name: 'AST SpaceMobile' },
    { ticker: 'IONQ', name: 'IonQ' },
  ],
  opportunite: [
    { ticker: 'KRKNF',   name: 'Kraken Robotics' },
    { ticker: 'BTC-USD', name: 'Bitcoin' },
    { ticker: 'META',    name: 'Meta Platforms' },
  ],
};

export default function BucketSection({ bucket, positions, eurUsd = 1.09 }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (collapsed) { setShowHint(false); return; }
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setShowHint(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    check();
    el.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    return () => {
      el.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [collapsed]);

  const fmtUsd = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  const fmtEur = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  const fmtPrice = (n: number, cur: string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: cur, maximumFractionDigits: 2 }).format(n);

  const targets = BUCKET_TARGETS[bucket.id];
  const positionTickers = new Set(positions.map(p => p.ticker));
  const emptySlots = targets.filter(t => !positionTickers.has(t.ticker));

  const bucketPnlUSD  = positions.reduce((s, p) => s + p.pnlEUR, 0);
  const bucketCostUSD = positions.reduce((s, p) => s + p.costBasisEUR, 0);
  const bucketPnlPct  = bucketCostUSD > 0 ? (bucketPnlUSD / bucketCostUSD) * 100 : 0;
  const isPnlPos      = bucketPnlUSD >= 0;

  return (
    <div
      id={`bucket-${bucket.id}`}
      className="card-static relative overflow-hidden rounded-2xl"
      style={{ borderLeft: `4px solid ${bucket.color}` }}
    >
      {/* Top shimmer line */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${bucket.color}40, transparent)` }}
      />

      {/* Section header */}
      <div
        className="px-6 py-4 flex items-start justify-between gap-4"
        style={{ borderBottom: collapsed ? 'none' : '1px solid rgba(26,37,64,0.08)' }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2.5 mb-2">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide shrink-0"
              style={{
                background: `${bucket.color}22`,
                color: bucket.color,
                border: `1px solid ${bucket.color}44`,
              }}
            >
              {bucket.label}
            </span>
            <span className="text-xs font-mono" style={{ color: '#8496B2' }}>
              {positions.length} / {targets.length} positions ouvertes
            </span>
            {positions.length > 0 && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold shrink-0"
                style={{
                  background: isPnlPos ? 'rgba(10,142,98,0.10)' : 'rgba(201,48,72,0.10)',
                  color: isPnlPos ? '#0A8E62' : '#C93048',
                  border: `1px solid ${isPnlPos ? 'rgba(10,142,98,0.25)' : 'rgba(201,48,72,0.25)'}`,
                }}
              >
                {isPnlPos ? '▲' : '▼'} {isPnlPos ? '+' : ''}{fmtUsd(bucketPnlUSD)}
                <span className="opacity-70">({isPnlPos ? '+' : ''}{bucketPnlPct.toFixed(1)}%)</span>
              </span>
            )}
          </div>
          <p className="text-sm italic leading-relaxed" style={{ color: '#5C6E8A' }}>
            {bucket.description}
          </p>
        </div>

        <button
          onClick={() => setCollapsed(c => !c)}
          aria-expanded={!collapsed}
          className="shrink-0 text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
          style={{
            color: '#8496B2',
            background: 'rgba(26,37,64,0.05)',
            border: '1px solid rgba(26,37,64,0.1)',
          }}
        >
          {collapsed ? '▼ Agrandir' : '▲ Réduire'}
        </button>
      </div>

      {/* Table */}
      {!collapsed && (
        <div className="relative">
          <div ref={scrollRef} className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Ticker</th>
                <th className="text-left">Nom</th>
                <th className="text-right">Qté</th>
                <th className="text-right hidden sm:table-cell">Prix achat</th>
                <th className="text-right">Prix actuel</th>
                <th className="text-right">P&amp;L €</th>
                <th className="text-right">P&amp;L %</th>
                <th className="text-right hidden sm:table-cell">Poids %</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((pos) => {
                const isPos = pos.pnlEUR >= 0;
                return (
                  <tr key={pos.id}>
                    {/* Ticker */}
                    <td className="text-left">
                      <span className="font-mono text-sm font-semibold text-navy">{pos.ticker}</span>
                    </td>
                    {/* Nom */}
                    <td className="text-left">
                      <span className="text-sm text-navy">{pos.name}</span>
                    </td>
                    {/* Qté */}
                    <td className="text-right font-mono text-sm text-navy-400">
                      {pos.quantity % 1 === 0 ? pos.quantity : pos.quantity.toFixed(4)}
                    </td>
                    {/* Prix achat */}
                    <td className="text-right font-mono text-sm hidden sm:table-cell" style={{ color: '#8496B2' }}>
                      {fmtPrice(pos.avgBuyPrice, pos.currency)}
                    </td>
                    {/* Prix actuel */}
                    <td className="text-right font-mono text-sm font-semibold text-navy">
                      {fmtPrice(pos.currentPrice, pos.currency)}
                    </td>
                    {/* P&L € */}
                    <td className="text-right font-mono text-sm">
                      <span className={`font-bold ${isPos ? 'text-gain' : 'text-loss'}`}>
                        {isPos ? '+' : ''}{fmtEur(pos.pnlEUR / eurUsd)}
                      </span>
                      <br />
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: isPos ? 'rgba(10,142,98,0.55)' : 'rgba(201,48,72,0.55)' }}
                      >
                        {isPos ? '+' : ''}{fmtUsd(pos.pnlEUR)}
                      </span>
                    </td>
                    {/* P&L % */}
                    <td className="text-right">
                      <span className={`badge ${isPos ? 'badge-gain' : 'badge-loss'}`}>
                        {isPos ? '▲' : '▼'} {Math.abs(pos.pnlPercent).toFixed(1)}%
                      </span>
                    </td>
                    {/* Poids % */}
                    <td className="text-right font-mono text-sm hidden sm:table-cell" style={{ color: '#5C6E8A' }}>
                      {pos.weight.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}

              {/* Empty "À ouvrir" slots */}
              {emptySlots.map((slot) => (
                <tr key={`empty-${slot.ticker}`} style={{ opacity: 0.38 }}>
                  <td className="text-left">
                    <span className="font-mono text-sm" style={{ color: '#8496B2' }}>{slot.ticker}</span>
                  </td>
                  <td className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: '#8496B2' }}>{slot.name}</span>
                      <span className="badge badge-gray">Cible</span>
                    </div>
                  </td>
                  <td colSpan={6} className="text-center text-xs italic" style={{ color: '#8496B2' }}>
                    — À ouvrir —
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* Scroll hint — fade gradient + arrow, visible when content overflows */}
          {showHint && (
            <div
              className="absolute top-0 right-0 bottom-0 w-14 pointer-events-none flex items-center justify-end pr-2 sm:hidden"
              style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.97) 60%)' }}
            >
              <div className="flex flex-col items-center gap-0.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8496B2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="text-[9px] font-semibold tracking-wide" style={{ color: '#8496B2', writingMode: 'vertical-rl', transform: 'rotate(180deg)', lineHeight: 1 }}>
                  glisser
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
