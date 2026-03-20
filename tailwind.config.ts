import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{vue,ts,tsx,js,jsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
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
