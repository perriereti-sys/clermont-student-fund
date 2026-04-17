'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { EnrichedPosition } from '@/lib/types';

const TYPE_COLORS: Record<string, string> = {
  action: '#3b82f6',
  etf:    '#22c55e',
  or:     '#f59e0b',
  crypto: '#8b5cf6',
  cash:   '#64748b',
};
const TYPE_LABELS: Record<string, string> = {
  action: 'Stocks',
  etf:    'ETF',
  or:     'Gold',
  crypto: 'Crypto',
  cash:   'Cash',
};
const SECTOR_COLORS = [
  '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6',
  '#ef4444', '#06b6d4', '#f97316', '#84cc16', '#ec4899',
];

interface ChartEntry { name: string; value: number; color: string }

interface Props {
  positions: EnrichedPosition[];
  cashEUR: number;
  totalValue: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs shadow-xl"
      style={{ background: '#0E1F33', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="font-semibold text-white">{payload[0].name}</p>
      <p style={{ color: '#94A3B8' }}>{payload[0].value.toFixed(1)}%</p>
    </div>
  );
};

// Legend rendered outside the SVG so it never overflows
function ChartLegend({ items }: { items: ChartEntry[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3 px-2">
      {items.map((item) => (
        <div key={item.name} className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: item.color }} />
          <span className="text-xs" style={{ color: '#7A96B0' }}>{item.name}</span>
          <span className="text-xs font-mono" style={{ color: '#94A3B8' }}>{item.value.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data, label }: { data: ChartEntry[]; label: string }) {
  return (
    <div className="card-static rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-slate-100 mb-1">{label}</h3>
      <p className="section-label mb-4">{data.length} categories</p>
      {/* Fixed height container — chart only, no legend inside */}
      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="45%"
              outerRadius="72%"
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="rgba(0,0,0,0.2)" strokeWidth={1} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend outside SVG — no overflow */}
      <ChartLegend items={data} />
    </div>
  );
}

export default function AllocationCharts({ positions, cashEUR, totalValue }: Props) {
  // By asset type
  const typeMap: Record<string, number> = { cash: (cashEUR / totalValue) * 100 };
  for (const p of positions) {
    typeMap[p.type] = (typeMap[p.type] ?? 0) + p.weight;
  }
  const typeData: ChartEntry[] = Object.entries(typeMap).map(([type, value]) => ({
    name:  TYPE_LABELS[type] ?? type,
    value: parseFloat(value.toFixed(1)),
    color: TYPE_COLORS[type] ?? '#6b7280',
  }));

  // By sector
  const sectorMap: Record<string, number> = {};
  for (const p of positions) {
    sectorMap[p.sector] = (sectorMap[p.sector] ?? 0) + p.weight;
  }
  if (cashEUR > 0) {
    sectorMap['Cash'] = (cashEUR / totalValue) * 100;
  }
  const sectorData: ChartEntry[] = Object.entries(sectorMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], i) => ({
      name,
      value: parseFloat(value.toFixed(1)),
      color: SECTOR_COLORS[i % SECTOR_COLORS.length],
    }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <DonutChart data={typeData}   label="By Asset Type" />
      <DonutChart data={sectorData} label="By Sector" />
    </div>
  );
}
