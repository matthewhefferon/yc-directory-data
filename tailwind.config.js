/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "yc-bg": "#f5f5ee",
        "yc-orange": "#f16832",
        "yc-orange-hover": "#e55a2b",
        "yc-orange-active": "#d94d24",
      },
    },
  },
  plugins: [],
};
