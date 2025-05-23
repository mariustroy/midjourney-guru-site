/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",                       // lock UI to dark theme
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {
	  colors: {
      brand: "#FFFD91",
    },
  } },
  corePlugins: {
    animation: true                        // keep animate‑bounce utilities
  },
  plugins: [require('@tailwindcss/typography')],
  plugins: [require("tailwindcss-animate")],
  animation: { "fade-in": "fadeIn .4s ease-out both" },
keyframes: { fadeIn: { from:{opacity:0}, to:{opacity:1} } },
};