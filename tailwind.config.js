/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  /* 1 – include both /src and /pages */
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    /* 2 – put the colour in extend and as an object so /opacity works */
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FFFD91",    // text-brand, bg-brand
        },
      },

      /* 3 – fade-in keyframe */
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
      },
      animation: {
        "fade-in": "fadeIn .4s ease-out both",
      },
    },
  },

  /* 4 – one plugins array (no duplicate keys) */
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};