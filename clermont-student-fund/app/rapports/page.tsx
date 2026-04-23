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
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

const TYPE_COLORS: Record<string, string> = {
  'Compte de résultats': '#3b82f6',
  'Bilan':              '#a855f7',
  'Rapport annuel':     '#D4AF37',
  'Note de marché':     '#22c55e',
};

export default function RapportsPage() {
  const rapports = rapportsData.rapports as Rapport[];

  const sorted = [...rapports].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="flex flex-col gap-7">

      {/* Page header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-100">Rapports</h1>
        <p className="text-sm mt-1" style={{ color: '#7A96B8' }}>
          Comptes de résultats et documents financiers de l'association
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="card relative overflow-hidden rounded-xl p-5">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
          <p className="section-label mb-3">Documents publiés</p>
          <p className="font-display font-bold text-2xl font-mono text-slate-100">{rapports.length}</p>
          <p className="text-xs mt-1.5" style={{ color: '#7A96B8' }}>rapports disponibles</p>
        </div>
        <div className="card relative overflow-hidden rounded-xl p-5">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
          <p className="section-label mb-3">Dernier rapport</p>
          <p className="font-display font-bold text-2xl font-mono text-slate-100">
            {sorted.length > 0
              ? new Date(sorted[0].date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
              : '—'}
          </p>
          <p className="text-xs mt-1.5" style={{ color: '#7A96B8' }}>
            {sorted.length > 0 ? sorted[0].type : 'aucun document'}
          </p>
        </div>
      </div>

      {/* Documents list */}
      <div className="card rounded-xl overflow-hidden">
        <div className="relative px-5 py-4 border-b border-navy-600">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
          <h2 className="font-display font-semibold text-slate-100 text-sm tracking-wide">Documents</h2>
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4" style={{ color: '#7A96B8' }}>
            <PdfIcon />
            <p className="text-sm">Aucun rapport déposé pour l'instant</p>
          </div>
        ) : (
          <div className="divide-y divide-navy-600">
            {sorted.map((r) => {
              const color = TYPE_COLORS[r.type] ?? '#7A96B8';
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-navy-700/30 transition-colors duration-150"
                >
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${color}18`, color }}
                  >
                    <PdfIcon />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-100 truncate">{r.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                        style={{ background: `${color}20`, color }}
                      >
                        {r.type}
                      </span>
                      <span className="text-xs" style={{ color: '#7A96B8' }}>
                        {new Date(r.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Open button */}
                  <a
                    href={`/rapports/${r.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors duration-150"
                    style={{ background: '#1a2444', color: '#3b82f6' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
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
