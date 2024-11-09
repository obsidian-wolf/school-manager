import { defineConfig } from 'orval';

export default defineConfig({
	prescribery: {
		input: './src/integrations/prescribery/doctalkgo/api-docs.json',
		output: {
			target: 'src/integrations/prescribery/doctalkgo/endpoints.ts',
			mode: 'split',
			schemas: 'src/api/model',
			client: 'react-query',
			prettier: true,
			override: {
				mutator: {
					path: 'src/integrations/prescribery/doctalkgo/custom_instance.ts',
					name: 'customInstance',
				},
			},
		},
		hooks: {
			afterAllFilesWrite: 'prettier --write',
		},
	},
});
