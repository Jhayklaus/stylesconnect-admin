import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // lib/ holds class-name lookup maps (statusTone.ts) that Tailwind must
    // scan, or only the tones that happen to also appear in components/ get
    // generated.
    "./lib/**/*.{js,ts}",
    "./hooks/**/*.{js,ts,tsx}",
  ],
  theme: {
    extend: {
      // Palette per figma-resources/brand/Overview/StyleConnect_Logo_Overview.pdf:
      // Beige #E8C5A5 (beige.base), Deep Brown #63322C (primary.base),
      // Charcoal Blue #313B44 (charcoal.base).
      colors: {
        primary: {
          base: "#63322c",
          light: "#7d4038",
          lighter: "#efebeb",
          darker: "#3c1f1b",
        },
        beige: {
          lighter: "#fdf9f6",
          base: "#e8c5a5",
        },
        yellow: {
          base: "#f2ae40",
          light: "#fbdfb1",
        },
        text: {
          900: "#140b0a",
          500: "#585251",
          300: "#c4c2c2",
          white: "#ffffff",
        },
        bg: {
          white: "#ffffff",
          soft: "#ecebeb",
        },
        charcoal: {
          darker: "#1e2429",
          base: "#313b44",
        },
        stroke: {
          soft: "#ecebeb",
          strong: "#140b0a",
        },

        // --- Admin additions (not in the consumer web app) ---
        // Semantic status scale for table/badge pills. The web app's Badge
        // leans on raw tailwind green-50/amber-50/red-50, which don't match
        // the admin Figma pills.
        status: {
          "success-bg": "#d1fadf",
          "success-fg": "#039855",
          "danger-bg": "#fee4e2",
          "danger-fg": "#f04438",
          "warning-bg": "#fef0c7",
          "warning-fg": "#f79009",
          "neutral-bg": "#f2f4f7",
          "neutral-fg": "#667085",
          "critical-bg": "#ffe4e8",
          "critical-fg": "#e31b54",
          "info-bg": "#eff4ff",
          "info-fg": "#3538cd",
        },
        // Revenue chart series.
        chart: {
          purple: "#7f56d9",
          amber: "#f2ae40",
        },
        // The admin shell: tinted rail against a white content column.
        sidebar: {
          bg: "#faf8f7",
          border: "#f0eceb",
        },
      },
      fontFamily: {
        jost: ["var(--font-jost)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        pill: "32px",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(20,11,10,0.06)",
        "pill-active": "0 1px 3px 0 rgba(20,11,10,0.10), 0 1px 2px -1px rgba(20,11,10,0.06)",
        popover: "0 12px 24px -6px rgba(20,11,10,0.12), 0 0 0 1px rgba(20,11,10,0.04)",
      },
      keyframes: {
        "bar-dance": {
          "0%, 100%": { transform: "scaleY(0.35)" },
          "50%":      { transform: "scaleY(1)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "toast-in": {
          from: { opacity: "0", transform: "translateY(-14px) scale(0.97)" },
          to:   { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to:   { transform: "translateX(0)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to:   { transform: "translateY(0)" },
        },
        "check-draw": {
          from: { strokeDashoffset: "24" },
          to:   { strokeDashoffset: "0" },
        },
      },
      animation: {
        "bar-dance": "bar-dance 1s ease-in-out infinite",
        // "both" fill so elements stay invisible until a delayed entrance starts.
        "fade-in": "fade-in 0.4s ease-out both",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "scale-in": "scale-in 0.3s cubic-bezier(0.16,1,0.3,1) both",
        "toast-in": "toast-in 0.35s cubic-bezier(0.16,1,0.3,1) both",
        "slide-in-right": "slide-in-right 0.4s cubic-bezier(0.32,0.72,0,1) both",
        "slide-up": "slide-up 0.4s cubic-bezier(0.32,0.72,0,1) both",
        "check-draw": "check-draw 0.45s ease-out 0.25s both",
      },
    },
  },
  plugins: [],
};
export default config;
