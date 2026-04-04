'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { ChartPoint } from '@/lib/types';

interface Props {
  data: ChartPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-2 border border-border-light rounded-lg p-3 shadow-card-hover text-xs">
      <p className="text-gray-400 mb-2 font-medium">
        {new Date(label).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
      </p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center justify-between gap-6 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-400">{entry.name}</span>
          </div>
          <span className="font-semibold font-mono" style={{ color: entry.color }}>
            {entry.value != null ? entry.value.toFixed(1) : '—'}
          </span>
        </div>
      ))}
    </div>
  );
};

const CustomLegend = ({ payload }: any) => (
  <div className="flex items-center justify-center gap-6 mt-3 flex-wrap">
    {payload?.map((entry: any) => (
      <div key={entry.value} className="flex items-center gap-2">
        <span
          className="inline-block w-5 h-[2px] rounded-full"
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-xs text-gray-400">{entry.value}</span>
      </div>
    ))}
  </div>
);

export default function PerformanceChart({ data }: Props) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      {/* Gold top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="px-6 pt-5 pb-2 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Performance (base 100)</h2>
          <p className="text-xs text-gray-600 mt-0.5">Depuis le 01/01/2026</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-600 border border-border rounded-md px-2 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-gold/60" />
          Hebdomadaire
        </div>
      </div>

      <div className="px-2 pb-5">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 16, left: -8, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(28,43,66,0.8)"
              vertical={false}
            />
            <ReferenceLine y={100} stroke="rgba(201,168,76,0.15)" strokeDasharray="4 2" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#4b5563', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => {
                const d = new Date(v);
                return `${d.getDate()}/${d.getMonth() + 1}`;
              }}
            />
            <YAxis
              tick={{ fill: '#4b5563', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
              tickFormatter={(v) => v.toFixed(0)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            {/* CSF Portfolio — gold */}
            <Line
              type="monotone"
              dataKey="portfolio"
              name="CSF Portfolio"
              stroke="#c9a84c"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: '#c9a84c', strokeWidth: 0 }}
            />
            {/* MSCI World — blue */}
            <Line
              type="monotone"
              dataKey="msciWorld"
              name="MSCI World"
              stroke="#3b82f6"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              dot={false}
              connectNulls
              activeDot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
            />
            {/* Nasdaq 100 — purple */}
            <Line
              type="monotone"
              dataKey="nasdaq100"
              name="Nasdaq 100"
              stroke="#8b5cf6"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              dot={false}
              connectNulls
              activeDot={{ r: 3, fill: '#8b5cf6', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
