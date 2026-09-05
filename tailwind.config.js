/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html'],
  theme: {
    container: {
      center: true,
      padding: '16px',
    },
    extend: {
      colors: {
        darkblack: '#23232b',
        darkblue: '#241a44',
        midblue: '#292a50',
        darkcyan: '#285b77',
        midcyan: '#0b959f',
        youngcyan: '#06cfce',
        primary: '#FCEE0A',
        cpyellow: '#FCEE0A',
        cpred: '#E5093F',
        cppink: '#FF2E63',
        cpcyan: '#00F0FF',
        cpblack: '#0B0B10',
        cporange: '#FF6B1A',
        phantomdark: '#B03A00',
        white: '#ececed',
        red: '#DF3F67',
        youngred: '#CF0033',
        darkred: '#6F0721',
        abstract: {}
      },
      screens: {
        '2xl': '1320px',
      }
    },
  },
  plugins: [],
}

