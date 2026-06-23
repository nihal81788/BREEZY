/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-alt': 'var(--bg-alt)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        border: 'var(--card-border)',
        'card-bg': 'var(--card-bg)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      boxShadow: {
        '3d': 'var(--shadow-3d)',
        '3d-hover': 'var(--shadow-3d-hover)',
        '3d-inset': 'var(--shadow-3d-inset)',
      },
      borderRadius: {
        '3d': 'var(--radius-3d)',
      }
    },
  },
  plugins: [],
}
