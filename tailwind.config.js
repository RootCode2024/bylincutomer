/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          800: '#0066bf',
          700: '#005cac'
        },
      },
    },
  },
  plugins: [],
}
