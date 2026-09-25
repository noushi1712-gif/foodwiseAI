/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#173F35',
          light: '#215347',
          dark: '#0f2b24',
        },
        emerald: {
          DEFAULT: '#2E7D5B',
          light: '#37926b',
          dark: '#246449',
        },
        sage: {
          DEFAULT: '#A8C3B0',
          light: '#c2d6c8',
          dark: '#8ea996',
        },
        ivory: {
          DEFAULT: '#F7F6F2',
          light: '#faf9f7',
          dark: '#eceae3',
        },
        charcoal: {
          DEFAULT: '#1F2933',
          light: '#323f4b',
          muted: '#52606d',
        },
        amber: {
          DEFAULT: '#D99A2B',
          light: '#e5ad45',
          dark: '#b57e1e',
        },
        terracotta: {
          DEFAULT: '#C96B4B',
          light: '#d68266',
          dark: '#aa5537',
        },
        mist: {
          DEFAULT: '#DDE5DF',
          light: '#eef2f0',
          dark: '#cad4cd',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card': '14px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(31, 41, 51, 0.04), 0 1px 2px 0 rgba(31, 41, 51, 0.02)',
        'card': '0 2px 6px -1px rgba(31, 41, 51, 0.05), 0 1px 4px -1px rgba(31, 41, 51, 0.03)',
      }
    },
  },
  plugins: [],
}
