/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'fun': ['Fredoka', 'Comic Neue', 'sans-serif'],
        'comic': ['Comic Neue', 'cursive'],
      },
      colors: {
        primary: {
          DEFAULT: '#9333ea',
          dark: '#7e22ce',
        },
        candy: {
          pink: '#ff6b9d',
          purple: '#c084fc',
          blue: '#60a5fa',
          mint: '#34d399',
          yellow: '#fbbf24',
          orange: '#fb923c',
          coral: '#f87171',
        },
        magic: {
          light: '#fdf4ff',
          sparkle: '#f5d0fe',
          glow: '#e879f9',
          deep: '#a855f7',
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'star-spin': 'star-spin 4s linear infinite',
        'twinkle': 'twinkle 1.5s ease-in-out infinite',
        'heart-beat': 'heart-beat 1s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'pop': 'pop 0.3s ease-out',
        'confetti': 'confetti-fall 3s linear forwards',
      },
      boxShadow: {
        'magical': '0 10px 40px -10px rgba(168, 85, 247, 0.5)',
        'candy': '0 10px 40px -10px rgba(236, 72, 153, 0.5)',
        'rainbow': '0 0 20px rgba(236, 72, 153, 0.3), 0 0 40px rgba(168, 85, 247, 0.2), 0 0 60px rgba(96, 165, 250, 0.1)',
      },
      backgroundImage: {
        'rainbow-gradient': 'linear-gradient(90deg, #ff6b9d, #c084fc, #60a5fa, #34d399, #fbbf24)',
        'candy-gradient': 'linear-gradient(135deg, #ff6b9d 0%, #c084fc 50%, #60a5fa 100%)',
        'magic-gradient': 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 25%, #e0f2fe 50%, #fef3c7 75%, #fce7f3 100%)',
        'sparkle-gradient': 'linear-gradient(135deg, #f5d0fe 0%, #fbcfe8 50%, #fce7f3 100%)',
      },
      borderRadius: {
        'blob': '60% 40% 30% 70% / 60% 30% 70% 40%',
      }
    },
  },
  plugins: [],
}
