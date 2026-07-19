/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0b0f19",
        darkCard: "rgba(17, 24, 39, 0.65)",
      }
    },
  },
  plugins: [],
}
