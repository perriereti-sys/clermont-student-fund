'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import dynamic from 'next/dynamic';
import { EnrichedPosition } from '@/lib/types';

const MapChart = dynamic(() => import('./MapChart'), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center rounded-xl"
      style={{ height: 260, background: '#E8EDF5' }}
    >
      <div className="flex items-center gap-2 text-sm" style={{ color: '#8496B2' }}>
        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
        Chargement de la carte…
      </div>
    </div>
  ),
});

/* ── Zone config ─────────────────────────────────────────────────────────── */

const ZONES = [
  { id: 'europe',   label: 'Europe',    color: '#2563EB', bg: 'rgba(37,99,235,0.10)'  },
  { id: 'asia',     label: 'Asie',      color: '#0A8E62', bg: 'rgba(10,142,98,0.10)'  },
  { id: 'americas', label: 'Amériques', color: '#B8963A', bg: 'rgba(184,150,58,0.10)' },
  { id: 'global',   label: 'Global',    color: '#7C3AED', bg: 'rgba(124,58,237,0.10)' },
];

const TICKER_ZONE: Record<string, string> = {
  'SGO.PA': 'europe', 'EL.PA': 'europe', 'VIE.PA': 'europe', 'SAP.DE': 'europe', 'SAN.MC': 'europe', 'SAF.PA': 'europe',
  'PAASI.PA': 'asia', '0700.HK': 'asia',
  'IONQ': 'americas', 'ASTS': 'americas', 'KRKNF': 'americas', 'META': 'americas', 'CRWD': 'americas', 'MU': 'americas', 'AMD': 'americas',
  'GC=F': 'global', 'BTC-USD': 'global',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const isCash = payload[0].name === 'Cash';
  const zone = ZONES.find(z => z.label === payload[0].name);
  const color = isCash ? CASH_COLOR : (zone?.color ?? CASH_COLOR);
  return (
    <div className="rounded-xl border px-3 py-2 text-xs shadow-lg" style={{ background: '#fff', borderColor: 'rgba(26,37,64,0.1)' }}>
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="font-semibold" style={{ color: '#1A2540' }}>{payload[0].name}</span>
      </div>
      <span style={{ color: '#8496B2' }}>{payload[0].value.toFixed(1)}% du portefeuille</span>
    </div>
  );
};

interface Props {
  positions: EnrichedPosition[];
  cashUSD?: number;
  totalValue?: number;
}

