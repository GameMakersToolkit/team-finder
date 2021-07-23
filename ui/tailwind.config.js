const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require('tailwindcss/colors')

const primaryBright = "#00FFC0";
const primaryDark = "#14bd93";

module.exports = {
  mode: "jit",
  purge: ["./src/**/*.tsx", "index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      borderWidth: {
        5: "5px"
      },
      width: {
        21: "5.25rem"
      },
      fontFamily: {
        sans: ["Lato", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        gray: colors.trueGray,
        trueWhite: "#fff",
        white: "#f0f0f0",
        primary: {
          DEFAULT: primaryBright,
          bright: primaryBright,
          dark: primaryDark,
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.white"),
          },
        },
      }),
      fill: (theme) => theme('colors')
    },
  },
  variants: {
    extend: {
      fill: ['hover']
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
