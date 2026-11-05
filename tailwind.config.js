/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf7ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        lavender: {
          50: '#fcfaff',
          100: '#f6f1fd',
          200: '#ebe0fa',
          300: '#dccef6',
          400: '#c3a7ee',
          500: '#a880e4',
          600: '#8e5ad6',
          700: '#7640bf',
          800: '#61349f',
          900: '#4f2c7f',
        },
        sidebar: {
          dark: '#140c24',
          card: '#1e1236',
          hover: '#2a1a4a',
          active: '#7c3aed',
          border: '#2e1c50'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(124, 58, 237, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'soft-hover': '0 12px 30px -4px rgba(124, 58, 237, 0.16), 0 4px 10px -2px rgba(0, 0, 0, 0.06)',
        'purple-glow': '0 0 25px rgba(168, 85, 247, 0.35)',
      }
    },
  },
  plugins: [],
}
