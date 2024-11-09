import { defineConfig } from 'orval';

export default defineConfig({
    m_coach_web: {
        input: './swagger.json',
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
