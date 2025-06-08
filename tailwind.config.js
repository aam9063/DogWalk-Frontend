/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        adlam: ['ADLaM Display', 'sans-serif'],
      },
      colors: {
        primary: '#3ea987',
        secondary: '#49caa1',
        accent: '#60a5fa',
        'dog-green': '#3ea987',
        'dog-light-green': '#49caa1',
        'dog-dark': '#1E1E1E',
        'dog-light': '#F5F5F5',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [], 
}