/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        'Milliard-Thin': ['Milliard-Thin'],
        'Milliard-Medium': ['Milliard-Medium'],
        'Milliard-Heavy': ['Milliard-Heavy'],
        'Milliard-ExtraBold': ['Milliard-ExtraBold'],
      },
    },
  },
  plugins: [],
};
