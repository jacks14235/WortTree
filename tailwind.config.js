// tailwind.config.js
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'a': '#ff0000',
        'b': '#ff3b00',
        'c': '#ff7600',
        'd': '#ffb100',
        'e': '#ffeb00',
        'f': '#d8ff00',
        'g': '#9dff00',
        'h': '#62ff00',
        'i': '#27ff00',
        'j': '#00ff14',
        'k': '#00ff4e',
        'l': '#00ff89',
        'm': '#00ffc4',
        'n': '#00ffff',
        'o': '#00c4ff',
        'p': '#0089ff',
        'q': '#004eff',
        'r': '#0014ff',
        's': '#2700ff',
        't': '#6200ff',
        'u': '#9d00ff',
        'v': '#d800ff',
        'w': '#ff00eb',
        'x': '#ff00b1',
        'y': '#ff0076',
        'z': '#ff003b',
      }
    },
  },
  variants: {
    extend: {
      scale: ['group-hover'],
      translate: ['group-hover']
    },
  },
  plugins: [],
}