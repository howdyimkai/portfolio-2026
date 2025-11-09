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
          'terminal-bg': '#1E1E1E',
          'terminal-text': '#39FF14', // Cyberpunk green
        },
        fontFamily: {
          'mono': ['Courier New', 'monospace'],
        },
        animation: {
          'cursor-blink': 'blink 1s step-end infinite'
        },
        keyframes: {
          blink: {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0 }
          }
        }
      },
    },
    plugins: [],
  }