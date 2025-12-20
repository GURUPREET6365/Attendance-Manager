/** @type { import('tailwindcss').Config} */

module.exports = {
  content: [
    "./templates/**/*.html",
    "./**/templates/**/*.html",
    "./**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        'global-bg': '#0f172a'
      }
    },
  },
  plugins: [],
}