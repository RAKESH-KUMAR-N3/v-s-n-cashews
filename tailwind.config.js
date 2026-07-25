/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          bg: '#0B132B',
          surface: '#1C2541',
          card: '#0F172A',
          slate: '#3A506B',
        },
        gold: {
          primary: '#D4AF37',
          light: '#F3E5AB',
          dark: '#AA7C11',
          accent: '#E5C158',
        },
      },
    },
  },
  plugins: [],
};
