import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{vue,ts,tsx,js,jsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 4px 32px 0 rgba(0, 0, 0, 0.04)",
        "soft-sm": "0 2px 12px 0 rgba(0, 0, 0, 0.03)",
        "soft-lg": "0 8px 40px 0 rgba(0, 0, 0, 0.06)",
      },
      colors: {
        primary: "rgb(var(--app-primary-rgb) / <alpha-value>)",
        app: {
          bg: {
            DEFAULT: "var(--app-bg)",
            mute: "var(--app-bg-mute)",
          },
          surface: "var(--app-surface)",
          sidebar: {
            bg: "var(--app-sidebar-bg)",
            hover: "var(--app-sidebar-bg-hover)",
            text: "var(--app-sidebar-text)",
            active: "var(--app-sidebar-text-active)",
          },
          text: {
            primary: "var(--app-text-primary)",
            secondary: "var(--app-text-secondary)",
            disabled: "var(--app-text-disabled)",
          },
          border: "var(--app-border)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
