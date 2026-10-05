import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#dcedff",
          200: "#b9dbff",
          300: "#8cc3ff",
          400: "#58a3ff",
          500: "#2f80ff",
          600: "#1b63e6",
          700: "#174fb8",
          800: "#164494",
          900: "#163c75",
        },
      },
    },
  },
  plugins: [],
};

export default config;
