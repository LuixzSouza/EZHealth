/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Se está usando src/
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        DarkBlue: '#002157',
        orange: '#F47127',
        gray: '#EBEDEF'
      },
      height: {
        580: '36.25rem'
      }
    },
  },
  plugins: [],
};
