/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#161B33',
        surface: '#20264A',
        surfacealt: '#2A3160',
        gold: '#E4A84E',
        rose: '#E1685C',
        parchment: '#F3F0E7',
        muted: '#98A0C7',
        sage: '#8FBF9F',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
