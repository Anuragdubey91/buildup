import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#f0f4fd",
          100: "#e0ebfa",
          200: "#c7dbf6",
          300: "#a1c3f0",
          400: "#74a3e7",
          500: "#4f81de",
          600: "#3664d0",
          700: "#2a4fb8",
          800: "#1e3778",
          900: "#0f172a", // Premium Navy
          950: "#080c18",
        },
        navy: {
          800: "#131d36",
          850: "#0f182e",
          900: "#0a1122",
          950: "#060913",
        },
        accent: {
          purple: "#7c3aed",
          violet: "#6366f1",
          cyan: "#06b6d4",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(15, 23, 42, 0.08)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        card: "0 2px 10px -1px rgba(15, 23, 42, 0.05), 0 1px 4px -1px rgba(15, 23, 42, 0.03)",
        elevated: "0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 10px 10px -5px rgba(15, 23, 42, 0.03)",
      },
    },
  },
  plugins: [],
};

export default config;
