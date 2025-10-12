/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        'sans': ['var(--font-poppins)', 'Poppins', 'sans-serif'],
      },
      colors: {
        'custom-brown': '#B6AE9F',
        'custom-gray': '#C5C7BC',
        'custom-light': '#DEDED1',
        'custom-cream': '#FBF3D1',
      },
    },
  },
  plugins: [],
}
