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
        brand: {
          50: '#f0f4fd',
          100: '#e0ebfb',
          200: '#c7daf7',
          300: '#9ec0f1',
          400: '#6d9ee8',
          500: '#437ade',
          600: '#2b5ec6',
          700: '#1e48a3',
          800: '#1c3d84',
          900: '#0f2452',
          950: '#0a1633',
        },
        navy: {
          800: '#0d1b2a',
          850: '#0b1622',
          900: '#08111d',
          950: '#050a12',
        },
        slate: {
          850: '#141e2e',
          900: '#0f172a',
          950: '#080d19',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(67, 122, 222, 0.25)',
        'glow-md': '0 0 25px -5px rgba(67, 122, 222, 0.35)',
        'card': '0 4px 20px -2px rgba(10, 22, 51, 0.08), 0 2px 6px -1px rgba(10, 22, 51, 0.04)',
        'card-dark': '0 4px 25px -2px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [],
}
