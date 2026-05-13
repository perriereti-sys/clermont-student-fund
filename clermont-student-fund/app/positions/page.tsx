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
    targetCount: 9,
    maxWeight: 50,
  },
  {
    id: 'conviction',
    label: 'Convictions',
    color: '#D4AF37',
    description:
      'Paris à fort potentiel sur 12 à 24 mois. Sociétés positionnées sur des thématiques de rupture (IA, spatial, quantique). Volatilité acceptée et assumée.',
    targetCount: 2,
    maxWeight: 30,
  },
  {
    id: 'opportunite',
    label: 'Opportunités',
    color: '#70AD47',
    description:
      "Positions tactiques sur des catalyseurs identifiés. Horizon court à moyen terme, taille de position limitée, sortie dès l'objectif atteint.",
    targetCount: 3,
    maxWeight: 20,
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
      positions: [], cashEUR: 0, eurUsd: 1.09, chartData: [], lastUpdated: new Date().toISOString(),
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

  const eurUsd = portfolio.eurUsd ?? 1.09;
  const fmtUsd = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  const fmtEur = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

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
            const positions  = grouped[bucket.id];
            const pnl        = positions.reduce((s, p) => s + p.pnlEUR, 0);
            const weight     = positions.reduce((s, p) => s + p.weight, 0);
            const valueUSD   = positions.reduce((s, p) => s + p.currentValueEUR, 0);
            const isPnlPos   = pnl >= 0;
            const wRatio     = bucket.maxWeight > 0 ? weight / bucket.maxWeight : 0;
            const barColor   = wRatio > 0.9 ? '#C93048' : wRatio > 0.75 ? '#B8963A' : bucket.color;

            return (
              <a
                key={bucket.id}
                href={`#bucket-${bucket.id}`}
                className="card relative overflow-hidden rounded-xl p-5 block"
                style={{ borderLeft: `4px solid ${bucket.color}`, textDecoration: 'none', cursor: 'pointer' }}
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

                {/* Valeur totale */}
                <div className="mb-3">
                  <p className="section-label mb-0.5">Valeur totale</p>
                  <p className="font-mono font-bold text-xl text-navy">{fmtUsd(valueUSD)}</p>
                  <p className="font-mono text-xs mt-0.5" style={{ color: '#8496B2' }}>{fmtEur(valueUSD / eurUsd)}</p>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
                  <div>
                    <p className="section-label mb-0.5">P&amp;L</p>
                    <p className={`font-mono font-bold text-base ${isPnlPos ? 'text-gain' : 'text-loss'}`}>
                      {isPnlPos ? '+' : ''}{fmtEur(pnl / eurUsd)}
                    </p>
                    <p className="font-mono text-xs mt-0.5" style={{ color: '#8496B2' }}>
                      {isPnlPos ? '+' : ''}{fmtUsd(pnl)}
                    </p>
                  </div>
                  <div>
                    <p className="section-label mb-0.5">Allocation</p>
                    <div className="flex items-baseline gap-1">
                      <p className="font-mono font-bold text-base" style={{ color: barColor }}>{weight.toFixed(1)}%</p>
                      <p className="text-xs" style={{ color: '#8496B2' }}>/ {bucket.maxWeight}%</p>
                    </div>
                  </div>
                </div>

                {/* Barre règlement */}
                <div className="mb-3">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(26,37,64,0.08)' }}>
                    <div
                      className="h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(wRatio * 100, 100)}%`, background: barColor }}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#8496B2' }}>
                    Règlement : max {bucket.maxWeight}% du portefeuille
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs" style={{ color: '#8496B2' }}>
                    {positions.length} / {bucket.targetCount} positions
                  </p>
                  <span className="text-xs font-semibold" style={{ color: bucket.color }}>Voir ↓</span>
                </div>
              </a>
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
          <BucketSection bucket={bucket} positions={grouped[bucket.id]} eurUsd={eurUsd} />
        </AnimateIn>
      ))}

      {/* ── Geographic exposure ─────────────────────────── */}
      <AnimateIn delay={60} y={20}>
        <section className="flex flex-col gap-4">
          <div>
            <p className="section-label mb-1">Exposition géographique</p>
            <h2 className="font-display font-bold text-xl" style={{ color: '#1A2540' }}>Où investit le CSF ?</h2>
          </div>
          <GeoSection
            positions={portfolio.positions}
            cashUSD={portfolio.cashEUR}
            totalValue={portfolio.totalValue}
          />
        </section>
      </AnimateIn>


    </div>
  );
}
