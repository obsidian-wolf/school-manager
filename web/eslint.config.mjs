// eslint.config.js

import { FlatCompat } from '@eslint/eslintrc';

// Initialize FlatCompat to convert old-style ESLint configs to the new format
const compat = new FlatCompat();

export default compat.config({
	extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
	overrides: [
		{
			files: ['*.js', '*.mjs'],
			parser: 'espree',
			parserOptions: {
				ecmaVersion: 'latest',
			},
		},
	],
	rules: {
		'@next/next/no-img-element': 'off',
		'linebreak-style': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unused-vars': 'warn',
	},
});
