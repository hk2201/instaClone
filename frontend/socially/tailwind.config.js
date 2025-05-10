/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        cursive: ['"Dancing Script"', "cursive"],
      },
      colors: {
        // Custom colors for your theme
        primary: {
          light: "#3b82f6", // blue-500
          dark: "#60a5fa", // blue-400
        },
        background: {
          light: "#ffffff",
          dark: "#111827", // gray-900
        },
        card: {
          light: "#ffffff",
          dark: "#1f2937", // gray-800
        },
        input: {
          light: "#f3f4f6", // gray-100
          dark: "#374151", // gray-700
        },
        text: {
          primary: {
            light: "#111827", // gray-900
            dark: "#f9fafb", // gray-50
          },
          secondary: {
            light: "#4b5563", // gray-600
            dark: "#9ca3af", // gray-400
          },
        },
      },
    },
  },
  plugins: [],
};
