const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.tsx", "index.html"],
  theme: {
    extend: {
      borderWidth: {
        5: "5px",
      },
      width: {
        21: "5.25rem",
      },
      fontFamily: {
        sans: ["Lato", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'item': '#353535',
        'blue-50': '#e6faff',
        'blue-100': '#b0efff',
        'blue-200': '#8ae7ff',
        'blue-300': '#54dcff',
        'blue-400': '#33d5ff',
        'blue-500': '#00cbff',
        'blue-600': '#00b9e8',
        'blue-700': '#0090b5',
        'blue-800': '#00708c',
        'blue-900': '#00556b',
        'real-blue': '#0364db',

        'grey-50': '#eaeaea',
        'grey-100': '#bdbdbd',
        'grey-200': '#9d9d9d',
        'grey-300': '#717171',
        'grey-400': '#555555',
        'grey-500': '#2b2b2b',
        'grey-600': '#272727',
        'grey-700': '#1f1f1f',
        'grey-800': '#181818',
        'grey-900': '#121212',

      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.white"),
          },
        },
      }),
      fill: (theme) => theme("colors"),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
