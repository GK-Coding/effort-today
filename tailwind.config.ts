import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/frontend/index.html',
    './app/frontend/src/**/*.{js,ts,jsx,tsx}',
    './app/frontend/components/**/*.{js,ts,jsx,tsx}',
    './app/views/**/*.{erb,haml,html,slim}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config
