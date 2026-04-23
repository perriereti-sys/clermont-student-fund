'use client';

import { useState } from 'react';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('https://formspree.io/f/xnjllaep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden px-6 py-10 sm:px-12 text-center"
      style={{ background: 'linear-gradient(135deg, #0f1e3a 0%, #0a1628 50%, #0f1e3a 100%)', border: '1px solid #1e2d4a' }}
    >
      {/* Gold top line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />

      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#D4AF37' }}>
        Rejoindre le fond
      </p>
      <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-100 mb-2">
        Intéressé par l'investissement&nbsp;?
      </h2>
      <p className="text-sm sm:text-base mb-8 max-w-md mx-auto" style={{ color: '#6B84A0' }}>
        Laisse ton email pour suivre nos performances et être contacté quand on ouvre les portes à de nouveaux membres.
      </p>

      {status === 'success' ? (
        <div className="flex items-center justify-center gap-2 text-gain font-semibold">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Inscription enregistrée — on te recontacte bientôt !
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            placeholder="ton@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className="flex-1 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-gold/40 transition"
            style={{ background: '#0a0f1e', border: '1px solid #1e2d4a' }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex-shrink-0 px-6 py-3 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-60"
            style={{ background: '#D4AF37', color: '#0a0f1e' }}
          >
            {status === 'loading' ? 'Envoi…' : 'Rejoindre'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="text-xs text-loss mt-3">Une erreur est survenue, réessaie.</p>
      )}
    </div>
  );
}
