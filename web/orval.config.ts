import { defineConfig } from 'orval';

export default defineConfig({
	school_manager: {
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
