'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { ChartPoint } from '@/lib/types';

interface Props { data: ChartPoint[] }

/* ── Custom Tooltip ─────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-static rounded-xl p-4 shadow-xl min-w-[180px]"
      style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
      <p className="section-label mb-3">
        {new Date(label).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
      </p>
      {payload.map((e: any) => (
        <div key={e.name} className="flex items-center justify-between gap-4 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: e.color }} />
            <span className="text-xs text-slate-400">{e.name}</span>
          </div>
          <span className="text-xs font-mono font-semibold" style={{ color: e.color }}>
            {e.value != null ? e.value.toFixed(1) : '—'}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ── Custom Legend ───────────────────────────────────────────────── */
const CustomLegend = ({ payload }: any) => (
  <div className="flex items-center justify-center gap-8 pt-2">
    {payload?.map((e: any) => (
      <div key={e.value} className="flex items-center gap-2">
        <span className="inline-block w-6 h-0.5 rounded-full"
          style={{ backgroundColor: e.color, opacity: e.dataKey !== 'portfolio' ? 0.7 : 1 }} />
        <span className="text-xs font-medium" style={{ color: '#6B8099' }}>{e.value}</span>
      </div>
    ))}
  </div>
);

export default function PerformanceChart({ data }: Props) {
  return (
    <div className="relative overflow-hidden card-static rounded-2xl animate-fade-up">
      {/* Gold accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 70%)' }} />

      <div className="relative px-6 pt-6 pb-2 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-display font-semibold text-slate-100">
            Performance relative
          </h2>
          <p className="text-xs mt-1" style={{ color: '#4A6080' }}>Base 100 — depuis le 01/01/2026</p>
        </div>
        <div className="badge badge-gold text-xs px-3">Hebdomadaire</div>
      </div>

      <div className="px-4 pb-6 pt-2">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#c9a840" />
                <stop offset="50%" stopColor="#e8c84a" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="2 4" stroke="rgba(26,53,80,0.6)" vertical={false} />
            <ReferenceLine y={100} stroke="rgba(212,175,55,0.2)" strokeDasharray="4 3" />

            <XAxis
              dataKey="date"
              tick={{ fill: '#4A6080', fontSize: 10, fontFamily: 'Inter' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => {
                const d = new Date(v);
                return `${d.getDate()}/${d.getMonth() + 1}`;
              }}
            />
            <YAxis
              tick={{ fill: '#4A6080', fontSize: 10, fontFamily: 'Inter' }}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
              tickFormatter={(v) => v.toFixed(0)}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(212,175,55,0.15)', strokeWidth: 1 }} />
            <Legend content={<CustomLegend />} />

            {/* CSF Portfolio — gold gradient */}
            <Line type="monotone" dataKey="portfolio" name="CSF Portfolio"
              stroke="url(#goldLine)" strokeWidth={2.5}
              dot={false} activeDot={{ r: 4, fill: '#D4AF37', stroke: '#0B1C2C', strokeWidth: 2 }}
            />
            {/* MSCI World */}
            <Line type="monotone" dataKey="msciWorld" name="MSCI World"
              stroke="#3B82F6" strokeWidth={1.5} strokeDasharray="5 3"
              dot={false} connectNulls activeDot={{ r: 3, fill: '#3B82F6', strokeWidth: 0 }}
            />
            {/* Nasdaq 100 */}
            <Line type="monotone" dataKey="nasdaq100" name="Nasdaq 100"
              stroke="#8B5CF6" strokeWidth={1.5} strokeDasharray="5 3"
              dot={false} connectNulls activeDot={{ r: 3, fill: '#8B5CF6', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
