'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { ChartPoint } from '@/lib/types';

interface Props { data: ChartPoint[] }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-navy-600 p-3 text-xs shadow-xl"
      style={{ background: '#0B1C2C' }}>
      <p className="section-label mb-2">
        {new Date(label).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
      </p>
      {payload.map((e: any) => (
        <div key={e.name} className="flex items-center justify-between gap-5 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: e.color }} />
            <span className="text-slate-400">{e.name}</span>
          </div>
          <span className="font-mono font-medium text-slate-200">
            {e.value != null ? e.value.toFixed(1) : '—'}
          </span>
        </div>
      ))}
    </div>
  );
};

const CustomLegend = ({ payload }: any) => (
  <div className="flex items-center justify-center gap-6 pt-2">
    {payload?.map((e: any) => (
      <div key={e.value} className="flex items-center gap-2">
        <span className="inline-block w-5 h-px rounded-full" style={{ backgroundColor: e.color }} />
        <span className="text-xs" style={{ color: '#6B8099' }}>{e.value}</span>
      </div>
    ))}
  </div>
);

export default function PerformanceChart({ data }: Props) {
  return (
    <div className="rounded-xl border border-navy-600 overflow-hidden"
      style={{ background: '#0F2235' }}>

      <div className="px-6 py-4 border-b border-navy-600 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-200">Performance relative</p>
          <p className="text-xs mt-0.5" style={{ color: '#4A6080' }}>Base 100 — depuis le 01/01/2026</p>
        </div>
        <span className="badge badge-gray">Hebdomadaire</span>
      </div>

      <div className="px-4 py-5">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 4, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(26,53,80,0.7)" vertical={false} />
            <ReferenceLine y={100} stroke="rgba(107,128,153,0.3)" strokeDasharray="3 3" />
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
              tickFormatter={(v) => v.toFixed(0)}
              width={32}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(107,128,153,0.2)', strokeWidth: 1 }} />
            <Legend content={<CustomLegend />} />
            <Line type="monotone" dataKey="portfolio" name="CSF Portfolio"
              stroke="#E2E8F0" strokeWidth={2}
              dot={false} activeDot={{ r: 3, fill: '#E2E8F0', stroke: '#0B1C2C', strokeWidth: 2 }}
            />
            <Line type="monotone" dataKey="msciWorld" name="MSCI World"
              stroke="#3B82F6" strokeWidth={1.5} strokeDasharray="4 3"
              dot={false} connectNulls
            />
            <Line type="monotone" dataKey="nasdaq100" name="Nasdaq 100"
              stroke="#6B8099" strokeWidth={1.5} strokeDasharray="4 3"
              dot={false} connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
