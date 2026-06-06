/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Boutique palette: cream · deep purple · orange-gold · lavender
        ink: "#2d2438",
        wine: "#4A154B",
        maroon: "#3d1039",
        ivory: "#FFF9F0",
        cream: "#FFF9F0",
        sand: "#f5ebe0",
        surface: "#FFF9F0",
        muted: "#faf3e8",
        lavender: "#D1C4E9",
        orange: { DEFAULT: "#D48131", light: "#e8a05a", dark: "#b86a22" },
        golden: { DEFAULT: "#D48131", light: "#e8b86a", dark: "#a67c1e" },
        purple: { DEFAULT: "#4A154B", light: "#D1C4E9", dark: "#3d1039" },
        gold: "#c9a227",
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
