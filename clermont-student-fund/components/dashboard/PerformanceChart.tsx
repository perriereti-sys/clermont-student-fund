'use client';

import { useState, useMemo } from 'react';
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { ChartPoint } from '@/lib/types';

interface Props { data: ChartPoint[] }

type Period = '1W' | '1M' | '3M' | '1Y' | 'ALL' | 'CUSTOM';

const PERIODS: { key: Period; label: string; days: number | null }[] = [
  { key: '1W',    label: '1S',    days: 7   },
  { key: '1M',    label: '1M',    days: 30  },
  { key: '3M',    label: '3M',    days: 90  },
  { key: '1Y',    label: '1A',    days: 365 },
  { key: 'ALL',   label: 'Tout',  days: null },
  { key: 'CUSTOM', label: 'Perso', days: null },
];

const GOLD  = '#B8963A';
const BLUE  = '#3B82F6';
const TEAL  = '#0891B2';
const MUTED = '#8496B2';
const GREEN = '#0A8E62';
const RED   = '#C93048';

/* ── Tooltip ─────────────────────────────────────────────────────────────── */

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const csf    = payload.find((e: any) => e.name === 'CSF Portfolio');
  const msci   = payload.find((e: any) => e.name === 'MSCI World');
  const nasdaq = payload.find((e: any) => e.name === 'Nasdaq 100');
  const delta  = csf?.value != null && msci?.value != null ? csf.value - msci.value : null;

  return (
    <div
      className="rounded-xl border p-3 text-xs shadow-xl min-w-[170px]"
      style={{ background: '#fff', borderColor: 'rgba(26,37,64,0.10)' }}
    >
      <p className="font-semibold mb-2.5" style={{ color: '#1A2540' }}>
        {new Date(label).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
      </p>

      {[csf, msci, nasdaq].filter(Boolean).map((e: any) => (
        <div key={e.name} className="flex items-center justify-between gap-6 mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
            <span style={{ color: MUTED }}>{e.name}</span>
          </div>
          {e.value != null ? (
            <span className="font-mono font-bold" style={{ color: e.value >= 100 ? GREEN : RED }}>
              {e.value >= 100 ? '+' : ''}{(e.value - 100).toFixed(2)}%
            </span>
          ) : <span style={{ color: MUTED }}>—</span>}
        </div>
      ))}

      {delta !== null && (
        <div
          className="mt-2 pt-2 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(26,37,64,0.07)' }}
        >
          <span style={{ color: MUTED }}>Alpha vs MSCI</span>
          <span
            className="font-mono font-bold"
            style={{ color: delta >= 0 ? GREEN : RED }}
          >
            {delta >= 0 ? '+' : ''}{delta.toFixed(2)} pp
          </span>
        </div>
      )}
    </div>
  );
};

/* ── Legend ──────────────────────────────────────────────────────────────── */

const CustomLegend = ({ payload }: any) => (
  <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
    {payload?.map((e: any) => {
      const isPortfolio = e.value === 'CSF Portfolio';
      return (
        <div key={e.value} className="flex items-center gap-2">
          {isPortfolio ? (
            <span
              className="inline-block w-5 rounded-sm"
              style={{ height: 8, background: `linear-gradient(180deg, ${GOLD}55 0%, ${GOLD}11 100%)`, borderTop: `2px solid ${GOLD}` }}
            />
          ) : (
            <span className="inline-block w-5 rounded-full" style={{ height: 2, backgroundColor: e.color }} />
          )}
          <span className="text-xs" style={{ color: MUTED }}>{e.value}</span>
        </div>
      );
    })}
  </div>
);

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function cutoffDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function rebase(pts: ChartPoint[]): ChartPoint[] {
  if (!pts.length) return pts;
  const pb = pts[0].portfolio;
  const mb = pts[0].msciWorld;
  const nb = pts[0].nasdaq100;
  return pts.map(pt => ({
    date:      pt.date,
    portfolio: pb   ? (pt.portfolio / pb) * 100 : pt.portfolio,
    msciWorld: mb && pt.msciWorld != null ? (pt.msciWorld / mb) * 100 : pt.msciWorld,
    nasdaq100: nb && pt.nasdaq100 != null ? (pt.nasdaq100 / nb) * 100 : pt.nasdaq100,
  }));
}

function xTickLabel(v: string, n: number): string {
  const d = new Date(v);
  if (n <= 14) return `${d.getDate()}/${d.getMonth() + 1}`;
  if (n <= 60) return `${d.getDate()} ${d.toLocaleDateString('fr-FR', { month: 'short' })}`;
  return d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
}

function fmtPerf(v: number | null): string {
  if (v === null) return '—';
  return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;
}

/* ── StatChip ────────────────────────────────────────────────────────────── */

