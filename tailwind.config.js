/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Use class strategy for dark mode
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      // Instead of nested objects, define as direct color values
      colors: {
        'bg-light': '#ffffff',
        'bg-dark': '#0a0a0a',
        'fg-light': '#171717',
        'fg-dark': '#ededed',
      },
    },
  },
  plugins: [],
}
