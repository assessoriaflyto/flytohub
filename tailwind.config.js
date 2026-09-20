/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        flyto: {
          lightBg: '#F6F8F7',
          lightSurface: '#FFFFFF',
          lightBorder: 'rgba(0, 0, 0, 0.07)',
          dark: '#070C0A',
          surface: '#0C1411',
          card: '#101B17',
          cardHover: '#14241E',
          border: '#1E352B',
          muted: '#768E85',
          green: {
            DEFAULT: '#277e1b',
            vibrant: '#2f9b20',
            neon: '#00C853',
            dark: '#1e6815',
            light: '#d8f7d3',
            glow: 'rgba(0, 200, 83, 0.2)'
          }
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'clean-card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'clean-hover': '0 12px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
        'neon-light': '0 0 16px -2px rgba(39, 126, 27, 0.25)',
        'neon-dark': '0 0 20px -2px rgba(0, 255, 102, 0.3)'
      },
      keyframes: {
        'energy-pulse': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' }
        },
        'beam-slow': {
          '0%': { left: '-120%' },
          '30%': { left: '180%' },
          '100%': { left: '180%' }
        }
      },
      animation: {
        'energy-pulse': 'energy-pulse 20s linear infinite',
        'beam-slow': 'beam-slow 7.5s cubic-bezier(0.4, 0, 0.2, 1) infinite'
      }
    },
  },
  plugins: [],
}
