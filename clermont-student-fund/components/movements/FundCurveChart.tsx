'use client';

import { useMemo } from 'react';
import {
  ComposedChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import type { ChartPoint, Movement } from '@/lib/types';

interface Props {
  chartData: ChartPoint[];
  movements: Movement[];
}

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  movByDate: Record<string, Movement[]>;
}

function ChartTooltip({ active, payload, label, movByDate }: TooltipProps) {
  if (!active || !payload?.length || !label) return null;
  const movs = movByDate[label] ?? [];
  const pct = (payload[0]?.value ?? 100) - 100;
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
                  background: m.type === 'BUY'  ? 'rgba(34,197,94,0.12)'  : 'rgba(239,68,68,0.12)',
                  color:      m.type === 'BUY'  ? '#16A34A'               : '#DC2626',
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

export default function FundCurveChart({ chartData, movements }: Props) {
  const data = useMemo(() =>
    chartData.map(pt => ({ date: pt.date, value: pt.portfolio })),
    [chartData]
  );

  // Map each movement to the nearest trading day >= movement date.
  // Needed because movement dates like 2026-01-01 (holiday) may not exist in chartData.
  const movByDate = useMemo(() => {
    const chartDates = data.map(pt => pt.date);
    const map: Record<string, Movement[]> = {};
    for (const m of movements) {
      const chartDate = chartDates.find(d => d >= m.date) ?? null;
      if (!chartDate) continue;
      if (!map[chartDate]) map[chartDate] = [];
      map[chartDate].push(m);
    }
    return map;
  }, [movements, data]);

  // eslint-disable-next-line react/display-name
  const renderDot = useMemo(() => (props: any) => {
    const { cx, cy, payload, index } = props;
    const movs = movByDate[payload?.date];
    if (!movs?.length) return <circle key={index} cx={cx} cy={cy} r={0} fill="none" />;
    const onlySells = movs.every((m: Movement) => m.type === 'SELL');
    const color = onlySells ? '#EF4444' : '#22C55E';
    return (
      <g key={`mov-${index}`}>
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
  const totalPct  = (lastValue ?? 100) - 100;
  const perfColor = totalPct >= 0 ? '#0A8E62' : '#C93048';

  return (
    <div className="card-static rounded-2xl overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-4 border-b flex items-start justify-between"
        style={{ borderColor: 'rgba(26,37,64,0.07)', background: '#FAFBFD' }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: '#1A2540' }}>Courbe du fonds</p>
          <p className="text-xs mt-0.5" style={{ color: '#8496B2' }}>
            Depuis le lancement ·{' '}
            <span style={{ color: '#22C55E', fontWeight: 700 }}>▲ Entrée</span>
            {' · '}
            <span style={{ color: '#EF4444', fontWeight: 700 }}>▼ Sortie</span>
          </p>
        </div>
        <span className="text-sm font-mono font-bold" style={{ color: perfColor }}>
          {totalPct >= 0 ? '+' : ''}{totalPct.toFixed(2)}%
        </span>
      </div>

      {/* Chart */}
      <div className="px-2 py-5 bg-white">
        <ResponsiveContainer width="100%" height={240} className="sm:!h-[300px]">
          <ComposedChart data={data} margin={{ top: 12, right: 8, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="fundCurveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#B8963A" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#B8963A" stopOpacity={0.01} />
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
              cursor={{ stroke: 'rgba(184,150,58,0.22)', strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="value"
              name="CSF Portfolio"
              stroke="#B8963A"
              strokeWidth={2.5}
              fill="url(#fundCurveGrad)"
              dot={renderDot}
              activeDot={{ r: 4, fill: '#B8963A', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
