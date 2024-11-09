module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
    ],
    settings: {
        react: {
            version: 'detect',
        },
    },
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh'],
    rules: {
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/button-has-type': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
    },
};
