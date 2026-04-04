interface CardProps {
  label: string;
  value: string;
  subValue?: string;
  description: string;
  valueColor: string;
  topColor: string;   // gradient for top border
  animClass?: string;
}

function MetricCard({ label, value, subValue, description, valueColor, topColor, animClass }: CardProps) {
  return (
    <div className={`card relative overflow-hidden group ${animClass ?? ''}`}>
      {/* Coloured top accent */}
      <div className={`absolute top-0 inset-x-0 h-[2px] ${topColor}`} />

      <div className="p-5">
        <p className="section-label mb-4">{label}</p>
        <p className={`font-display font-bold text-2xl font-mono leading-none mb-1 ${valueColor}`}>
          {value}
        </p>
        {subValue && (
          <p className="text-xs font-mono mt-1" style={{ color: '#4A6080' }}>{subValue}</p>
        )}
        <p className="text-xs leading-relaxed mt-3" style={{ color: '#4A6080' }}>
          {description}
        </p>
      </div>
    </div>
  );
}

interface Props {
  sharpeRatio: number;
  beta: number;
  var95: number;
  maxDrawdown: number;
  totalValue: number;
}

export default function MetricsCards({ sharpeRatio, beta, var95, maxDrawdown }: Props) {
  const fmtUsd = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  const sharpeColor = sharpeRatio > 1 ? 'text-gain' : sharpeRatio > 0 ? 'text-gold' : 'text-loss';

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <MetricCard
        label="Sharpe Ratio"
        value={sharpeRatio.toFixed(2)}
        subValue={sharpeRatio > 1 ? '✓ Excellent' : sharpeRatio > 0 ? '~ Correct' : '✗ Faible'}
        description="Rendement ajusté du risque. Cible : supérieur à 1"
        valueColor={sharpeColor}
        topColor="bg-gradient-to-r from-transparent via-gold/50 to-transparent"
        animClass="animate-fade-up"
      />
      <MetricCard
        label="Bêta"
        value={beta.toFixed(2)}
        subValue={beta < 0.8 ? 'Défensif' : beta < 1.2 ? 'Neutre' : 'Offensif'}
        description="Sensibilité vs MSCI World. Neutre à 1,00"
        valueColor={beta < 0.8 ? 'text-accent' : beta < 1.2 ? 'text-slate-200' : 'text-gold'}
        topColor="bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        animClass="animate-fade-up-d1"
      />
      <MetricCard
        label="VaR 95 %"
        value={fmtUsd(var95)}
        subValue="Quotidien"
        description="Perte maximale journalière avec 95% de confiance"
        valueColor="text-gold"
        topColor="bg-gradient-to-r from-transparent via-gold/30 to-transparent"
        animClass="animate-fade-up-d2"
      />
      <MetricCard
        label="Max Drawdown"
        value={`-${maxDrawdown.toFixed(1)} %`}
        subValue="Pic → creux"
        description="Plus forte correction depuis un sommet historique"
        valueColor="text-loss"
        topColor="bg-gradient-to-r from-transparent via-loss/40 to-transparent"
        animClass="animate-fade-up-d3"
      />
    </div>
  );
}
