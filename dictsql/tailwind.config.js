/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/index.html",
    "./src/renderer/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a",
        surface: "#1e293b",
        border: "#334155",
        primary: "#3b82f6",
        secondary: "#64748b",
        success: "#22c55e",
      },
    },
  },
  plugins: [],
}