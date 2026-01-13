import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
        arial: ["Arial", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        abhaya: ["Abhaya Libre", "sans-serif"],
        marcellus: ["Marcellus", "sans-serif"],
      },
      colors: {
        black: "#000",
        title: "#121212",

        // Match Ant Design tokens
        primary: {
          DEFAULT: "#00B2D8", // Blue
          dark: "#0092B3",
          light: "#33C7E2",
        },
        secondary: {
          DEFAULT: "#2E2E2E", // Blue
          dark: "#2E2E2E",
          light: "#2E2E2E",
        },
        success: {
          DEFAULT: "#3ECF8E", // Green
          dark: "#158562",
          light: "#44C998",
        },
        warning: {
          DEFAULT: "#FAAD14", // Orange/Yellow
          dark: "#D48806",
          light: "#FFD666",
        },
        danger: {
          DEFAULT: "#FF6B6B", // Red
          dark: "#D9363E",
          light: "#FF7875",
        },

        tomato: "#FF6B6B",
        "gray-light": "#f1f1f1",
        "light-green": "#3ECF8E",
        "light-orange": "#FFF4E9",

        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        xs: "540px",
      },
      container: {
        padding: "20px",
        center: true,
        screens: {
          DEFAULT: "1600px",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
