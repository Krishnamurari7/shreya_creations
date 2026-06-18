/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Boutique palette: cream · orange-gold · ink
        ink: "var(--text)",
        wine: "var(--accent)",
        maroon: "var(--orange-dark)",
        ivory: "var(--cream)",
        cream: "var(--cream)",
        sand: "var(--sand)",
        surface: "var(--surface)",
        muted: "var(--surface-muted)",
        lavender: "var(--lavender)",
        orange: { DEFAULT: "#D48131", light: "#e8a05a", dark: "#b86a22" },
        golden: { DEFAULT: "#D48131", light: "#e8b86a", dark: "#a67c1e" },
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
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(1.08)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "border-flow": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        fadeUp: "fadeUp 0.8s ease-out both",
        spinslow: "spinslow 40s linear infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
        "slide-up": "slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "border-flow": "border-flow 5s ease infinite",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        glow: "0 0 40px rgba(212, 129, 49, 0.15), 0 0 80px rgba(212, 129, 49, 0.08)",
        lift: "var(--shadow-lift)",
        card: "var(--shadow-soft)",
      },
    },
  },
  plugins: [],
};
