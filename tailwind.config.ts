import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Wired up via next/font CSS variables in src/app/layout.tsx
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        lab: {
          bg: "#050505",
          fg: "#e8e8ec",
          muted: "#6b7280",
          border: "rgba(255,255,255,0.08)",
          accent: "#38bdf8",
        },
        ink: {
          950: "#05060f",
          900: "#0a0c1c",
          800: "#101430",
        },
        gold: {
          400: "#FFD27A",
          500: "#F4B042",
          600: "#E8861E",
          700: "#C45A0E",
        },
      },
      // Strict 8px-based spacing scale used across sections, cards, stacks
      spacing: {
        "section-y": "6rem", // 96px vertical section padding (desktop)
        "section-x": "1.5rem", // 24px horizontal gutter (mobile baseline)
        "card-p": "1.75rem", // 28px card inner padding
        "stack-sm": "0.75rem",
        "stack-md": "1.25rem",
        "stack-lg": "2rem",
      },
      borderRadius: {
        card: "1.25rem",
      },
      boxShadow: {
        glass:
          "0 1px 0 0 rgba(255,255,255,0.06) inset, 0 20px 60px -20px rgba(2,6,23,0.6)",
      },
      backdropBlur: {
        glass: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
