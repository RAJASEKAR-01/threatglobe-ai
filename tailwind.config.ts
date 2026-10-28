import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tg: {
          bg:      "#0E0E10",
          surface: "#17171A",
          border:  "#2A2A2E",
          text:    "#EDE9E3",
          muted:   "#8A8A90",
          accent:  "#FF5A36",
        },
      },
      fontFamily: {
        headline: ["'Instrument Serif'", "Georgia", "serif"],
        body:     ["Inter", "system-ui", "sans-serif"],
        data:     ["'JetBrains Mono'", "'Fira Code'", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "tg-grid": "linear-gradient(to right, rgba(42,42,46,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(42,42,46,0.4) 1px, transparent 1px)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
