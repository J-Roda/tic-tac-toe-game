/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Orbitron"', 'monospace'],
        body: ['"Share Tech Mono"', 'monospace'],
      },
      colors: {
        neon: {
          cyan: '#00f5ff',
          pink: '#ff006e',
          yellow: '#ffbe0b',
          green: '#06ffa5',
          purple: '#8338ec',
        },
        void: {
          900: '#020408',
          800: '#060d14',
          700: '#0a1628',
          600: '#0f2040',
          500: '#162b55',
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 10px #00f5ff, 0 0 30px #00f5ff40, 0 0 60px #00f5ff20',
        'neon-pink': '0 0 10px #ff006e, 0 0 30px #ff006e40, 0 0 60px #ff006e20',
        'neon-yellow': '0 0 10px #ffbe0b, 0 0 30px #ffbe0b40',
        'neon-green': '0 0 10px #06ffa5, 0 0 30px #06ffa540',
        'neon-purple': '0 0 10px #8338ec, 0 0 30px #8338ec40',
        'cell': 'inset 0 0 20px rgba(0,245,255,0.05), 0 0 0 1px rgba(0,245,255,0.15)',
        'cell-hover': 'inset 0 0 30px rgba(0,245,255,0.1), 0 0 0 1px rgba(0,245,255,0.4), 0 0 20px rgba(0,245,255,0.2)',
        'cell-x': 'inset 0 0 30px rgba(255,0,110,0.15), 0 0 0 1px rgba(255,0,110,0.6), 0 0 25px rgba(255,0,110,0.3)',
        'cell-o': 'inset 0 0 30px rgba(0,245,255,0.15), 0 0 0 1px rgba(0,245,255,0.6), 0 0 25px rgba(0,245,255,0.3)',
      },
      animation: {
        'flicker': 'flicker 3s infinite',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'scan': 'scan 8s linear infinite',
        'pop-in': 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'win-flash': 'winFlash 0.5s ease-in-out 3',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'glitch': 'glitch 0.3s ease-in-out',
        'float': 'float 4s ease-in-out infinite',
        'grid-fade': 'gridFade 1s ease-out forwards',
      },
      keyframes: {
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.6' },
        },
        pulseNeon: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        popIn: {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        winFlash: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-3px, 2px)' },
          '40%': { transform: 'translate(3px, -2px)' },
          '60%': { transform: 'translate(-2px, 0)' },
          '80%': { transform: 'translate(2px, 1px)' },
          '100%': { transform: 'translate(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        gridFade: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
