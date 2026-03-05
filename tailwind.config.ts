import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--app-primary-rgb) / <alpha-value>)'
      }
    }
  },
  plugins: []
} satisfies Config
