import { getPortfolioMetrics } from '@/lib/getPortfolioMetrics';
import { EnrichedPosition } from '@/lib/types';
import BucketSection, { BucketId, BucketConfig } from '@/components/positions/BucketSection';
import AllocationCharts from '@/components/positions/AllocationCharts';
import GeoSection from '@/components/GeoSection';
import AnimateIn from '@/components/AnimateIn';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const BUCKETS: BucketConfig[] = [
  {
    id: 'socle',
    label: 'Socle',
    color: '#2E75B6',
    description:
      'Positions de long terme qui ancrent le portefeuille. Faible rotation, volatilité maîtrisée, exposition diversifiée géographiquement et sectoriellement.',
    targetCount: 6,
  },
  {
    id: 'conviction',
    label: 'Convictions',
    color: '#D4AF37',
    description:
      'Paris à fort potentiel sur 12 à 24 mois. Sociétés positionnées sur des thématiques de rupture (IA, spatial, quantique). Volatilité acceptée et assumée.',
    targetCount: 2,
  },
  {
    id: 'opportunite',
    label: 'Opportunités',
    color: '#70AD47',
    description:
      "Positions tactiques sur des catalyseurs identifiés. Horizon court à moyen terme, taille de position limitée, sortie dès l'objectif atteint.",
    targetCount: 2,
  },
];

export default async function PositionsPage() {
  let portfolio;
  try {
    portfolio = await getPortfolioMetrics();
  } catch {
    portfolio = {
      totalValue: 100000, totalCost: 100000, totalPnL: 0, totalPnLPercent: 0,
      sharpeRatio: 0, beta: 1.0, var95: 0, maxDrawdown: 0,
      positions: [], cashEUR: 0, chartData: [], lastUpdated: new Date().toISOString(),
    };
  }

  const grouped: Record<BucketId, EnrichedPosition[]> = {
    socle: [], conviction: [], opportunite: [],
  };
  for (const pos of portfolio.positions) {
    const cat = (pos as any).category as BucketId | undefined;
    const bucket: BucketId = cat && cat in grouped ? cat : 'socle';
    grouped[bucket].push(pos);
  }

  const fmtUsd = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="flex flex-col gap-8">

      {/* Page header */}
      <AnimateIn y={16}>
        <div className="page-heading">
          <p className="section-label mb-1">Portefeuille</p>
          <h1 className="font-display font-bold text-2xl text-navy">Positions par bucket</h1>
          <p className="text-sm mt-1" style={{ color: '#8496B2' }}>
            {portfolio.positions.length} actifs · Prix en temps réel via Yahoo Finance
          </p>
        </div>
      </AnimateIn>

      {/* Bucket summary cards */}
      <AnimateIn delay={60} y={16}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BUCKETS.map((bucket) => {
            const positions = grouped[bucket.id];
            const pnl      = positions.reduce((s, p) => s + p.pnlEUR, 0);
            const weight   = positions.reduce((s, p) => s + p.weight, 0);
            const isPnlPos = pnl >= 0;

            return (
              <div
                key={bucket.id}
                className="card relative overflow-hidden rounded-xl p-5"
                style={{ borderLeft: `4px solid ${bucket.color}` }}
              >
                <div
                  className="absolute top-0 inset-x-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${bucket.color}40, transparent)` }}
                />
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mb-3"
                  style={{ background: `${bucket.color}22`, color: bucket.color, border: `1px solid ${bucket.color}44` }}
                >
                  {bucket.label}
                </span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
                  <div>
                    <p className="section-label mb-0.5">Poids</p>
                    <p className="font-mono font-bold text-xl text-navy">{weight.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="section-label mb-0.5">P&amp;L</p>
                    <p className={`font-mono font-bold text-xl ${isPnlPos ? 'text-gain' : 'text-loss'}`}>
                      {isPnlPos ? '+' : ''}{fmtUsd(pnl)}
                    </p>
                  </div>
                </div>
                <p className="text-xs" style={{ color: '#8496B2' }}>
                  {positions.length} / {bucket.targetCount} positions
                </p>
              </div>
            );
          })}
        </div>
      </AnimateIn>

      {/* ── Allocation charts ───────────────────────────── */}
      <AnimateIn delay={120} y={20}>
        <section className="flex flex-col gap-4">
          <div>
            <p className="section-label mb-1">Allocation</p>
            <h2 className="font-display font-bold text-xl" style={{ color: '#1A2540' }}>Répartition du portefeuille</h2>
          </div>
          <AllocationCharts
            positions={portfolio.positions}
            cashEUR={portfolio.cashEUR}
            totalValue={portfolio.totalValue}
          />
        </section>
      </AnimateIn>

      {/* ── Bucket detail sections ──────────────────────── */}
      {BUCKETS.map((bucket, i) => (
        <AnimateIn key={bucket.id} delay={i * 80} y={18}>
          <BucketSection bucket={bucket} positions={grouped[bucket.id]} />
        </AnimateIn>
      ))}

      {/* ── Geographic exposure ─────────────────────────── */}
      <AnimateIn delay={60} y={20}>
        <section className="flex flex-col gap-4">
          <div>
            <p className="section-label mb-1">Exposition géographique</p>
            <h2 className="font-display font-bold text-xl" style={{ color: '#1A2540' }}>Où investit le CSF ?</h2>
          </div>
          <GeoSection positions={portfolio.positions} />
        </section>
      </AnimateIn>

    </div>
  );
}
