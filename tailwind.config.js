/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-beige': '#F9F8F5',
        'brand-bg': '#f4f4f4',
        'brand-text': '#333333',
        'brand-accent': '#666666',
      },
      fontFamily: {
        'sans': ['var(--font-bricolage)', 'system-ui', 'sans-serif'],
        'mono': ['var(--font-commit-mono)', 'monospace'],
      },
      backgroundImage: {
        'dotted-pattern': 'linear-gradient(#f4f4f4 25px, transparent 25px), linear-gradient(90deg, #f4f4f4 25px, transparent 25px)'
      },
      backgroundSize: {
        'dot-grid': '50px 50px'
      }
    },
  },
  plugins: [],
}
