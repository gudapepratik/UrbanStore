/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['poppins', "sans-serif"],
        heebo: ['heebo','sans-serif'],
        openSans: ['opensans' ,'sans-serif'],
        Raleway: ['Raleway','sans-serif'],
        DMSans: ['DM Sans','sans-serif'],
        pathwayExtreme: ['Pathway Extreme'],
        ProtestStrike: ['Protest Strike'],
        SpicyRice: ['Spicy Rice'],
        outfit: ['outfit', 'open-sans'],
        powerGrotesk: ['Power Grotesk']
               // Add more custom font families as needed
      },
      spacing: {
        'response-box-h': '27rem',
        'responsive-box-w': '40rem',
        'input-box-w': '52rem',
        'mobile-sidebar-height': "56rem",
        'mobile-main-height': "54rem",
      },

      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOUt: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        infiniteSlider: {
          from: {transform: 'translateX(0)'},
          to: {transform: 'translateX(-100%)'},
        }
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out forwards',
        slideOut: 'slideOut 0.3s ease-out forwards',
        ['infinite-slider']: 'infiniteSlider 25s linear infinite',
      },
      maskImage: {
        'fade-right': 'linear-gradient(90deg, black 30%, transparent)',
      },
      WebkitMaskImage: {
        'fade-right': 'linear-gradient(90deg, black 30%, transparent)',
      },
      
      
    },
  },
  plugins: [
    // import('tailwindcss-animated')
		// ...
    require("tailwind-scrollbar-hide"),
    function ({ addUtilities }) {
      addUtilities({
        '.text-fade': {
          maxWidth: '100%',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          WebkitMaskImage: 'linear-gradient(90deg, black 90%, transparent)',
          maskImage: 'linear-gradient(90deg, black 85%, transparent)',
        },
      });
    },
	],
}

