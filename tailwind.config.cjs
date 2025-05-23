// tailwind.config.cjs  (CommonJS so the build always loads it)
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    "text-brand",
    "bg-brand",
    "hover:bg-brand/90",
    "text-brand/60",
    "shadow-brand/30",
  ],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#FFFD91" },
      },
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