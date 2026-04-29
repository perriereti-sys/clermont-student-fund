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
        bg:          '#F0F2F8',
        surface:     '#FFFFFF',
        'surface-2': '#F7F8FC',
        'surface-3': '#EEF0F7',
        border:      'rgba(26,37,64,0.1)',
        'border-2':  'rgba(26,37,64,0.15)',
        navy:        '#1A2540',
        'navy-700':  '#263254',
        'navy-500':  '#3D5073',
        'navy-400':  '#5C6E8A',
        'navy-300':  '#8496B2',
        'navy-200':  '#B4BFCE',
        gold:        '#B8963A',
        'gold-light':'#D4AF37',
        'gold-dim':  '#8A7029',
        'gold-muted':'rgba(184,150,58,0.10)',
        gain:        '#0A8E62',
        'gain-bg':   'rgba(10,142,98,0.08)',
        loss:        '#C93048',
        'loss-bg':   'rgba(201,48,72,0.08)',
        accent:      '#2563EB',
        crypto:      '#7C3AED',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'Menlo', 'monospace'],
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
        'card':      '0 1px 3px rgba(26,37,64,0.06), 0 0 0 1px rgba(26,37,64,0.07)',
        'card-hover':'0 6px 24px rgba(26,37,64,0.10), 0 0 0 1px rgba(184,150,58,0.20)',
        'gold-glow': '0 0 24px rgba(184,150,58,0.14)',
        'nav':       '0 1px 0 rgba(26,37,64,0.07)',
        'input':     '0 0 0 3px rgba(184,150,58,0.12)',
      },
      backgroundImage: {
        'gold-gradient':   'linear-gradient(135deg, #B8963A 0%, #D4AF37 50%, #B8963A 100%)',
        'hero-gradient':   'linear-gradient(135deg, #F7F8FC 0%, #EFF1F9 100%)',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up':    'fadeUp 0.4s ease-out both',
        'fade-up-d1': 'fadeUp 0.4s ease-out 0.05s both',
        'fade-up-d2': 'fadeUp 0.4s ease-out 0.10s both',
        'fade-up-d3': 'fadeUp 0.4s ease-out 0.15s both',
        'scale-in':   'scaleIn 0.35s ease-out both',
        'pulse-slow': 'pulse 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
