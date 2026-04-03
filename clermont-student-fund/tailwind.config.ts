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
        bg: '#0a0f1e',
        surface: '#0f1629',
        'surface-2': '#1a2444',
        border: '#1e2d4a',
        accent: '#3b82f6',
        gain: '#22c55e',
        loss: '#ef4444',
        gold: '#f59e0b',
        crypto: '#8b5cf6',
      },
    },
  },
  plugins: [],
}
export default config
