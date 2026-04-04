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
        bg: '#080d1a',
        surface: '#0d1425',
        'surface-2': '#141e33',
        'surface-3': '#1a2640',
        border: '#1c2b42',
        'border-light': '#243450',
        accent: '#3b82f6',
        gain: '#22c55e',
        loss: '#ef4444',
        // CSF Brand gold (from logo)
        gold: '#c9a84c',
        'gold-light': '#e4c06a',
        'gold-dim': '#9a7a32',
        'gold-muted': 'rgba(201,168,76,0.12)',
        crypto: '#8b5cf6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'gold-sm': '0 0 0 1px rgba(201,168,76,0.3)',
        'gold-md': '0 0 20px rgba(201,168,76,0.08)',
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #c9a84c 0%, #e4c06a 50%, #c9a84c 100%)',
        'card-gradient': 'linear-gradient(180deg, #0d1425 0%, #0b1120 100%)',
        'header-gradient': 'linear-gradient(135deg, #0d1425 0%, #0f1930 50%, #0d1425 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
