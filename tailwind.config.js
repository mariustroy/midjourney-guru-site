/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",                       // lock UI to dark theme
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  corePlugins: {
    animation: true                        // keep animate‑bounce utilities
  },
  plugins: [require('@tailwindcss/typography')],
  plugins: [require("tailwindcss-animate")],
};