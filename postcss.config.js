// postcss.config.js  (CommonJS)
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},  // ← new Tailwind PostCSS plugin
    autoprefixer: {},            // ← keep autoprefixer
  },
};