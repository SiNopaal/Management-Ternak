/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          50: '#f2f7f3',
          100: '#e1ede3',
          200: '#c5dec8',
          300: '#9bc6a1',
          400: '#6ca774',
          500: '#488951',
          600: '#346f3d',
          700: '#2a5832',
          800: '#23472a',
          900: '#1e3c24',
          950: '#0d2012',
        },
      },
    },
  },
  plugins: [],
}
