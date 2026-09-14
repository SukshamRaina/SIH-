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
        dark: {
          950: '#070a0f',
          900: '#0b0f17',
          850: '#111723',
          800: '#172030',
          750: '#1e293b',
          700: '#2d3b53',
          600: '#475569',
        },
        hotspot: {
          industrial: '#ef4444',
          persistent: '#f97316',
          wildfire: '#eab308',
          agricultural: '#84cc16',
          other: '#94a3b8',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'glow-red': 'glowRed 2s infinite alternate',
        'glow-orange': 'glowOrange 2s infinite alternate',
      },
      keyframes: {
        glowRed: {
          '0%': { boxShadow: '0 0 5px rgba(239, 68, 68, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(239, 68, 68, 0.9), 0 0 30px rgba(239, 68, 68, 0.4)' }
        },
        glowOrange: {
          '0%': { boxShadow: '0 0 5px rgba(249, 115, 22, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(249, 115, 22, 0.9)' }
        }
      }
    },
  },
  plugins: [],
}
