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
        'forest-green': '#063D20',
        'deep-green': '#0A512B',
        'sweet-orange': '#E95012',
        'golden-yellow': '#F5B51B',
        'warm-cream': '#FFF4DD',
        'cocoa-brown': '#3A1C10',
      },
      fontFamily: {
        tamil: ['Noto Sans Tamil', 'sans-serif'],
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'floatSlow 5s ease-in-out infinite',
        sparkle: 'sparkle 2s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
        'wp-pulse': 'wpPulse 2s infinite',
      },
    },
  },
  plugins: [],
};
