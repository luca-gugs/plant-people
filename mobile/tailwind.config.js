/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        parchment: "#FBF8F3",
        botanical: "#3A4D39",
        ink: "#2C2C2C",
        water: "#507DBC",
        alert: "#A63D40",
        border: "#D9CFC0",
        "ink-faint": "#8A8579",
        "ink-muted": "#6B6560",
        selection: "#E8EFE1",
      },
    },
  },
  plugins: [],
};
