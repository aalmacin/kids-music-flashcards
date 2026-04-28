import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { display: ['Nunito', 'sans-serif'] },
      colors: {
        brand: { DEFAULT: '#7C3AED', light: '#A78BFA', dark: '#5B21B6' },
      },
    },
  },
} satisfies Config
