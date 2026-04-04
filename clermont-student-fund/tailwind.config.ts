import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Navy scale (from brief: #0B1C2C)
        bg:          '#090F1A',
        'navy-950':  '#090F1A',
        'navy-900':  '#0B1C2C',
        'navy-800':  '#0F2235',
        'navy-700':  '#132B42',
        'navy-600':  '#1A3550',
        'navy-500':  '#224060',
        surface:     '#0F2235',
        'surface-2': '#132B42',
        'surface-3': '#1A3550',
        border:      '#1A3550',
        'border-2':  '#224060',
        // ── Gold (from brief: #D4AF37)
        gold:        '#D4AF37',
        'gold-light':'#E8C84A',
        'gold-dim':  '#A88B25',
        'gold-muted':'rgba(212,175,55,0.10)',
        // ── Semantic
        gain:        '#10B981',
        'gain-bg':   'rgba(16,185,129,0.08)',
        loss:        '#EF4444',
        'loss-bg':   'rgba(239,68,68,0.08)',
        accent:      '#3B82F6',
        crypto:      '#8B5CF6',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      maxWidth: {
        '8xl': '1280px',
      },
      borderRadius: {
        'xl':  '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'card':      '0 1px 4px rgba(0,0,0,0.5), 0 0 0 1px rgba(26,53,80,0.6)',
        'card-hover':'0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.2)',
        'gold-glow': '0 0 24px rgba(212,175,55,0.12)',
        'gold-sm':   '0 0 12px rgba(212,175,55,0.08)',
        'nav':       '0 1px 0 rgba(212,175,55,0.08)',
      },
      backgroundImage: {
        'gold-gradient':   'linear-gradient(135deg, #c9a840 0%, #e8c84a 45%, #d4af37 100%)',
        'navy-card':       'linear-gradient(160deg, #0F2235 0%, #0C1D2E 100%)',
        'header-gradient': 'linear-gradient(135deg, #0F2235 0%, #0B1C2C 100%)',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-up':    'fadeUp 0.4s ease-out both',
        'fade-up-d1': 'fadeUp 0.4s ease-out 0.05s both',
        'fade-up-d2': 'fadeUp 0.4s ease-out 0.10s both',
        'fade-up-d3': 'fadeUp 0.4s ease-out 0.15s both',
        'pulse-slow': 'pulse 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
