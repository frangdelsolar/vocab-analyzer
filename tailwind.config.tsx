/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                // We list local system Kaiti fonts for compatibility
                kaiti: ['STKaiti', 'KaiTi', '楷体', 'serif'],
            },
            colors: {
                // Soft, paper-like colors for a scholarly feel
                ink: {
                    light: '#333333',
                    dark: '#f5f5f5',
                },
                paper: {
                    light: '#ffffff',
                    dark: '#121212',
                },
            },
        },
    },
    plugins: [],
};
