/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: '#0000',
        secondary: {
          DEFAULT: "#f59e0b", // yellow-500
          light: "#fbbf24", // yellow-400
          dark: "#d97706", // yellow-600
        },
        accent: {
          DEFAULT: "#10b981", // emerald-500
          light: "#34d399", // emerald-400
          dark: "#059669", // emerald-600
        },
      },
    },
  },
  plugins: [],
};
