interface Props {
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  lastUpdated: string;
}

export default function PortfolioHeader({
  totalValue,
  totalPnL,
  totalPnLPercent,
  lastUpdated,
}: Props) {
  const isPositive = totalPnL >= 0;

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-gray-400 text-sm mb-1">Valeur du portefeuille</p>
          <p className="text-4xl font-bold text-white">{fmt(totalValue)}</p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-lg font-semibold ${
                isPositive ? 'text-gain' : 'text-loss'
              }`}
            >
              {isPositive ? '+' : ''}
              {fmt(totalPnL)}
            </span>
            <span
              className={`text-sm px-2 py-0.5 rounded-full ${
                isPositive
                  ? 'bg-gain/10 text-gain'
                  : 'bg-loss/10 text-loss'
              }`}
            >
              {isPositive ? '+' : ''}
              {totalPnLPercent.toFixed(2)}%
            </span>
            <span className="text-gray-500 text-sm">depuis le début</span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-gray-500 text-xs">
            Mis à jour :{' '}
            {new Date(lastUpdated).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className="text-gray-500 text-xs">
            Investissement initial : {fmt(100000)}
          </p>
        </div>
      </div>
    </div>
  );
}
