/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

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
      colors: {
        'primary': colors.pink[500],
        'secondary': colors.pink[600],
        'textInput': colors.slate[700],
      },
    },
  },
  plugins: [],
};
