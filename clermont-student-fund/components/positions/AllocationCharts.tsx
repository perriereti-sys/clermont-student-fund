'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { EnrichedPosition } from '@/lib/types';

const TYPE_COLORS: Record<string, string> = {
  action: '#2563EB',
  etf:    '#0A8E62',
  or:     '#B8963A',
  crypto: '#7C3AED',
  cash:   '#8496B2',
};
const TYPE_LABELS: Record<string, string> = {
  action: 'Actions',
  etf:    'ETF',
  or:     'Or',
  crypto: 'Crypto',
  cash:   'Cash',
};
const SECTOR_PALETTE = [
  '#2563EB', '#0A8E62', '#B8963A', '#7C3AED',
  '#C93048', '#0891B2', '#EA580C', '#65A30D', '#DB2777', '#5C6E8A',
];

interface ChartEntry { name: string; value: number; color: string; tickers: string[] }

interface Props { positions: EnrichedPosition[]; cashEUR: number; totalValue: number }

function DonutChart({ data, label, sublabel }: { data: ChartEntry[]; label: string; sublabel: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = hovered ? data.find(d => d.name === hovered) ?? null : null;

  return (
    <div className="card-static rounded-2xl p-5 flex flex-col">
      <h3 className="text-sm font-semibold mb-0.5" style={{ color: '#1A2540' }}>{label}</h3>
      <p className="section-label mb-4">{sublabel}</p>

      {/* Donut + center overlay */}
      <div className="relative flex-shrink-0" style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius="42%" outerRadius="68%"
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
              animationBegin={0}
              animationDuration={700}
              onMouseEnter={(_, i) => setHovered(data[i].name)}
              onMouseLeave={() => setHovered(null)}
            >
              {data.map((entry, i) => (
                <Cell
                  key={i} fill={entry.color}
                  opacity={hovered && hovered !== entry.name ? 0.22 : 1}
                  style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {active ? (
            <>
              <span className="text-[11px] font-semibold text-center leading-tight px-2" style={{ color: active.color, maxWidth: 90 }}>{active.name}</span>
              <span className="text-xl font-bold font-mono mt-0.5" style={{ color: '#1A2540' }}>{active.value.toFixed(1)}%</span>
            </>
          ) : (
            <>
              <span className="text-[10px] font-medium" style={{ color: '#8496B2' }}>Total</span>
              <span className="text-lg font-bold font-mono" style={{ color: '#1A2540' }}>
                {data.reduce((s, d) => s + d.value, 0).toFixed(0)}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend with ticker chips on hover */}
      <div className="flex flex-col gap-1.5 mt-3">
        {data.map((entry) => {
          const isActive = hovered === entry.name;
          return (
            <div
              key={entry.name}
              className="rounded-lg px-2.5 py-1.5 cursor-default transition-all duration-150"
              style={{
                background: isActive ? `${entry.color}10` : 'transparent',
                border: `1px solid ${isActive ? entry.color + '28' : 'transparent'}`,
              }}
              onMouseEnter={() => setHovered(entry.name)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0 transition-opacity duration-200"
                  style={{ background: entry.color, opacity: hovered && !isActive ? 0.25 : 1 }}
                />
                <span className="flex-1 text-xs font-medium truncate" style={{ color: isActive ? '#1A2540' : '#5C6E8A' }}>
                  {entry.name}
                </span>
                <span className="text-xs font-mono font-bold" style={{ color: isActive ? entry.color : '#8496B2' }}>
                  {entry.value.toFixed(1)}%
                </span>
              </div>

              {/* Ticker chips — only when hovered */}
              {isActive && entry.tickers.filter(t => t !== 'Cash').length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5 pl-4">
                  {entry.tickers.filter(t => t !== 'Cash').map(t => (
                    <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: entry.color + '15', color: entry.color }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AllocationCharts({ positions, cashEUR, totalValue }: Props) {
  // By asset type
  const typeAcc: Record<string, { value: number; tickers: string[] }> = {
    cash: { value: totalValue > 0 ? (cashEUR / totalValue) * 100 : 0, tickers: ['Cash'] },
  };
  for (const p of positions) {
    if (!typeAcc[p.type]) typeAcc[p.type] = { value: 0, tickers: [] };
    typeAcc[p.type].value += p.weight;
    typeAcc[p.type].tickers.push(p.ticker);
  }
  const typeData: ChartEntry[] = Object.entries(typeAcc)
    .filter(([, { value }]) => value > 0)
    .map(([type, { value, tickers }]) => ({
      name: TYPE_LABELS[type] ?? type,
      value: parseFloat(value.toFixed(1)),
      color: TYPE_COLORS[type] ?? '#6b7280',
      tickers,
    }));

  // By sector
  const sectorAcc: Record<string, { value: number; tickers: string[] }> = {};
  for (const p of positions) {
    if (!sectorAcc[p.sector]) sectorAcc[p.sector] = { value: 0, tickers: [] };
    sectorAcc[p.sector].value += p.weight;
    sectorAcc[p.sector].tickers.push(p.ticker);
  }
  if (cashEUR > 0 && totalValue > 0) {
    sectorAcc['Cash'] = { value: (cashEUR / totalValue) * 100, tickers: ['Cash'] };
  }
  const sectorData: ChartEntry[] = Object.entries(sectorAcc)
    .filter(([, { value }]) => value > 0)
    .sort((a, b) => b[1].value - a[1].value)
    .map(([name, { value, tickers }], i) => ({
      name,
      value: parseFloat(value.toFixed(1)),
      color: SECTOR_PALETTE[i % SECTOR_PALETTE.length],
      tickers,
    }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <DonutChart data={typeData}   label="Par type d'actif" sublabel={`${typeData.length} catégories`} />
      <DonutChart data={sectorData} label="Par secteur"       sublabel={`${sectorData.length} secteurs`} />
    </div>
  );
}
