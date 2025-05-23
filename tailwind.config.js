/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        kojima: {
          black: '#0a0a0c',
          darkgray: '#121214',
          gray: '#1e1e22',
          accent: '#e63946',
          highlight: '#f1faee',
          muted: '#6e6e76',
          blue: {
            DEFAULT: '#457b9d',
            light: '#a8dadc',
            dark: '#1d3557',
          },
        },
        apple: {
          dark: {
            bg: '#1c1c1e',
            card: '#2c2c2e',
            elevated: '#3a3a3c',
          },
          accent: {
            blue: '#0a84ff',
            indigo: '#5e5ce6',
            purple: '#bf5af2',
            pink: '#ff375f',
            red: '#ff453a',
            orange: '#ff9f0a',
            yellow: '#ffd60a',
            green: '#30d158',
            teal: '#64d2ff',
          },
          text: {
            primary: '#ffffff',
            secondary: '#ebebf5',
            tertiary: '#ebebf599',
            quaternary: '#ebebf566',
          },
        },
      },
      fontFamily: {
        sans: ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'kojima': '0 4px 30px rgba(0, 0, 0, 0.5)',
        'kojima-inner': 'inset 0 2px 10px rgba(0, 0, 0, 0.3)',
        'apple-dark': '0 4px 16px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'kojima-gradient': 'linear-gradient(135deg, #121214 0%, #1e1e22 100%)',
        'apple-dark-gradient': 'linear-gradient(180deg, #2c2c2e 0%, #1c1c1e 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(230, 57, 70, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(230, 57, 70, 0.8)' },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
