/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      /* ---- brand colour with opacity support ---- */
      colors: {
        brand: {
          DEFAULT: "#FFFD91",          // plain hex gives text-brand / bg-brand
          50: "#FFFEE0",               // optional tints if you want
          100: "#FFFDBF",
          200: "#FFFB9F",
          300: "#FFF97E",
        },
      },

      /* ---- fade-in keyframe ---- */
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
      },
      animation: {
        "fade-in": "fadeIn .4s ease-out both",
      },
    },
  },

  /* plug-ins (merge the array, don’t duplicate the key) */
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};