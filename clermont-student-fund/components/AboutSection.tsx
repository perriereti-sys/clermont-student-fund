const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: '#3b82f6',
    title: 'Communauté étudiante',
    desc: 'Fondé à Clermont-Ferrand, le CSF accueille des étudiants de toute école et de toute ville. Si tu es passionné par les marchés financiers, tu as ta place ici.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    color: '#D4AF37',
    title: 'Portefeuille en conditions réelles',
    desc: 'On gère un portefeuille virtuel multi-actifs avec une vraie rigueur : thèses d\'investissement écrites, règles de gestion du risque, suivi de performance.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    color: '#a855f7',
    title: 'Montée en compétences',
    desc: 'Analyses fondamentales, macro-économie, lecture de bilans — chaque membre apporte ses connaissances pour que tout le groupe progresse.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    color: '#22c55e',
    title: 'Réactivité aux marchés',
    desc: 'Veille hebdomadaire, débats sur l\'actualité économique et ajustements du portefeuille au fil des opportunités de marché.',
  },
];

export default function AboutSection() {
  return (
    <section className="flex flex-col gap-12 py-6">

      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto">
        <p className="section-label mb-3" style={{ color: '#D4AF37' }}>Notre mission</p>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-100 leading-tight mb-4">
          Apprendre l'investissement<br />
          <span className="text-gold-gradient">par la pratique</span>
        </h2>
        <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#6B84A0' }}>
          Le CSF n'est pas un cours magistral — c'est un laboratoire d'investissement.
          On prend de vraies décisions, on se trompe, on apprend, et on s'améliore.
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map(({ icon, color, title, desc }) => (
          <div
            key={title}
            className="glass-card group p-6 flex gap-4 transition-all duration-300"
          >
            <div
              className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{ background: `${color}18`, color }}
            >
              {icon}
            </div>
            <div>
              <p className="font-semibold text-slate-100 text-sm mb-1.5">{title}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#6B84A0' }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
