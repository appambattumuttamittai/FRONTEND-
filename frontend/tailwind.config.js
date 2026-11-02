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
        // New warm amber/brown palette
        'brand-dark': '#582A00',
        'brand-primary': '#C42F2C',
        'brand-amber': '#D97706',
        'brand-gold': '#F5B51B',
        'brand-bg': '#FFF8F0',
        'brand-cream': '#FFF4DD',
        'brand-text': '#3D1E08',
        // Legacy (kept for old order/admin pages that may still reference them)
        'forest-green': '#063D20',
        'deep-green': '#0A512B',
        'sweet-orange': '#E95012',
        'golden-yellow': '#F5B51B',
        'warm-cream': '#FFF4DD',
        'cocoa-brown': '#3A1C10',
      },
      fontFamily: {
        tamil: ['Noto Sans Tamil', 'sans-serif'],
        exo: ['Exo 2', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'wp-pulse': 'wpPulse 2s infinite',
        'marquee-left': 'marqueeLeft 28s linear infinite',
        'marquee-right': 'marqueeRight 28s linear infinite',
      },
    },
  },
  plugins: [],
};
