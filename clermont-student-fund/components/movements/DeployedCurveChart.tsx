'use client';

import { useMemo } from 'react';
import {
  ComposedChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import type { ChartPoint, Movement } from '@/lib/types';

interface Props {
  chartData:    ChartPoint[];
  movements:    Movement[];
  cashUSD:      number;
  totalCost:    number;
  deployedBase: number;
}

interface TooltipProps {
  active?:    boolean;
  payload?:   any[];
  label?:     string;
  movByDate:  Record<string, Movement[]>;
}

function ChartTooltip({ active, payload, label, movByDate }: TooltipProps) {
  if (!active || !payload?.length || !label) return null;
  const movs = movByDate[label] ?? [];
  const pct  = (payload[0]?.value ?? 100) - 100;
  return (
    <div
      className="rounded-xl border p-3 text-xs shadow-lg"
      style={{ background: '#fff', borderColor: 'rgba(26,37,64,0.1)', maxWidth: 230 }}
    >
      <p className="font-semibold mb-1" style={{ color: '#1A2540' }}>
        {new Date(label).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' })}
      </p>
      <p className="font-mono font-bold mb-2" style={{ color: pct >= 0 ? '#0A8E62' : '#C93048' }}>
        {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
      </p>
      {movs.length > 0 && (
        <div className="border-t pt-2 flex flex-col gap-1.5" style={{ borderColor: 'rgba(26,37,64,0.07)' }}>
          {movs.map(m => (
            <div key={m.id} className="flex items-center gap-1.5 flex-wrap">
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0"
                style={{
                  background: m.type === 'BUY' ? 'rgba(10,142,98,0.12)'  : 'rgba(201,48,72,0.12)',
                  color:      m.type === 'BUY' ? '#0A8E62'               : '#C93048',
                }}
              >
                {m.type === 'BUY' ? 'ACHAT' : 'VENTE'}
              </span>
              <span className="font-mono font-semibold" style={{ color: '#1A2540' }}>{m.ticker}</span>
              <span style={{ color: '#8496B2' }}>{m.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DeployedCurveChart({ chartData, movements, cashUSD, totalCost, deployedBase }: Props) {
  // Reindex the portfolio curve to deployed capital only (strip out constant cashUSD)
  // portfolio_abs_at_t  = (pt.portfolio / 100) * totalCost
  // invested_at_t       = portfolio_abs_at_t - cashUSD
  // deployed_pct_at_t   = (invested_at_t / deployedBase) * 100
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

  const movByDate = useMemo(() => {
    const chartDates = data.map(pt => pt.date);
    const map: Record<string, Movement[]> = {};
    for (const m of movements) {
      const d = chartDates.find(cd => cd >= m.date) ?? null;
      if (!d) continue;
      if (!map[d]) map[d] = [];
      map[d].push(m);
    }
    return map;
  }, [movements, data]);

  // eslint-disable-next-line react/display-name
  const renderDot = useMemo(() => (props: any) => {
    const { cx, cy, payload, index } = props;
    const movs = movByDate[payload?.date];
    if (!movs?.length) return <circle key={index} cx={cx} cy={cy} r={0} fill="none" />;
    const onlySells = movs.every((m: Movement) => m.type === 'SELL');
    const color = onlySells ? '#C93048' : '#0A8E62';
    return (
      <g key={`dep-${index}`}>
        <circle cx={cx} cy={cy} r={6.5} fill={color} stroke="white" strokeWidth={2}
          style={{ filter: `drop-shadow(0 1px 6px ${color}66)` }} />
        <circle cx={cx} cy={cy} r={2.5} fill="white" />
        <text x={cx} y={cy - 12} textAnchor="middle"
          style={{ fontSize: '8px', fontWeight: 800, fill: color, pointerEvents: 'none', userSelect: 'none' }}>
          {onlySells ? '▼' : '▲'}
        </text>
      </g>
    );
  }, [movByDate]);

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
            Performance des positions uniquement ·{' '}
            <span style={{ color: '#0A8E62', fontWeight: 700 }}>▲ Entrée</span>
            {' · '}
            <span style={{ color: '#C93048', fontWeight: 700 }}>▼ Sortie</span>
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
              content={(props) => <ChartTooltip {...props} movByDate={movByDate} />}
              cursor={{ stroke: 'rgba(37,99,235,0.20)', strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="value"
              name="Capital investi"
              stroke="#2563EB"
              strokeWidth={2.5}
              fill="url(#deployedCurveGrad)"
              dot={renderDot}
              activeDot={{ r: 4, fill: '#2563EB', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