const StatChip = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="flex items-center gap-1.5">
    <span className="text-[10px] uppercase tracking-wide" style={{ color: MUTED }}>{label}</span>
    <span className="text-xs font-mono font-bold" style={{ color }}>{value}</span>
  </div>
);

/* ── Component ───────────────────────────────────────────────────────────── */

export default function PerformanceChart({ data }: Props) {
  const [period, setPeriod] = useState<Period>('ALL');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo,   setCustomTo]   = useState('');

  const firstDate = data[0]?.date ?? '';
  const lastDate  = data[data.length - 1]?.date ?? '';

  const displayed = useMemo(() => {
    if (period === 'CUSTOM') {
      const from = customFrom || firstDate;
      const to   = customTo   || lastDate;
      return rebase(data.filter(pt => pt.date >= from && pt.date <= to));
    }
    const cfg = PERIODS.find(p => p.key === period)!;
    if (cfg.days === null) return data;
    return rebase(data.filter(pt => pt.date >= cutoffDate(cfg.days!)));
  }, [data, period, customFrom, customTo, firstDate, lastDate]);

  const lastPt   = displayed[displayed.length - 1];
  const portPerf = lastPt?.portfolio != null ? lastPt.portfolio - 100 : null;
  const msciPerf = lastPt?.msciWorld  != null ? lastPt.msciWorld  - 100 : null;
  const nsdqPerf = lastPt?.nasdaq100  != null ? lastPt.nasdaq100  - 100 : null;
  const alpha    = portPerf != null && msciPerf != null ? portPerf - msciPerf : null;

  const portMax = useMemo(() => {
    const vals = displayed.map(d => d.portfolio).filter((v): v is number => v != null);
    return vals.length ? Math.max(...vals) : 100;
  }, [displayed]);

  const portMin = useMemo(() => {
    const vals = displayed.map(d => d.portfolio).filter((v): v is number => v != null);
    return vals.length ? Math.min(...vals) : 100;
  }, [displayed]);

  const perfColor = portPerf == null ? MUTED : portPerf >= 0 ? GREEN : RED;
  const n = displayed.length;

  return (
    <div className="card-static rounded-2xl overflow-hidden">

      {/* ── Header ──────────────────────────────────────── */}
      <div
        className="px-4 sm:px-6 py-4 border-b flex flex-col gap-3"
        style={{ borderColor: 'rgba(26,37,64,0.07)', background: '#FAFBFD' }}
      >

        {/* Row 1 : title + badge + period picker */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1A2540' }}>Performance relative</p>
              <p className="text-xs mt-0.5" style={{ color: MUTED }}>
                Base 100 — depuis le{' '}
                {firstDate ? new Date(firstDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 jan. 2026'}
              </p>
            </div>
            {portPerf != null && (
              <span
                className="text-sm font-mono font-bold px-2.5 py-1 rounded-lg"
                style={{ color: perfColor, background: perfColor + '14' }}
              >
                {portPerf >= 0 ? '+' : ''}{portPerf.toFixed(2)}%
              </span>
            )}
          </div>

          {/* Period buttons */}
          <div
            className="flex items-center gap-0.5 rounded-lg p-0.5 self-start sm:self-auto flex-wrap"
            style={{ background: '#EEF0F7' }}
          >
            {PERIODS.map(({ key, label }) => {
              const active = period === key;
              return (
                <button
                  key={key}
                  onClick={() => setPeriod(key)}
                  className="px-3 py-2 text-xs font-medium rounded-md transition-all duration-150 min-w-[40px] min-h-[36px] active:scale-95"
                  style={{
                    background:    active ? '#FFFFFF' : 'transparent',
                    color:         active ? '#1A2540' : MUTED,
                    fontWeight:    active ? 700 : 500,
                    letterSpacing: '0.02em',
                    boxShadow:     active ? '0 1px 3px rgba(26,37,64,0.10)' : 'none',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2 : custom date range (visible only when CUSTOM) */}
        {period === 'CUSTOM' && (
          <div
            className="flex flex-wrap items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: 'rgba(184,150,58,0.06)', border: '1px solid rgba(184,150,58,0.20)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-xs font-medium" style={{ color: GOLD }}>Plage personnalisée</span>
            <span className="text-xs" style={{ color: MUTED }}>Du</span>
            <input
              type="date"
              value={customFrom || firstDate}
              min={firstDate}
              max={customTo || lastDate}
              onChange={e => setCustomFrom(e.target.value)}
              className="rounded-lg px-2 py-1 text-xs font-mono"
              style={{ border: '1px solid rgba(26,37,64,0.15)', color: '#1A2540', background: '#fff', outline: 'none', cursor: 'pointer' }}
            />
            <span className="text-xs" style={{ color: MUTED }}>au</span>
            <input
              type="date"
              value={customTo || lastDate}
              min={customFrom || firstDate}
              max={lastDate}
              onChange={e => setCustomTo(e.target.value)}
              className="rounded-lg px-2 py-1 text-xs font-mono"
              style={{ border: '1px solid rgba(26,37,64,0.15)', color: '#1A2540', background: '#fff', outline: 'none', cursor: 'pointer' }}
            />
            <span className="text-xs ml-1" style={{ color: MUTED }}>{n} jour{n > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Row 3 : benchmark comparison stats */}
        <div className="flex flex-wrap items-center gap-5">
          {([
            { label: 'CSF Portfolio', value: portPerf, color: GOLD },
            { label: 'MSCI World',    value: msciPerf, color: BLUE },
            { label: 'Nasdaq 100',    value: nsdqPerf, color: TEAL },
          ] as { label: string; value: number | null; color: string }[]).map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="text-xs" style={{ color: MUTED }}>{label}</span>
              <span
                className="text-xs font-mono font-semibold"
                style={{ color: value == null ? MUTED : value >= 0 ? GREEN : RED }}
              >
                {fmtPerf(value)}
              </span>
            </div>
          ))}
          {alpha !== null && (
            <div
              className="flex items-center gap-1.5 rounded-md px-2 py-0.5 ml-auto"
              style={{ background: (alpha >= 0 ? GREEN : RED) + '12' }}
            >
              <span className="text-xs" style={{ color: MUTED }}>Alpha</span>
              <span className="text-xs font-mono font-bold" style={{ color: alpha >= 0 ? GREEN : RED }}>
                {alpha >= 0 ? '+' : ''}{alpha.toFixed(2)} pp
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Chart ───────────────────────────────────────── */}
      <div className="px-4 sm:px-6 py-2 flex flex-wrap items-center gap-x-6 gap-y-1 bg-white" style={{ borderBottom: '1px solid rgba(26,37,64,0.05)' }}>
        <StatChip label="Haut période" value={portMax > 100 ? `+${(portMax - 100).toFixed(2)}%` : `${(portMax - 100).toFixed(2)}%`} color={GOLD} />
        <StatChip label="Bas période"  value={`${(portMin - 100).toFixed(2)}%`} color={portMin < 100 ? RED : GREEN} />
        <StatChip label="Points"       value={String(n)} color={MUTED} />
      </div>
      <div className="px-1 sm:px-4 py-4 sm:py-5 bg-white">
        <ResponsiveContainer width="100%" height={230} className="sm:!h-[300px]">
          <ComposedChart data={displayed} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={GOLD} stopOpacity={0.30} />
                <stop offset="55%"  stopColor={GOLD} stopOpacity={0.07} />
                <stop offset="100%" stopColor={GOLD} stopOpacity={0.00} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="2 5" stroke="rgba(26,37,64,0.055)" vertical={false} />

            {/* Baseline 0% */}
            <ReferenceLine y={100} stroke="rgba(26,37,64,0.20)" strokeDasharray="3 4" strokeWidth={1} />

            {/* High-water mark */}
            {portMax > 101 && (
              <ReferenceLine y={portMax} stroke={GOLD + '50'} strokeDasharray="2 4" strokeWidth={1} />
            )}

            {/* Portfolio low */}
            {portMin < 99 && (
              <ReferenceLine y={portMin} stroke={RED + '44'} strokeDasharray="2 4" strokeWidth={1} />
            )}

            <XAxis
              dataKey="date"
              tick={{ fill: MUTED, fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => xTickLabel(v, n)}
              minTickGap={40}
            />
            <YAxis
              tick={{ fill: MUTED, fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
              tickFormatter={v => `${v >= 100 ? '+' : ''}${(v - 100).toFixed(0)}%`}
              width={44}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: `${GOLD}55`, strokeWidth: 1.5, strokeDasharray: '4 3' }}
            />
            <Legend content={<CustomLegend />} />

            {/* CSF Portfolio — area + line */}
            <Area
              type="monotone"
              dataKey="portfolio"
              name="CSF Portfolio"
              stroke={GOLD}
              strokeWidth={2.5}
              fill="url(#portfolioFill)"
              dot={false}
              activeDot={{ r: 5, fill: GOLD, stroke: '#FFFFFF', strokeWidth: 2.5 }}
            />

            {/* MSCI World */}
            <Line
              type="monotone"
              dataKey="msciWorld"
              name="MSCI World"
              stroke={BLUE}
              strokeWidth={1.5}
              strokeDasharray="5 3"
              dot={false}
              activeDot={{ r: 4, fill: BLUE, stroke: '#FFFFFF', strokeWidth: 2 }}
              connectNulls
            />

            {/* Nasdaq 100 */}
            <Line
              type="monotone"
              dataKey="nasdaq100"
              name="Nasdaq 100"
              stroke={TEAL}
              strokeWidth={1.5}
              strokeDasharray="5 3"
              dot={false}
              activeDot={{ r: 4, fill: TEAL, stroke: '#FFFFFF', strokeWidth: 2 }}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
