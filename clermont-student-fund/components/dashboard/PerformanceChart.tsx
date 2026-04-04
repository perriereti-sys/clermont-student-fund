'use client';

import { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { ChartPoint } from '@/lib/types';

interface Props { data: ChartPoint[] }

type Period = '1D' | '1W' | '1M' | '1Y' | 'ALL';

const PERIODS: { key: Period; label: string; days: number | null }[] = [
  { key: '1D', label: '1J',    days: 1   },
  { key: '1W', label: '1S',    days: 7   },
  { key: '1M', label: '1M',    days: 30  },
  { key: '1Y', label: '1A',    days: 365 },
  { key: 'ALL', label: 'Début', days: null },
];

const GOLD = '#D4AF37';
const BLUE = '#3B82F6';
const MUTED = '#4A6080';

// ─── Tooltip ────────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border p-3 text-xs shadow-xl"
      style={{ background: '#0B1C2C', borderColor: '#1A3550' }}
    >
      <p className="section-label mb-2">
        {new Date(label).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' })}
      </p>
      {payload.map((e: any) => (
        <div key={e.name} className="flex items-center justify-between gap-5 mb-1">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: e.color }}
            />
            <span style={{ color: MUTED }}>{e.name}</span>
          </div>
          <span className="font-mono font-medium text-slate-200">
            {e.value != null ? `${e.value >= 100 ? '+' : ''}${(e.value - 100).toFixed(2)}%` : '—'}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Legend ─────────────────────────────────────────────────────────────────

const CustomLegend = ({ payload }: any) => (
  <div className="flex items-center justify-center gap-6 pt-2">
    {payload?.map((e: any) => (
      <div key={e.value} className="flex items-center gap-2">
        <span
          className="inline-block w-5 rounded-full"
          style={{
            height: e.value === 'CSF Portfolio' ? '2px' : '1.5px',
            backgroundColor: e.color,
          }}
        />
        <span className="text-xs" style={{ color: '#6B8099' }}>{e.value}</span>
      </div>
    ))}
  </div>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function cutoffDate(days: number | null): string | null {
  if (days === null) return null;
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function rebase(data: ChartPoint[]): ChartPoint[] {
  if (!data.length) return data;
  const pBase = data[0].portfolio;
  const mBase = data[0].msciWorld;
  const nBase = data[0].nasdaq100;
  return data.map((pt) => ({
    date: pt.date,
    portfolio: pBase   ? (pt.portfolio  / pBase)  * 100 : pt.portfolio,
    msciWorld: mBase && pt.msciWorld  != null ? (pt.msciWorld  / mBase)  * 100 : pt.msciWorld,
    nasdaq100: nBase && pt.nasdaq100  != null ? (pt.nasdaq100  / nBase)  * 100 : pt.nasdaq100,
  }));
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PerformanceChart({ data }: Props) {
  const [period, setPeriod] = useState<Period>('ALL');

  const displayed = useMemo(() => {
    const cfg = PERIODS.find((p) => p.key === period)!;
    const cutoff = cutoffDate(cfg.days);
    const filtered = cutoff ? data.filter((pt) => pt.date >= cutoff!) : data;
    return rebase(filtered);
  }, [data, period]);

  // Compute period performance for CSF
  const periodPerf = useMemo(() => {
    if (!displayed.length) return null;
    const last = displayed[displayed.length - 1].portfolio;
    return last - 100;
  }, [displayed]);

  const perfColor = periodPerf == null ? '#6B8099' : periodPerf >= 0 ? '#10B981' : '#EF4444';
  const perfSign  = periodPerf != null && periodPerf >= 0 ? '+' : '';

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: '#0F2235', borderColor: '#1A3550' }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: '#1A3550' }}
      >
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm font-medium text-slate-200">Performance relative</p>
            <p className="text-xs mt-0.5" style={{ color: '#4A6080' }}>
              Base 100 — depuis le 01/01/2026
            </p>
          </div>
          {periodPerf != null && (
            <span
              className="text-sm font-mono font-semibold"
              style={{ color: perfColor }}
            >
              {perfSign}{periodPerf.toFixed(2)}%
            </span>
          )}
        </div>

        {/* Period selector */}
        <div
          className="flex items-center gap-0.5 rounded-lg p-0.5"
          style={{ background: '#0B1C2C' }}
        >
          {PERIODS.map(({ key, label }) => {
            const active = period === key;
            return (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                className="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150"
                style={{
                  background:    active ? GOLD           : 'transparent',
                  color:         active ? '#0B1C2C'      : '#6B8099',
                  fontWeight:    active ? 700            : 500,
                  letterSpacing: '0.02em',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 py-5">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={displayed} margin={{ top: 4, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="rgba(26,53,80,0.7)"
              vertical={false}
            />
            <ReferenceLine y={100} stroke="rgba(107,128,153,0.25)" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#4A6080', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => {
                const d = new Date(v);
                return `${d.getDate()}/${d.getMonth() + 1}`;
              }}
            />
            <YAxis
              tick={{ fill: '#4A6080', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
              tickFormatter={(v) => `${v >= 100 ? '+' : ''}${(v - 100).toFixed(0)}%`}
              width={40}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'rgba(212,175,55,0.15)', strokeWidth: 1 }}
            />
            <Legend content={<CustomLegend />} />

            {/* CSF Portfolio — gold */}
            <Line
              type="monotone"
              dataKey="portfolio"
              name="CSF Portfolio"
              stroke={GOLD}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: GOLD, stroke: '#0B1C2C', strokeWidth: 2 }}
            />

            {/* MSCI World — blue */}
            <Line
              type="monotone"
              dataKey="msciWorld"
              name="MSCI World"
              stroke={BLUE}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
              connectNulls
            />

            {/* Nasdaq 100 — muted */}
            <Line
              type="monotone"
              dataKey="nasdaq100"
              name="Nasdaq 100"
              stroke={MUTED}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
