/** @type {import('tailwindcss').Config} */
const defaultColors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',

  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      /* ---------- palette ---------- */
      colors: {
        ...defaultColors,
        brand: '#FFFD91',
      },

      /* ---------- custom font ---------- */
      fontFamily: {
        elanor: ['var(--font-elanor)', 'serif'],
      },
      fontWeight: {
        light:  '200',   // so font-light → 200
        medium: '400',   // so font-medium → 400
      },

      /* ---------- animations ---------- */
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
      },
      animation: {
        'fade-in': 'fadeIn .4s ease-out both',
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
};