import rapportsData from '@/data/rapports.json';

interface Rapport {
  id: string;
  title: string;
  date: string;
  type: string;
  period: string;
  filename: string;
}

function PdfIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

const TYPE_COLORS: Record<string, string> = {
  'Compte de résultats': '#2563EB',
  'Bilan':               '#7C3AED',
  'Rapport annuel':      '#B8963A',
  'Note de marché':      '#0A8E62',
};

export default function RapportsPage() {
  const rapports = rapportsData.rapports as Rapport[];

  const sorted = [...rapports].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="flex flex-col gap-7">

      {/* Page header */}
      <div className="page-heading">
        <p className="section-label mb-1">Portefeuille</p>
        <h1 className="font-display font-bold text-2xl" style={{ color: '#1A2540' }}>Rapports</h1>
        <p className="text-sm mt-1" style={{ color: '#8496B2' }}>
          Comptes de résultats et documents financiers de l'association
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="card-static rounded-xl p-5">
          <p className="section-label mb-3">Documents publiés</p>
          <p className="font-display font-bold text-3xl font-mono" style={{ color: '#1A2540' }}>
            {rapports.length}
          </p>
          <p className="text-xs mt-1.5" style={{ color: '#8496B2' }}>rapports disponibles</p>
        </div>

        <div className="card-static rounded-xl p-5">
          <p className="section-label mb-3">Dernier rapport</p>
          <p className="font-display font-bold text-xl" style={{ color: '#1A2540' }}>
            {sorted.length > 0
              ? new Date(sorted[0].date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
              : '—'}
          </p>
          <p className="text-xs mt-1.5" style={{ color: '#8496B2' }}>
            {sorted.length > 0 ? sorted[0].type : 'aucun document'}
          </p>
        </div>
      </div>

      {/* Documents list */}
      <div className="card-static rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(26,37,64,0.07)', background: '#FAFBFD' }}>
          <p className="section-label">Documents</p>
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4" style={{ color: '#8496B2' }}>
            <PdfIcon />
            <p className="text-sm">Aucun rapport déposé pour l'instant</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(26,37,64,0.06)' }}>
            {sorted.map((r) => {
              const color = TYPE_COLORS[r.type] ?? '#5C6E8A';
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-4 px-5 py-4 transition-colors duration-150 hover:bg-surface-2"
                >
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${color}14`, color }}
                  >
                    <PdfIcon />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#1A2540' }}>
                      {r.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                        style={{ background: `${color}14`, color }}
                      >
                        {r.type}
                      </span>
                      <span className="text-xs" style={{ color: '#8496B2' }}>
                        {new Date(r.date).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Open button */}
                  <a
                    href={`/rapports/${r.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors duration-150"
                    style={{
                      background: `${color}10`,
                      color,
                      border: `1px solid ${color}25`,
                    }}
                  >
                    <ExternalIcon />
                    Ouvrir
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
