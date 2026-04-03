'use client';

import { useState } from 'react';

const ASSET_TYPES = [
  { value: 'action', label: 'Action (ex: AAPL, MC.PA)' },
  { value: 'etf', label: 'ETF (ex: IWDA.AS)' },
  { value: 'or', label: 'Or (ticker: GC=F)' },
  { value: 'crypto', label: 'Crypto (ex: BTC-USD)' },
];

export default function AddPositionModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-accent hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
      >
        <span>+</span> Ajouter une position
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="bg-surface border border-border rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-white">
                Ajouter une position
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-5">
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-5">
                <p className="text-accent text-sm font-medium mb-1">
                  Comment ajouter une position ?
                </p>
                <p className="text-gray-400 text-sm">
                  Éditez le fichier{' '}
                  <code className="bg-surface-2 px-1 rounded text-xs text-white">
                    data/portfolio.json
                  </code>{' '}
                  et ajoutez votre position dans le tableau{' '}
                  <code className="bg-surface-2 px-1 rounded text-xs text-white">
                    positions
                  </code>
                  . Puis poussez sur GitHub — Vercel redéploie automatiquement.
                </p>
              </div>

              <div className="bg-surface-2 rounded-lg p-4">
                <p className="text-gray-400 text-xs mb-3 font-medium uppercase tracking-wide">
                  Template à copier dans portfolio.json
                </p>
                <pre className="text-xs text-green-400 overflow-x-auto">{`{
  "id": "6",
  "name": "Nom de l'actif",
  "ticker": "TICKER",
  "type": "action",
  "sector": "Technologie",
  "quantity": 10,
  "avgBuyPrice": 150.00,
  "currency": "USD",
  "buyDate": "2026-04-01"
}`}</pre>
              </div>

              <div className="mt-4">
                <p className="text-gray-500 text-xs mb-2">Types d'actifs :</p>
                <ul className="text-xs text-gray-400 space-y-1">
                  {ASSET_TYPES.map((t) => (
                    <li key={t.value}>
                      <code className="text-white">{t.value}</code> — {t.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <p className="text-gray-500 text-xs mb-2">
                  N'oubliez pas d'ajouter le mouvement dans{' '}
                  <code className="bg-surface-2 px-1 rounded text-white">
                    data/movements.json
                  </code>{' '}
                  et de mettre à jour{' '}
                  <code className="bg-surface-2 px-1 rounded text-white">
                    data/history.json
                  </code>{' '}
                  avec la nouvelle valeur du portefeuille.
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-border flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="bg-surface-2 hover:bg-border text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
