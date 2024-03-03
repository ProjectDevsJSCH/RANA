module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        main200: '#ceebc7',
        main400: '#78c167',
        main500: '#55a542',
        main600: '#428732',
        main700: '#366b2a',
        main950: '#11260d',
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
