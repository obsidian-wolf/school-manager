import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				body: '#333',
				classic: '#f9f8f4',
				primary: '#FA5B4C',
				secondary: '#079393',
			},
			fontFamily: {
				lora: ['var(--font-lora)'],
				montserrat: ['var(--font-montserrat)'],
				baskerville: ['var(--font-baskerville)'],
			},
		},
	},
	plugins: [],
};
export default config;
