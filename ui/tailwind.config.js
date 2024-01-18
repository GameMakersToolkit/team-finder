const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx", "index.html"],
  theme: {
    // TODO: Strip this down again
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
        'theme-l-2': '#ffd6e1',
        'theme-l-3': '#ffbdc8',
        'theme-l-4': '#ffa3ae',
        'theme-l-5': '#ff8994',
        'theme-l-6': '#ff707b',
        'theme-l-7': '#ff5762',
        'theme-l-8': '#ff3d48',
        'theme-l-9': '#f5242f',
        'theme': '#db0a15',
        'theme-d-9': '#c20000',
        'theme-d-8': '#a80000',
        'theme-d-7': '#8f0000',
        'theme-d-6': '#750000',
        'theme-d-5': '#5c0000',
        'theme-d-4': '#420000',
        'theme-d-3': '#290000',
        'theme-d-2': '#0f0000',

        'grey-50': '#eaeaea',
        'grey-200': '#9d9d9d',
        'grey-300': '#717171',
        'grey-500': '#2b2b2b',
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
