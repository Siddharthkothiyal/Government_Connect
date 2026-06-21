/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1d4ed8",
          green: "#15803d",
          softblue: "#eff6ff",
          softgreen: "#f0fdf4",
        },
      },
      borderRadius: { xl: "1rem", "2xl": "1.5rem" },
    },
  },
  plugins: [],
};
