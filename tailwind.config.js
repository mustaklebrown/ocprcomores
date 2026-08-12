/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        md: '2rem',
        lg: '2.5rem',
        xl: '3rem',
      },
    },
    extend: {
      maxWidth: {
        '7xl': '80rem',
      },
      colors: {
        ocpr: {
          green: {
            50: '#F0F9F3',
            100: '#DCEFE2',
            200: '#BCDFC6',
            300: '#94CBA3',
            400: '#64B27C',
            500: '#2A7B44', // Main OCPR Logo Green
            600: '#23693A',
            700: '#1D552F',
            800: '#236D3A',
            900: '#1E5E33', // Lighter vibrant dark green
            950: '#184E2A', // Lighter vibrant base green
          },
          gold: {
            50: '#FDFBF0',
            100: '#FAF3D7',
            200: '#F5E4A3',
            300: '#EECE6B',
            400: '#E7B83A',
            500: '#DAA520', // Main OCPR Vanilla Gold
            600: '#B8860B',
            700: '#936608',
            800: '#77500E',
            900: '#634212',
          },
          brown: {
            50: '#F9F6F3',
            100: '#EFEAE4',
            200: '#DDD3C7',
            300: '#C5B5A3',
            400: '#8E735B',
            500: '#523824', // Main OCPR Clove Brown
            600: '#47301E',
            700: '#3D2719',
            800: '#311F14',
            900: '#271910',
          },
          crimson: {
            50: '#FDF3F3',
            100: '#FBE4E5',
            500: '#8C2D32', // Main OCPR Red/Crimson Arc
            600: '#752428',
            700: '#5E1B1F',
          },
          indigo: {
            50: '#F4F4FA',
            100: '#E6E5F3',
            500: '#2E2A68', // Main OCPR Ocean Indigo Arc
            600: '#242054',
            700: '#1B1740',
          },
          cream: '#FAF8F3',
        },
        emerald: {
          950: '#184e2a',
          900: '#1e5e33',
          800: '#236d3a',
          700: '#23693a',
          600: '#2a7b44',
          500: '#3ea05d',
          400: '#64b27c',
          300: '#94cba3',
          200: '#bcdfc6',
          100: '#dcefe2',
          50: '#f0f9f3',
        },
        amber: {
          950: '#451a03',
          900: '#634212',
          800: '#77500e',
          700: '#936608',
          600: '#b8860b',
          500: '#daa520',
          400: '#e7b83a',
          300: '#eece6b',
          200: '#f5e4a3',
          100: '#faf3d7',
          50: '#fdfbf0',
        },
      },
      fontFamily: {
        heading: ['adelle-sans', 'Adelle Sans', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['adelle-sans', 'Adelle Sans', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        adelle: ['adelle-sans', 'Adelle Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
