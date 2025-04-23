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
        'theme-l-2': '#FFFFBF',
        // 'theme-l-3': '#',
        // 'theme-l-4': '#',
        'theme-l-5': '#FFFF7F',
        'theme-l-6': '#FFFF66',
        'theme-l-7': '#FFFB4D',
        // 'theme-l-8': '#FFE133',
        // 'theme-l-9': '#FFC81A',
        'theme': '#FEAE00',
        'theme-d-9': '#E59500',
        'theme-d-8': '#CB7B00',
        'theme-d-7': '#B26200',
        // 'theme-d-6': '#',
        // 'theme-d-5': '#',
        'theme-d-4': '#7F2F00',
        // 'theme-d-3': '#',
        // 'theme-d-2': '#',

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
