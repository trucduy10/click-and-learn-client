module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "tw-primary": ["Rubik", "sans-serif;"],
        "tw-secondary": ["Poppins", "sans-serif;"],
        "tw-third": ["Roboto", "sans-serif;"],
      },
      colors: {
        "tw-primary": "#7366ff",
        "tw-danger": "#dc3545",
        "tw-warning": "#f8d62b",
        "tw-info": "#2cccff",
        "tw-success": "#51bb25",
        "tw-light": "#f4f4f4",
        "tw-dark": "#2c323f",
        "tw-light-pink": "#f62682",
        "tw-light-green": "#0be8ab",
        "tw-light-gray":"#adb3bd",
        "tw-orange": "#ff6651",
      },
      boxShadow: {
        primary: "10px 10px 20px rgba(218, 213, 213, 0.15)",
      },
    },
  },
  plugins: [],
};
