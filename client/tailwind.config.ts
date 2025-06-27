/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: "Roboto Mono, monospace"
    },
    extend: {
      height: {
        "screen-dvh": "100dvh",
        "100": "25rem",
        "112": "28rem",
        "128": "32rem",
        "144": "36rem",
        "160": "40rem",
        "192": "48rem"
      },
      width: {
        "100": "25rem",
        "112": "28rem",
        "128": "32rem",
        "144": "36rem",
        "160": "40rem",
        "192": "48rem"
      },
      boxShadow: {
        "inner-strong": "inset 0 4px 8px rgba(0, 0, 0, 0.25)", // plus profonde
        "inner-deep": "inset 0 6px 12px rgba(0, 0, 0, 0.35)" // encore plus visible
      },
      colors: {
        primary: "#9BC4BC",
        secondary: "#60B1DA",
        tertiary: "#F4EFE5"
      }
    }
  },
  plugins: []
};
