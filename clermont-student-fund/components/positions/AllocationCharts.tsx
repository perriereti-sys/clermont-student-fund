'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { EnrichedPosition } from '@/lib/types';

const TYPE_COLORS: Record<string, string> = {
  action: '#3b82f6',
  etf: '#22c55e',
  or: '#f59e0b',
  crypto: '#8b5cf6',
  cash: '#6b7280',
};

const TYPE_LABELS: Record<string, string> = {
  action: 'Actions',
  etf: 'ETF',
  or: 'Or',
  crypto: 'Crypto',
  cash: 'Liquidités',
};

const SECTOR_COLORS = [
  '#3b82f6',
  '#22c55e',
  '#f59e0b',
  '#8b5cf6',
  '#ef4444',
  '#06b6d4',
  '#f97316',
  '#84cc16',
];

interface Props {
  positions: EnrichedPosition[];
  cashEUR: number;
  totalValue: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-surface-2 border border-border rounded-lg p-3 text-sm">
      <p className="text-white font-medium">{name}</p>
      <p className="text-gray-400">{value.toFixed(1)}%</p>
    </div>
  );
};

export default function AllocationCharts({ positions, cashEUR, totalValue }: Props) {
  // By asset type
  const typeMap: Record<string, number> = { cash: (cashEUR / totalValue) * 100 };
  for (const p of positions) {
    typeMap[p.type] = (typeMap[p.type] ?? 0) + p.weight;
  }
  const typeData = Object.entries(typeMap).map(([type, value]) => ({
    name: TYPE_LABELS[type] ?? type,
    value: parseFloat(value.toFixed(1)),
    color: TYPE_COLORS[type] ?? '#6b7280',
  }));

  // By sector
  const sectorMap: Record<string, number> = {};
  for (const p of positions) {
    sectorMap[p.sector] = (sectorMap[p.sector] ?? 0) + p.weight;
  }
  if (cashEUR > 0) {
    sectorMap['Liquidités'] = (cashEUR / totalValue) * 100;
  }
  const sectorData = Object.entries(sectorMap).map(([name, value], i) => ({
    name,
    value: parseFloat(value.toFixed(1)),
    color: SECTOR_COLORS[i % SECTOR_COLORS.length],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="text-base font-semibold text-white mb-4">
          Répartition par type d'actif
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={typeData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {typeData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: '#9ca3af', fontSize: '12px' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="text-base font-semibold text-white mb-4">
          Répartition par secteur
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={sectorData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {sectorData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: '#9ca3af', fontSize: '12px' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
