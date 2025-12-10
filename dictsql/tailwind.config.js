/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/index.html",
    "./src/renderer/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      background: "#09090b", // Zinc 950 (Más oscuro y elegante)
      surface: "#18181b",    // Zinc 900
      surfaceHighlight: "#27272a", // Zinc 800
      border: "#3f3f46",     // Zinc 700
      primary: "#3b82f6",    // Blue 500
      primaryHover: "#2563eb",
      textMain: "#f4f4f5",   // Zinc 100
      textMuted: "#a1a1aa",  // Zinc 400
    },
    animation: {
      'fade-in': 'fadeIn 0.3s ease-out',
      'slide-up': 'slideUp 0.4s ease-out',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      slideUp: {
        '0%': { transform: 'translateY(10px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      }
    }
  },
},
  plugins: [],
}