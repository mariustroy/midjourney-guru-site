/** @type {import('tailwindcss').Config} */
const defaultColors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',

  /* where Tailwind should scan */
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    /* keep default palette + your brand yellow */
    colors: {
      ...defaultColors,
      brand: '#FFFD91',
    },

    extend: {
      /* custom font family ← the important line */
      fontFamily: {
        elanor: ['var(--font-elanor)', 'serif'],
      },

      /* animations you already had */
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