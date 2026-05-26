/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matcha: {
          light: '#72A549',
          DEFAULT: '#64973B',
          dark: '#5B8D32',
        },
        cerceta: {
          light: '#4BA0A5',
          DEFAULT: '#30898E',
        },
        acento: {
          morado: '#6E3B97',
          tierra: '#97403B', 
          'tierra-dark': '#781b16', // NUEVO: Un tinto más profundo para el hover de los rechazados
        },
        // Blanco con un tinte verde matcha extremadamente sutil
        fondo: '#F6FBF6', 
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], 
      },
      boxShadow: {
        // Sombra moderna: muy difuminada y elegante
        'suave': '0 10px 40px -10px rgba(48, 137, 142, 0.08)', 
      }
    },
  },
  plugins: [],
}