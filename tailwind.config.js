/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {},
    fontFamily:{
      nunito:['Nunito', 'sans-serif'],
      khula:['Khula','sans-serif']
    }
  },
  plugins: [],
}
