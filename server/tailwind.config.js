/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/templates/emails/**/*.html"],
  theme: {
    fontFamily: {
      patua: ['"Patua One"', "cursive"]
    },
    fontSize: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px",
      "5xl": "48px",
      "6xl": "60px",
      "7xl": "72px",
      "8xl": "96px",
      "9xl": "128px"
    },
    spacing: {
      0: "0px",
      0.5: "2px",
      1: "4px",
      1.5: "6px",
      2: "8px",
      2.5: "10px",
      3: "12px",
      3.5: "14px",
      4: "16px",
      5: "20px",
      6: "24px",
      7: "28px",
      8: "32px",
      9: "36px",
      10: "40px",
      11: "44px",
      12: "48px",
      14: "56px",
      16: "64px",
      20: "80px",
      24: "96px",
      28: "112px",
      32: "128px",
      36: "144px",
      40: "160px",
      44: "176px",
      48: "192px",
      52: "208px",
      56: "224px",
      60: "240px",
      64: "256px",
      72: "288px",
      80: "320px",
      96: "384px"
    },
    extend: {
      height: {
        "screen-dvh": "100dvh",
        100: "400px",
        112: "448px",
        128: "512px",
        144: "576px",
        160: "640px",
        192: "768px"
      },
      width: {
        100: "400px",
        112: "448px",
        128: "512px",
        144: "576px",
        160: "640px",
        192: "768px"
      },
      boxShadow: {
        "inner-strong": "inset 0 4px 8px rgba(0, 0, 0, 0.25)",
        "inner-deep": "inset 0 6px 12px rgba(0, 0, 0, 0.35)",
        right: "4px 0 25px rgba(0, 0, 0, 0.25)",
        "inner-sides":
          "inset 5px 0 3px -3px rgba(0, 0, 0, 0.3), inset -5px 0 3px -3px rgba(0, 0, 0, 0.3)"
      },
      colors: {
        primary: "#9BC4BC",
        secondary: "#60B1DA",
        tertiary: "#F4EFE5",
        textPrimary: "#060606bf"
      }
    }
  },
  plugins: []
};
