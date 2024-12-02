import { defineConfig } from 'orval';

export default defineConfig({
    pam_api: {
        input: './swagger.json',
        output: {
            target: 'src/pam_api/endpoints.ts',
            mode: 'split',
            schemas: 'src/pam_api/model',
            client: 'react-query',
            prettier: true,
            override: {
                mutator: {
                    path: 'src/pam_api/custom_instance.ts',
                    name: 'customInstance',
                },
            },
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
    api: {
        input: './swagger2.json',
        output: {
            target: 'src/api/endpoints.ts',
            mode: 'split',
            schemas: 'src/api/model',
            client: 'react-query',
            prettier: true,
            override: {
                mutator: {
                    path: 'src/api/custom_instance.ts',
                    name: 'customInstance',
                },
            },
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    },
});
