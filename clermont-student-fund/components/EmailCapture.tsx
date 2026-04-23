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
    <section id="rejoindre" className="relative rounded-2xl overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0e1f33 50%, #0a1628 100%)' }} />

      {/* Orbs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 300, height: 300, top: '-80px', right: '-40px', background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)' }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 240, height: 240, bottom: '-60px', left: '10%', background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)' }}
      />

      {/* Border */}
      <div className="absolute inset-0 rounded-2xl" style={{ border: '1px solid rgba(212,175,55,0.2)' }} />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-12 py-12 sm:py-16 text-center">

        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
          style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Rejoindre le fond
        </div>

        <h2 className="font-display font-bold text-2xl sm:text-4xl text-slate-100 leading-tight mb-3">
          Tu es étudiant et passionné<br className="hidden sm:block" /> par les marchés ?
        </h2>

        <p className="text-sm sm:text-base leading-relaxed mb-10 max-w-lg mx-auto" style={{ color: '#6B84A0' }}>
          Laisse ton email — on te contacte pour t'expliquer comment rejoindre le CSF
          et participer aux prises de décision du portefeuille.
        </p>

        {status === 'success' ? (
          <div className="flex items-center justify-center gap-3 py-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-100 text-sm">Inscription enregistrée !</p>
              <p className="text-xs mt-0.5" style={{ color: '#4A6080' }}>On te recontacte très bientôt.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#4A6080' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <input
                type="email"
                required
                placeholder="ton@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200"
                style={{
                  background: 'rgba(10,15,30,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; }}
                onBlur={(e)  => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex-shrink-0 flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 disabled:opacity-60 disabled:scale-100"
              style={{ background: '#D4AF37', color: '#060d1a', boxShadow: '0 4px 20px rgba(212,175,55,0.25)' }}
            >
              {status === 'loading' ? (
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              ) : 'Rejoindre'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-xs mt-3" style={{ color: '#ef4444' }}>Une erreur est survenue, réessaie.</p>
        )}

        <p className="text-[11px] mt-6" style={{ color: '#2d4a6a' }}>
          Pas de spam. Juste un message quand les portes s'ouvrent.
        </p>
      </div>
    </section>
  );
}
