/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Menjadikan Poppins sebagai font utama
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        // Menambahkan warna kustom BML
        'bml-blue': '#00529B',
        'bml-blue-dark': '#003d74',
      }
    },
  },
  plugins: [],
}
