import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { execSync } from 'child_process';

const commitHash = execSync('git rev-parse --short HEAD')?.toString();

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        'import.meta.env.M_COMMIT_HASH':
            commitHash && JSON.stringify(commitHash)?.replace(/\\n/g, ''),
    },
    plugins: [react(), svgr()],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                // Set the format to 'iife' (Immediately Invoked Function Expression)
                format: 'iife',
                // Set the name of the namespace to encapsulate your build
                name: 'ssc',
                entryFileNames: 'plugin.js',
                assetFileNames: 'plugin.css',
                chunkFileNames: 'chunk.js',
            },
        },
    },
});
