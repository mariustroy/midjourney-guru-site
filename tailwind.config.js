/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  corePlugins: {
    animation: true     // ensure animate‑bounce utilities exist
  },
  plugins: [],
};
