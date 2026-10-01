import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        bg: "var(--bg)",
        muted: "var(--mut)",
        tint: "var(--tint)",
        brand: { DEFAULT: "var(--g)", dark: "var(--g2)" },
        ember: "#F47A00",
      },
      fontFamily: {
        display: ["var(--font-clash)", "var(--font-grotesk)", "sans-serif"],
        grotesk: ["var(--font-grotesk)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: { soft: "0 30px 80px -40px rgba(6,113,56,.35)" },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        scrollcue: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down .2s ease-out",
        "accordion-up": "accordion-up .2s ease-out",
        float: "float 6s ease-in-out infinite",
        scrollcue: "scrollcue 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
