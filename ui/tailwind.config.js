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
        darkbg: colors.neutral["800"],
        lightbg: colors.gray["600"],
        'lightbg-highlight': colors.gray["500"],
        primary: colors.sky["400"],
        'primary-highlight': colors.sky["300"],
        accent1: colors.fuchsia["500"],
        accent2: colors.yellow["500"],
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
