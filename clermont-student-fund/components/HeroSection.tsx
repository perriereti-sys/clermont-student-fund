'use client';

import { useEffect, useRef } from 'react';

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );
    const targets = sectionRef.current?.querySelectorAll('[data-animate]');
    targets?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="relative overflow-hidden rounded-2xl mb-2" style={{ minHeight: '520px' }}>

      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #060d1a 0%, #0a1628 40%, #0c1e38 100%)' }} />

      {/* Animated orbs */}
      <div
        className="animate-float-orb absolute rounded-full pointer-events-none"
        style={{ width: 480, height: 480, top: '-120px', right: '-80px', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
      />
      <div
        className="animate-float-orb-2 absolute rounded-full pointer-events-none"
        style={{ width: 360, height: 360, bottom: '-80px', left: '-60px', background: 'radial-gradient(circle, rgba(212,175,55,0.10) 0%, transparent 70%)' }}
      />
      <div
        className="animate-float-orb-3 absolute rounded-full pointer-events-none"
        style={{ width: 280, height: 280, top: '30%', left: '40%', background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)' }}
      />

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top border glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-70" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 sm:py-24">

        {/* Badge */}
        <div
          data-animate
          className="animate-fade-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-8"
          style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          Est. 2025 · Clermont-Ferrand
        </div>

        {/* Main heading */}
        <h1
          data-animate
          className="animate-fade-in-up delay-100 font-display font-bold text-4xl sm:text-6xl leading-[1.1] mb-4"
        >
          <span className="text-slate-100">Clermont</span>
          <br />
          <span className="text-shimmer">Student Fund</span>
        </h1>

        {/* Subheading */}
        <p
          data-animate
          className="animate-fade-in-up delay-200 text-base sm:text-lg max-w-xl leading-relaxed mb-10"
          style={{ color: '#7A96B0' }}
        >
          Un fond d'investissement étudiant piloté par des passionnés de marchés financiers.
          On analyse, on débat, on investit — ensemble.
        </p>

        {/* CTAs */}
        <div data-animate className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center gap-3 mb-16">
          <a
            href="#portfolio"
            className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{ background: '#D4AF37', color: '#060d1a', boxShadow: '0 4px 20px rgba(212,175,55,0.3)' }}
          >
            Voir le portefeuille
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
            </svg>
          </a>
          <a
            href="#rejoindre"
            className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#E8EDF4', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Nous rejoindre
          </a>
        </div>

        {/* Stats bar */}
        <div
          data-animate
          className="animate-fade-in-up delay-400 w-full max-w-2xl grid grid-cols-3 gap-px rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {[
            { value: '$100K',         label: 'Capital initial' },
            { value: '10',            label: 'Actifs en portefeuille' },
            { value: 'Multi-actifs',  label: 'Stratégie' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center py-5 px-3" style={{ background: 'rgba(10,15,30,0.6)' }}>
              <span className="font-display font-bold text-xl sm:text-2xl text-slate-100">{value}</span>
              <span className="text-[10px] sm:text-xs mt-1 tracking-wide" style={{ color: '#4A6080' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
