module.exports = {
  content: ["./src/**/*.{html,js,tsx,ts,css,scss,sass,less,styl}"],
  theme: {
    extend: {
      animation: {
        flip: 'flip 2s ease-in infinite',
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(180deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        spin: {
          'from': {
            transform: 'rotate(0deg)'
          },
          'to': {
            transform: 'rotate(360deg)'
          }
        }
      },
      filter: {
        'grayscale': 'grayscale(1)',
      },
      translate: {
        'center': 'transform: translate(-50%, -50%);',
      }
    },
  },
  plugins: [],
}