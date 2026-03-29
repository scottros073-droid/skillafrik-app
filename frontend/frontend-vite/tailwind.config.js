/** @type {import('tailwindcss').Config} */
module.exports = {
  // =====================================
  // File Scanning (JIT engine)
  // =====================================
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // covers components, pages, layouts automatically
  ],

  // =====================================
  // Dark Mode
  // =====================================
  darkMode: "class",

  // =====================================
  // Theme Customization
  // =====================================
  theme: {
    extend: {
      // -----------------------------
      // Colors (Design System)
      // -----------------------------
      colors: {
        primary: "#2563EB",
        "primary-dark": "#1E40AF",
        secondary: "#059669",
        accent: "#F59E0B",
        dark: "#1F2937",

        "bg-soft": "#f8fafc",
        "border-soft": "#e5e7eb",
        "text-dark": "#111827",
        "text-muted": "#6b7280",
      },

      // -----------------------------
      // Typography
      // -----------------------------
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },

      // -----------------------------
      // Animations
      // -----------------------------
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-80px)", opacity: "0" },
        },
      },

      animation: {
        "slide-in": "slide-in 0.3s ease-out",
        float: "float 2s ease-out forwards",
      },
    },
  },

  // =====================================
  // Plugins
  // =====================================
  plugins: [],
};