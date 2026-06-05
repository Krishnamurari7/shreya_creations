/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette: orange · cream · golden · purple (light theme)
        ink: "#1a1028",
        wine: "#2a1045",
        maroon: "#4c1d6e",
        ivory: "#faf6ee",
        cream: "#f4ebd0",
        sand: "#e8dcc8",
        surface: "#ffffff",
        muted: "#f7f4ef",
        orange: { DEFAULT: "#e65c00", light: "#ff9e42", dark: "#c2410c" },
        golden: { DEFAULT: "#d4af37", light: "#f5d78e", dark: "#a67c1e" },
        purple: { DEFAULT: "#8b5cf6", light: "#c4b5fd", dark: "#5b21b6" },
        gold: "#d4af37",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      keyframes: {
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        fadeUp: { "0%": { opacity: 0, transform: "translateY(24px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        spinslow: { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        fadeUp: "fadeUp 0.8s ease-out both",
        spinslow: "spinslow 40s linear infinite",
      },
    },
  },
  plugins: [],
};
