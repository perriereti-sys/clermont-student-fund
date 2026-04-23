import { Alert } from '@/lib/types';

interface Props { alerts: Alert[] }

export default function AlertsPanel({ alerts }: Props) {
  if (alerts.length === 0) {
    return (
      <div
        className="relative flex items-center gap-4 rounded-xl px-5 py-4 overflow-hidden"
        style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100">Règlement respecté</p>
          <p className="text-xs mt-0.5" style={{ color: '#7A96B8' }}>Toutes les limites de concentration sont dans les clous.</p>
        </div>
        <div className="absolute right-4 text-[11px] font-semibold tracking-wider uppercase" style={{ color: 'rgba(16,185,129,0.3)' }}>OK</div>
      </div>
    );
  }

  return (
    <div className="card-static relative rounded-2xl overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
      <div className="px-5 py-4 border-b border-navy-600 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100">Alertes règlement</p>
          <p className="text-xs" style={{ color: '#7A96B8' }}>{alerts.length} limite{alerts.length > 1 ? 's' : ''} dépassée{alerts.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-4 py-3 rounded-xl"
            style={{
              background: alert.type === 'danger' ? 'rgba(239,68,68,0.06)' : 'rgba(234,179,8,0.06)',
              border: `1px solid ${alert.type === 'danger' ? 'rgba(239,68,68,0.2)' : 'rgba(234,179,8,0.2)'}`,
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background: alert.type === 'danger' ? 'rgba(239,68,68,0.12)' : 'rgba(234,179,8,0.12)',
                color: alert.type === 'danger' ? '#ef4444' : '#eab308',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: alert.type === 'danger' ? '#f87171' : '#fbbf24' }}>
                {alert.message}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${Math.min((alert.value / alert.limit) * 100, 100)}%`,
                      background: alert.type === 'danger' ? '#ef4444' : '#eab308',
                    }}
                  />
                </div>
                <span className="text-xs font-mono whitespace-nowrap" style={{ color: '#7A96B8' }}>
                  {alert.value.toFixed(1)}% / {alert.limit}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 pb-4">
        <p className="section-label mb-2">Limites du règlement</p>
        <div className="flex flex-wrap gap-2">
          {[
            '1 position ≤ 15%',
            'Crypto ≤ 20%',
            '1 secteur ≤ 25%',
          ].map(rule => (
            <span key={rule} className="badge badge-gray">{rule}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
