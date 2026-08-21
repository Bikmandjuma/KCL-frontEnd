/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // All shades are driven by CSS variables (see index.css) so the
        // whole app can flip between the "coffee" (default) and "blue"
        // themes without touching a single component's className.
        espresso: {
          50: 'rgb(var(--c-50) / <alpha-value>)',
          100: 'rgb(var(--c-100) / <alpha-value>)',
          200: 'rgb(var(--c-200) / <alpha-value>)',
          300: 'rgb(var(--c-300) / <alpha-value>)',
          400: 'rgb(var(--c-400) / <alpha-value>)',
          500: 'rgb(var(--c-500) / <alpha-value>)',
          600: 'rgb(var(--c-600) / <alpha-value>)',
          700: 'rgb(var(--c-700) / <alpha-value>)',
          800: 'rgb(var(--c-800) / <alpha-value>)',
          900: 'rgb(var(--c-900) / <alpha-value>)',
          950: 'rgb(var(--c-950) / <alpha-value>)',
        },
        cream: {
          DEFAULT: 'rgb(var(--cream) / <alpha-value>)',
          light: 'rgb(var(--cream-light) / <alpha-value>)',
          dark: 'rgb(var(--cream-dark) / <alpha-value>)',
        },
        gold: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          dark: 'rgb(var(--accent-dark) / <alpha-value>)',
          light: 'rgb(var(--accent-light) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'ui-serif', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(var(--c-900), 0.25)',
        glow: '0 0 0 4px rgba(var(--accent), 0.25)',
      },
      backgroundImage: {
        'coffee-gradient': 'linear-gradient(135deg, rgb(var(--c-900)) 0%, rgb(var(--c-700)) 45%, rgb(var(--c-600)) 100%)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        steam: {
          '0%, 100%': { transform: 'translateY(0) scaleX(1)', opacity: 0.5 },
          '50%': { transform: 'translateY(-10px) scaleX(1.15)', opacity: 0.9 },
        },
        fadeSwap: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        fadeUp: 'fadeUp .6s ease forwards',
        steam: 'steam 3s ease-in-out infinite',
        fadeSwap: 'fadeSwap .5s ease forwards',
      },
    },
  },
  plugins: [],
}
