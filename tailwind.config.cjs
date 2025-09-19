/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        midnight: '#050B27',
        aurora: '#00D4FF',
        ember: '#FF6F61',
        moss: '#2ED47A',
        sunshine: '#FFD166',
      },
      boxShadow: {
        glow: '0 0 25px rgba(0, 212, 255, 0.35)',
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
};
