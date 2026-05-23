/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Tech-themed palette: terminal green + cyber cyan accents
        accent: {
          DEFAULT: '#22d3ee', // cyan-400
          soft: '#67e8f9',
          deep: '#0891b2',
        },
        terminal: {
          green: '#4ade80',
          amber: '#fbbf24',
          red: '#f87171',
        },
        ink: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(34 211 238 / 0.35), 0 8px 32px -8px rgb(34 211 238 / 0.35)',
      },
      keyframes: {
        blink: { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0 } },
        floaty: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        gridmove: {
          '0%':   { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
        floaty: 'floaty 4s ease-in-out infinite',
        gridmove: 'gridmove 20s linear infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
