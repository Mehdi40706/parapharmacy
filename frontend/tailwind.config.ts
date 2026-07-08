export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FBFAF6',
        ink: '#16231D',
        sage: {
          DEFAULT: '#3D6657',
          light: '#5C8A78',
          dark: '#2A4A3E',
        },
        honey: {
          DEFAULT: '#E2A854',
          dark: '#C98D3C',
        },
        clay: '#B4533F',
        mist: '#E8EDE9',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        pill: '999px',
      },
    },
  },
  plugins: [],
};
