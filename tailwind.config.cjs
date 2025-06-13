/** @type {import('tailwindcss').Config} */
const defaultColors = require("tailwindcss/colors");

module.exports = {
  darkMode: "class",

  // Tell Tailwind where to look for class names
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",   // add if you use /app
  ],

  /* ---------------- palette ---------------- */
  theme: {
    colors: {
      ...defaultColors,       // keep all Tailwind built-ins
      brand: "#FFFD91",       // ← your yellow; bg-brand, text-brand, etc.
    },

    /* -------- anything else goes here -------- */
    extend: {
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
      },
      animation: {
        "fade-in": "fadeIn .4s ease-out both",
      },
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        elanor: ['var(--font-elanor)', 'serif'],
      },
    },
  },
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
};