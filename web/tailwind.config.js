/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        flupp: {
          // Primary colors from existing brand
          sage: '#6B8E5A',
          brown: '#8B7355', 
          gold: '#A0845C',
          // Enhanced color palette with greens, teals, purples, and warm tones
          green: {
            50: '#f0f9ff',
            100: '#e0f2fe', 
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
          },
          teal: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6',
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
          },
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7c3aed',
            800: '#6b21a8',
            900: '#581c87',
          },
          warm: {
            50: '#fefdf8',
            100: '#fef7e0',
            200: '#fdecc8',
            300: '#fbd99a',
            400: '#f7c069',
            500: '#f39c12',
            600: '#d68910',
            700: '#b7791f',
            800: '#935d13',
            900: '#7d4f17',
          },
          // Neutral colors with warmth
          neutral: {
            50: '#fafaf9',
            100: '#f5f5f4',
            200: '#e7e5e4',
            300: '#d6d3d1',
            400: '#a8a29e',
            500: '#78716c',
            600: '#57534e',
            700: '#44403c',
            800: '#292524',
            900: '#1c1917',
          }
        },
        // Background gradients
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'flupp': '1rem',
        'flupp-lg': '1.5rem',
      },
      backgroundImage: {
        'flupp-gradient': 'linear-gradient(135deg, #6B8E5A 0%, #8B7355 50%, #A0845C 100%)',
        'flupp-warm': 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
        'flupp-cool': 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
        'flupp-purple': 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-gentle': 'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'flupp': '0 4px 20px -2px rgba(107, 142, 90, 0.15)',
        'flupp-lg': '0 10px 40px -4px rgba(107, 142, 90, 0.2)',
        'warm': '0 4px 20px -2px rgba(243, 156, 18, 0.15)',
        'cool': '0 4px 20px -2px rgba(20, 184, 166, 0.15)',
        'purple': '0 4px 20px -2px rgba(168, 85, 247, 0.15)',
      }
    },
  },
  plugins: [],
}

module.exports = config