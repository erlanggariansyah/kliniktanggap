/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          red: '#D32F2F',
        },
        secondary: {
          white: '#FFFFFF',
        },
        accent: {
          gray: {
            light: '#F5F5F5',
            dark: '#757575',
          }
        }
      },
      fontFamily: {
        primary: ['Inter', 'sans-serif'],
        secondary: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}