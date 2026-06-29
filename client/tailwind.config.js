/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#2dd4bf",
          600: "#14b8a6",
        },
      },
    },
  },
  plugins: [],
};
