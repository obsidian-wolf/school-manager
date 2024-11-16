import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
const config = {
    // TODO: must have prefix for all classes otherwise it will clash with other libraries
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,svg}'],
    theme: {},
    plugins: [typography, daisyui],
};

/** @type {import("tailwindcss").Config} */
export default {
    ...config,
};
