'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine, LabelList,
} from 'recharts';
import { EnrichedPosition } from '@/lib/types';

interface Props {
  positions: EnrichedPosition[];
  realizedPnl?: number;
  soldCostBasis?: number;
}

const GAIN  = '#0A8E62';
const LOSS  = '#C93048';

const fmtUsd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d   = payload[0].payload;
  const pos = d.pnl >= 0;
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs shadow-lg"
      style={{ background: '#fff', border: '1px solid rgba(26,37,64,0.10)', minWidth: 160 }}
    >
      <p className="font-semibold mb-1" style={{ color: '#1A2540' }}>{d.name}</p>
      <div className="flex items-center justify-between gap-4">
        <span style={{ color: '#8496B2' }}>P&L %</span>
        <span className="font-mono font-bold" style={{ color: pos ? GAIN : LOSS }}>
          {pos ? '+' : ''}{d.pnl.toFixed(2)}%
        </span>
      </div>
      <div className="flex items-center justify-between gap-4 mt-0.5">
        <span style={{ color: '#8496B2' }}>P&L $</span>
        <span className="font-mono font-bold" style={{ color: pos ? GAIN : LOSS }}>
          {pos ? '+' : ''}{fmtUsd(d.pnlUsd)}
        </span>
      </div>
    </div>
  );
};

export default function DeployedPerformance({ positions, realizedPnl = 0, soldCostBasis = 0 }: Props) {
  // All fields (costBasisEUR / currentValueEUR / pnlEUR) are in USD — historical naming
  const deployedUSD = positions.reduce((s, p) => s + p.costBasisEUR, 0);
  const currentUSD  = positions.reduce((s, p) => s + p.currentValueEUR, 0);

  // Total since inception: open positions unrealized + all realized gains/losses
  // Denominator = current deployed capital (arbitrages rotate capital, base stays current)
  const unrealizedPnl = currentUSD - deployedUSD;
  const totalPnl      = unrealizedPnl + realizedPnl;
  const totalPnlPct   = deployedUSD > 0 ? (totalPnl / deployedUSD) * 100 : 0;
  const isUp          = totalPnl >= 0;

  const data = [...positions]
    .sort((a, b) => b.pnlPercent - a.pnlPercent)
    .map((p) => ({
      ticker:   p.ticker,
      name:     p.name,
      pnl:      parseFloat(p.pnlPercent.toFixed(2)),
      pnlUsd:   p.pnlEUR,
      category: p.category ?? 'socle',
    }));

  const chartHeight = data.length * 40 + 32;

  const STATS = [
    { label: 'Capital déployé',  value: fmtUsd(deployedUSD),    color: '#5C6E8A' },
    { label: 'Valeur déployée',  value: fmtUsd(currentUSD),     color: '#1A2540' },
    { label: 'P&L total',        value: `${isUp ? '+' : ''}${fmtUsd(totalPnl)}`,       color: isUp ? GAIN : LOSS },
    { label: 'Perf. déployée',   value: `${isUp ? '+' : ''}${totalPnlPct.toFixed(2)}%`, color: isUp ? GAIN : LOSS },
  ];

  return (
    <div className="card-static rounded-2xl p-5 flex flex-col gap-5">
      {/* Header */}
      <div>
        <p className="section-label mb-1">Rendement</p>
        <h2 className="font-display font-bold text-xl" style={{ color: '#1A2540' }}>
          Performance sur capital déployé
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#8496B2' }}>
          Sans liquidités · gains réalisés inclus depuis l'origine
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-xl px-4 py-3"
            style={{ background: 'rgba(26,37,64,0.04)', border: '1px solid rgba(26,37,64,0.07)' }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: '#8496B2' }}>
              {s.label}
            </p>
            <p className="font-mono font-bold text-base" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 2, right: 68, left: 8, bottom: 2 }}
            barSize={16}
          >
            <CartesianGrid horizontal={false} stroke="rgba(26,37,64,0.06)" />
            <XAxis
              type="number"
              tickFormatter={(v) => `${v > 0 ? '+' : ''}${v.toFixed(0)}%`}
              tick={{ fontSize: 10, fill: '#8496B2', fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <YAxis
              type="category"
              dataKey="ticker"
              width={80}
              tick={{ fontSize: 11, fill: '#1A2540', fontWeight: 600, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip cursor={{ fill: 'rgba(26,37,64,0.04)' }} content={<CustomTooltip />} />
            <ReferenceLine x={0} stroke="rgba(26,37,64,0.18)" strokeWidth={1} />
            <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.pnl >= 0 ? GAIN : LOSS} fillOpacity={0.80} />
              ))}
              <LabelList
                dataKey="pnl"
                position="right"
                formatter={(v: number) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`}
                style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, fill: '#5C6E8A' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