const CASH_COLOR = '#8496B2';
const fmtUsd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function GeoSection({ positions, cashUSD = 0, totalValue = 1 }: Props) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  /* Compute zone weights (cash excluded — shown separately) */
  const weights: Record<string, number> = { europe: 0, asia: 0, americas: 0, global: 0 };
  const tickers: Record<string, string[]> = { europe: [], asia: [], americas: [], global: [] };
  for (const pos of positions) {
    const z = TICKER_ZONE[pos.ticker];
    if (z) { weights[z] += pos.weight; tickers[z].push(pos.ticker); }
  }

  const cashPct = totalValue > 0 ? (cashUSD / totalValue) * 100 : 0;

  const pieData = [
    ...ZONES.map(z => ({ name: z.label, value: parseFloat(weights[z.id].toFixed(1)), color: z.color })),
    { name: 'Cash', value: parseFloat(cashPct.toFixed(1)), color: CASH_COLOR },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

      {/* ── LEFT: donut + zone list (2 cols) ───────────── */}
      <div className="lg:col-span-2 card-static rounded-2xl p-5 flex flex-col gap-5">
        <div>
          <p className="text-sm font-semibold" style={{ color: '#1A2540' }}>Répartition géographique</p>
          <p className="text-xs mt-0.5" style={{ color: '#8496B2' }}>Par zone d'exposition</p>
        </div>

        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%" cy="50%"
                innerRadius="38%" outerRadius="65%"
                paddingAngle={3} dataKey="value" strokeWidth={0}
                onMouseEnter={(_, i) => setHoveredZone(ZONES[i].id)}
                onMouseLeave={() => setHoveredZone(null)}
                animationBegin={0} animationDuration={800}
              >
                {pieData.map((e, i) => {
                  const zoneId = i < ZONES.length ? ZONES[i].id : 'cash';
                  return (
                    <Cell
                      key={i} fill={e.color}
                      opacity={hoveredZone && hoveredZone !== zoneId ? 0.3 : 1}
                      style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                    />
                  );
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-1.5">
          {ZONES.map((zone) => {
            const w = weights[zone.id] ?? 0;
            const active = hoveredZone === zone.id;
            return (
              <div
                key={zone.id}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 cursor-default transition-all duration-150"
                style={{ background: active ? zone.bg : 'rgba(26,37,64,0.03)', border: `1px solid ${active ? zone.color + '30' : 'transparent'}` }}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
              >
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: zone.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: '#1A2540' }}>{zone.label}</span>
                    <span className="text-xs font-mono font-bold" style={{ color: zone.color }}>{w.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(26,37,64,0.08)' }}>
                    <div className="h-1 rounded-full transition-all duration-700" style={{ width: `${Math.min(w, 100)}%`, background: zone.color }} />
                  </div>
                  {tickers[zone.id]?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tickers[zone.id].map(t => (
                        <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: zone.color + '12', color: zone.color }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Cash — ligne séparée */}
          <div
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 cursor-default transition-all duration-150"
            style={{
              background: hoveredZone === 'cash' ? 'rgba(132,150,178,0.10)' : 'rgba(26,37,64,0.03)',
              border: `1px solid ${hoveredZone === 'cash' ? CASH_COLOR + '30' : 'transparent'}`,
            }}
            onMouseEnter={() => setHoveredZone('cash')}
            onMouseLeave={() => setHoveredZone(null)}
          >
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CASH_COLOR }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold" style={{ color: '#1A2540' }}>
                  Cash disponible
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono" style={{ color: '#8496B2' }}>{fmtUsd(cashUSD)}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: CASH_COLOR }}>{cashPct.toFixed(1)}%</span>
                </div>
              </div>
              <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(26,37,64,0.08)' }}>
                <div className="h-1 rounded-full transition-all duration-700" style={{ width: `${Math.min(cashPct, 100)}%`, background: CASH_COLOR }} />
              </div>
              <p className="text-[10px] mt-1" style={{ color: '#8496B2' }}>Non investi · disponible pour de nouvelles positions</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: real map (3 cols) ────────────────────── */}
      <div className="lg:col-span-3 card-static rounded-2xl p-5 flex flex-col gap-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: '#1A2540' }}>Carte d'exposition mondiale</p>
          <p className="text-xs mt-0.5" style={{ color: '#8496B2' }}>
            Survole un pays ou une ville ·{' '}
            <span style={{ color: '#B8963A', fontWeight: 600 }}>★ Clermont-Ferrand</span>
            {cashUSD > 0 && (
              <> · <span style={{ color: CASH_COLOR, fontWeight: 600 }}>Cash : {fmtUsd(cashUSD)}</span></>
            )}
          </p>
        </div>

        <MapChart hoveredZone={hoveredZone} onHoverZone={setHoveredZone} />

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mt-1">
          {ZONES.map(z => (
            <div
              key={z.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-default transition-all"
              style={{
                background: hoveredZone === z.id ? z.bg : 'rgba(26,37,64,0.04)',
                border: `1px solid ${hoveredZone === z.id ? z.color + '35' : 'rgba(26,37,64,0.08)'}`,
              }}
              onMouseEnter={() => setHoveredZone(z.id)}
              onMouseLeave={() => setHoveredZone(null)}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: z.color }} />
              <span className="text-xs font-medium" style={{ color: '#1A2540' }}>{z.label}</span>
              <span className="text-xs font-mono font-bold" style={{ color: z.color }}>{(weights[z.id] ?? 0).toFixed(0)}%</span>
            </div>
          ))}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-default transition-all"
            style={{
              background: hoveredZone === 'cash' ? 'rgba(132,150,178,0.10)' : 'rgba(26,37,64,0.04)',
              border: `1px solid ${hoveredZone === 'cash' ? CASH_COLOR + '35' : 'rgba(26,37,64,0.08)'}`,
            }}
            onMouseEnter={() => setHoveredZone('cash')}
            onMouseLeave={() => setHoveredZone(null)}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: CASH_COLOR }} />
            <span className="text-xs font-medium" style={{ color: '#1A2540' }}>Cash</span>
            <span className="text-xs font-mono font-bold" style={{ color: CASH_COLOR }}>{cashPct.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
