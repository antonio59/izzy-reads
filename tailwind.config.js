/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Nunito", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        accent: ["Fredoka", "system-ui", "sans-serif"],
      },
      colors: {
        /*
         * IZZY'S MAGICAL PALETTE
         * 5-color system with clear roles:
         * 1. Primary Berry - CTAs, active states, key links
         * 2. Accent Teal - badges, chips, secondary highlights
         * 3. Star Gold - ratings ONLY (keeps stars special)
         * 4. Cream - cozy paper background
         * 5. Stone - warm neutrals for text
         */

        // PRIMARY - Rich Berry (buttons, CTAs, active nav, key links)
        primary: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#D946A8", // Main berry
          600: "#be3590", // Hover - AA on white
          700: "#9d2d77", // Active/pressed
          800: "#831d5e",
          900: "#6b1a4a",
        },
        // ACCENT - Soft Teal (badges, chips, genre tags, secondary)
        accent: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#0D9488", // Main teal
          600: "#0a7a70", // Hover
          700: "#0f5e57",
          800: "#115e59",
          900: "#134e4a",
        },
        // STAR - Reserved for ratings only
        star: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
          muted: "#D4A012",
        },
        // CREAM - Cozy paper backgrounds
        cream: {
          50: "#FDFCFA",
          100: "#FBF8F3", // Main page bg
          200: "#F5F1EA", // Muted sections
          300: "#EDE7DB", // Borders
        },
        // STONE - Warm neutrals (text, borders)
        stone: {
          50: "#faf9f7",
          100: "#f5f3f0",
          200: "#e8e4df",
          300: "#d4cfc8",
          400: "#a39e96",
          500: "#736d65", // Body text - AA on cream
          600: "#5c564f",
          700: "#454039", // Headings - AAA on cream
          800: "#2d2925",
          900: "#1a1614",
        },
        // Success/Error (keep for forms)
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          500: "#22c55e",
          600: "#16a34a",
        },
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          500: "#ef4444",
          600: "#dc2626",
        },
        // Legacy color aliases (mapped to design system)
        iris: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#D946A8",
          600: "#be3590",
          700: "#9d2d77",
        },
        coral: {
          100: "#ffedd5",
          200: "#fed7aa",
          400: "#fb923c",
          500: "#f97316",
        },
        sage: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "subtle-float": "subtle-float 6s ease-in-out infinite",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "soft-md":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "soft-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        primary: "0 4px 14px rgba(168, 85, 247, 0.15)",
        accent: "0 4px 14px rgba(244, 63, 94, 0.15)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
