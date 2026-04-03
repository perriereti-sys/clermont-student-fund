import { Alert } from '@/lib/types';

interface Props {
  alerts: Alert[];
}

export default function AlertsPanel({ alerts }: Props) {
  if (alerts.length === 0) {
    return (
      <div className="bg-surface border border-gain/30 rounded-xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gain/10 rounded-full flex items-center justify-center text-gain">
            ✓
          </div>
          <div>
            <h3 className="font-semibold text-white">Règlement respecté</h3>
            <p className="text-gray-400 text-sm">
              Toutes les limites du règlement sont respectées.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h3 className="font-semibold text-white mb-4">
        Alertes règlement ({alerts.length})
      </h3>
      <div className="flex flex-col gap-3">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-3 rounded-lg border ${
              alert.type === 'danger'
                ? 'bg-loss/5 border-loss/30'
                : 'bg-yellow-500/5 border-yellow-500/30'
            }`}
          >
            <span
              className={`text-lg mt-0.5 ${
                alert.type === 'danger' ? 'text-loss' : 'text-yellow-400'
              }`}
            >
              {alert.type === 'danger' ? '⚠' : '○'}
            </span>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  alert.type === 'danger' ? 'text-loss' : 'text-yellow-400'
                }`}
              >
                {alert.message}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Actuel : {alert.value.toFixed(1)}% — Limite : {alert.limit}%
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <h4 className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">
          Limites du règlement
        </h4>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• 1 position max 15% du portefeuille</li>
          <li>• Crypto max 20% du portefeuille</li>
          <li>• 1 secteur max 25% du portefeuille</li>
        </ul>
      </div>
    </div>
  );
}
