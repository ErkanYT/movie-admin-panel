/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0A0A0F',
                surface: '#12121A',
                primary: '#A855F7', // Purple
                secondary: '#06B6D4', // Cyan
                accent: '#EC4899', // Pink
            },
            fontFamily: {
                sans: ['Montserrat', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
