'use client';

import { useState, useMemo } from 'react';
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { ChartPoint } from '@/lib/types';

interface Props { data: ChartPoint[] }

type Period = '1D' | '1W' | '1M' | '1Y' | 'ALL';

const PERIODS: { key: Period; label: string; days: number | null }[] = [
  { key: '1D',  label: '1J',    days: 1   },
  { key: '1W',  label: '1S',    days: 7   },
  { key: '1M',  label: '1M',    days: 30  },
  { key: '1Y',  label: '1A',    days: 365 },
  { key: 'ALL', label: 'Début', days: null },
];

const GOLD  = '#B8963A';
const BLUE  = '#3B82F6';
const TEAL  = '#0891B2';
const MUTED = '#8496B2';

interface TooltipPayloadItem { name: string; value: number | null; color: string }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border p-3 text-xs shadow-lg"
      style={{ background: '#FFFFFF', borderColor: 'rgba(26,37,64,0.1)' }}
    >
      <p className="section-label mb-2">
        {new Date(label).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' })}
      </p>
      {payload.map((e: TooltipPayloadItem) => (
        <div key={e.name} className="flex items-center justify-between gap-5 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: e.color }} />
            <span style={{ color: MUTED }}>{e.name}</span>
          </div>
          <span className="font-mono font-medium" style={{ color: '#1A2540' }}>
            {e.value != null ? `${e.value >= 100 ? '+' : ''}${(e.value - 100).toFixed(2)}%` : '—'}
          </span>
        </div>
      ))}
    </div>
  );
};

const CustomLegend = ({ payload }: any) => (
  <div className="flex items-center justify-center gap-6 pt-2">
    {payload?.map((e: any) => {
      const isPortfolio = e.value === 'CSF Portfolio';
      return (
        <div key={e.value} className="flex items-center gap-2">
          {isPortfolio ? (
            <span
              className="inline-block w-5 rounded-sm"
              style={{ height: '8px', background: `linear-gradient(180deg, ${GOLD}44 0%, ${GOLD}11 100%)`, borderTop: `2px solid ${GOLD}` }}
            />
          ) : (
            <span
              className="inline-block w-5 rounded-full"
              style={{ height: '1.5px', backgroundColor: e.color }}
            />
          )}
          <span className="text-xs" style={{ color: MUTED }}>{e.value}</span>
        </div>
      );
    })}
  </div>
);

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

export default function PerformanceChart({ data }: Props) {
  const [period, setPeriod] = useState<Period>('ALL');

  const displayed = useMemo(() => {
    const cfg = PERIODS.find((p) => p.key === period)!;
    const cutoff = cutoffDate(cfg.days);
    const filtered = cutoff ? data.filter((pt) => pt.date >= cutoff!) : data;
    return cfg.key === 'ALL' ? filtered : rebase(filtered);
  }, [data, period]);

  const periodPerf = useMemo(() => {
    if (!displayed.length) return null;
    return displayed[displayed.length - 1].portfolio - 100;
  }, [displayed]);

  const perfColor = periodPerf == null ? MUTED : periodPerf >= 0 ? '#0A8E62' : '#C93048';
  const perfSign  = periodPerf != null && periodPerf >= 0 ? '+' : '';

  return (
    <div className="card-static rounded-2xl overflow-hidden">
      {/* Header */}
      <div
        className="px-4 sm:px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between"
        style={{ borderColor: 'rgba(26,37,64,0.07)', background: '#FAFBFD' }}
      >
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm font-medium" style={{ color: '#1A2540' }}>Performance relative</p>
            <p className="text-xs mt-0.5" style={{ color: MUTED }}>
              Base 100 — depuis le 01/01/2026
            </p>
          </div>
          {periodPerf != null && (
            <span className="text-sm font-mono font-semibold" style={{ color: perfColor }}>
              {perfSign}{periodPerf.toFixed(2)}%
            </span>
          )}
        </div>

        {/* Period selector */}
        <div
          className="flex items-center gap-0.5 rounded-lg p-0.5 self-start sm:self-auto"
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
                  background:    active ? '#FFFFFF'   : 'transparent',
                  color:         active ? '#1A2540'   : MUTED,
                  fontWeight:    active ? 700         : 500,
                  letterSpacing: '0.02em',
                  boxShadow:     active ? '0 1px 3px rgba(26,37,64,0.1)' : 'none',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="px-2 sm:px-4 py-4 sm:py-5 bg-white">
        <ResponsiveContainer width="100%" height={220} className="sm:!h-[280px]">
          <ComposedChart data={displayed} margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="portfolioAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={GOLD} stopOpacity={0.18} />
                <stop offset="100%" stopColor={GOLD} stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="2 4"
              stroke="rgba(26,37,64,0.06)"
              vertical={false}
            />
            <ReferenceLine y={100} stroke="rgba(26,37,64,0.15)" strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tick={{ fill: MUTED, fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => {
                const d = new Date(v);
                return `${d.getDate()}/${d.getMonth() + 1}`;
              }}
            />
            <YAxis
              tick={{ fill: MUTED, fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
              tickFormatter={(v) => `${v >= 100 ? '+' : ''}${(v - 100).toFixed(0)}%`}
              width={40}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: `${GOLD}33`, strokeWidth: 1 }}
            />
            <Legend content={<CustomLegend />} />

            {/* Portfolio: area + line */}
            <Area
              type="monotone"
              dataKey="portfolio"
              name="CSF Portfolio"
              stroke={GOLD}
              strokeWidth={2.5}
              fill="url(#portfolioAreaGrad)"
              dot={false}
              activeDot={{ r: 4, fill: GOLD, stroke: '#FFFFFF', strokeWidth: 2 }}
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
              activeDot={{ r: 3, fill: BLUE, stroke: '#FFFFFF', strokeWidth: 1.5 }}
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
              activeDot={{ r: 3, fill: TEAL, stroke: '#FFFFFF', strokeWidth: 1.5 }}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
