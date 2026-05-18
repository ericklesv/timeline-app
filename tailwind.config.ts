import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0f1115",
          soft: "#13161c",
          card: "#181b22",
          elev: "#1f232c",
        },
        line: "#262a33",
        accent: {
          DEFAULT: "#6C63FF",
          soft: "#8a82ff",
          glow: "rgba(108, 99, 255, 0.35)",
        },
        text: {
          DEFAULT: "#F5F7FA",
          dim: "#9BA3AF",
          mute: "#6b7280",
        },
        danger: "#ef4444",
        warn: "#f59e0b",
        ok: "#22c55e",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
        "3xl": "24px",
      },
      boxShadow: {
        soft: "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.35)",
        glow: "0 0 0 1px rgba(108,99,255,0.35), 0 8px 32px rgba(108,99,255,0.22)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(108,99,255,0.0)" },
          "50%": { boxShadow: "0 0 0 6px rgba(108,99,255,0.15)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 2.8s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
