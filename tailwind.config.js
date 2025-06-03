/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
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
        orangeDark: '#FF6B00',
        gray: '#EBEDEF',
        themeDark: '#0D1117',
        themeTextDark: '#AAB0B6',
      },
      height: {
        580: '36.25rem'
      },
      backgroundImage: {
        videoMockup: 'url("/images/mockup-video.png")'
      }
    },
  },
  plugins: [],
};
