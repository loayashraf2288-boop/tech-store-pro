/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: '#00F0FF',
        dark: {
          DEFAULT: '#0B0E14',
          card: '#141A23',
          border: '#2A3441'
        }
      }
    },
  },
  plugins: [],
}
