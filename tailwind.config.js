/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        /* The --*-rgb vars are comma-separated (`204, 79, 6`) because globals.css
           consumes them through legacy rgba(). Tailwind must use the same legacy
           form — `rgb(204, 79, 6 / 1)` is invalid CSS and drops the colour. */
        ink: "rgba(var(--text-rgb), <alpha-value>)",
        muted: "var(--text-muted)",
        subtle: "var(--text-subtle)",
        wine: "var(--accent)",
        maroon: "var(--orange-dark)",
        ivory: "var(--cream)",
        cream: "var(--cream)",
        sand: "var(--sand)",
        surface: "var(--surface)",
        lavender: "var(--lavender)",
        orange: {
          DEFAULT: "rgba(var(--orange-rgb), <alpha-value>)",
          light: "var(--orange-light)",
          dark: "var(--orange-dark)",
        },
        golden: {
          DEFAULT: "rgba(var(--golden-rgb), <alpha-value>)",
          light: "#E0C45A",
          dark: "#B8962E",
        },
        gold: "#D4AF37",
        green: { DEFAULT: "#004D2C", light: "#006B3D", dark: "#003820" },
        brand: {
          DEFAULT: "var(--home-brand, var(--orange))",
          dark: "var(--home-brand-dark, var(--orange-dark))",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        script: ["var(--font-brand-script)", "cursive"],
        "brand-serif": ["var(--font-brand-serif)", "Georgia", "serif"],
        "brand-hi": ["var(--font-brand-hi)", "serif"],
      },
      maxWidth: {
        page: "80rem",
      },
      spacing: {
        header: "var(--header-offset, 4.5rem)",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        spinslow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
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
        "btn-shine": {
          "0%": { left: "-130%" },
          "100%": { left: "160%" },
        },
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "sparkle-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(1.15)" },
        },
        "marquee-scroll": {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-50%,0,0)" },
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
        "rise-in": "rise-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "float-soft": "float-soft 6s ease-in-out infinite",
        "sparkle-pulse": "sparkle-pulse 2.8s ease-in-out infinite",
        "marquee-scroll": "marquee-scroll 25s linear infinite",
      },
      borderRadius: {
        card: "var(--radius-card, 15px)",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        glow: "0 0 40px rgba(var(--orange-rgb), 0.15), 0 0 80px rgba(var(--orange-rgb), 0.08)",
        lift: "var(--shadow-lift)",
        card: "var(--shadow-soft)",
      },
    },
  },
  plugins: [],
};
