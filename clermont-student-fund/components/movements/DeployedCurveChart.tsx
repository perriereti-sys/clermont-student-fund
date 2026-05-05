'use client';

import { useMemo } from 'react';
import {
  ComposedChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import type { ChartPoint } from '@/lib/types';

interface Props {
  chartData:    ChartPoint[];
  cashUSD:      number;
  totalCost:    number;
  deployedBase: number;
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length || !label) return null;
  const pct = (payload[0]?.value ?? 100) - 100;
  return (
    <div
      className="rounded-xl border p-3 text-xs shadow-lg"
      style={{ background: '#fff', borderColor: 'rgba(26,37,64,0.1)' }}
    >
      <p className="font-semibold mb-1" style={{ color: '#1A2540' }}>
        {new Date(label).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' })}
      </p>
      <p className="font-mono font-bold" style={{ color: pct >= 0 ? '#0A8E62' : '#C93048' }}>
        {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
      </p>
    </div>
  );
}

export default function DeployedCurveChart({ chartData, cashUSD, totalCost, deployedBase }: Props) {
  const data = useMemo(() =>
    deployedBase > 0
      ? chartData
          .filter(pt => pt.portfolio != null)
          .map(pt => ({
            date:  pt.date,
            value: ((pt.portfolio! / 100 * totalCost - cashUSD) / deployedBase) * 100,
          }))
      : [],
    [chartData, cashUSD, totalCost, deployedBase]
  );

  if (!data.length) return null;

  const lastValue = data[data.length - 1]?.value ?? 100;
  const totalPct  = lastValue - 100;
  const perfColor = totalPct >= 0 ? '#0A8E62' : '#C93048';

  return (
    <div className="card-static rounded-2xl overflow-hidden">
      <div
        className="px-5 py-4 border-b flex items-start justify-between"
        style={{ borderColor: 'rgba(26,37,64,0.07)', background: '#FAFBFD' }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: '#1A2540' }}>Capital investi — sans liquidités</p>
          <p className="text-xs mt-0.5" style={{ color: '#8496B2' }}>
            Performance des positions uniquement · hors cash disponible
          </p>
        </div>
        <span className="text-sm font-mono font-bold" style={{ color: perfColor }}>
          {totalPct >= 0 ? '+' : ''}{totalPct.toFixed(2)}%
        </span>
      </div>

      <div className="px-2 py-5 bg-white">
        <ResponsiveContainer width="100%" height={240} className="sm:!h-[300px]">
          <ComposedChart data={data} margin={{ top: 12, right: 8, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="deployedCurveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#2563EB" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#2563EB" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="2 4" stroke="rgba(26,37,64,0.06)" vertical={false} />
            <ReferenceLine y={100} stroke="rgba(26,37,64,0.15)" strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tick={{ fill: '#8496B2', fontSize: 10 }}
              tickLine={false} axisLine={false}
              tickFormatter={(v) => {
                const d = new Date(v);
                return `${d.getDate()}/${d.getMonth() + 1}`;
              }}
            />
            <YAxis
              tick={{ fill: '#8496B2', fontSize: 10 }}
              tickLine={false} axisLine={false}
              domain={['auto', 'auto']}
              tickFormatter={(v) => `${v >= 100 ? '+' : ''}${(v - 100).toFixed(0)}%`}
              width={42}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: 'rgba(37,99,235,0.20)', strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="value"
              name="Capital investi"
              stroke="#2563EB"
              strokeWidth={2.5}
              fill="url(#deployedCurveGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#2563EB', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
