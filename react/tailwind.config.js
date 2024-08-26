/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.{js,ts,jsx,tsx,html}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'decoration-orange-400': '#ff9900', // Adjust the color code accordingly
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
  purge: ['./src/**/*.html', './src/**/*.js', './src/**/*.jsx', './src/**/*.ts', './src/**/*.tsx'],
};
