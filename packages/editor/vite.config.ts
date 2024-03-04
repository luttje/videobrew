import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { configDefaults, type UserConfig as VitestConfig } from 'vitest/config';

const config: UserConfig & { test: VitestConfig['test'] } = {
	build: {
		sourcemap: true,
	},
	plugins: [
		sveltekit(),
	],
	server: {
		port: 8087,
	},
	define: {
    // Eliminate in-source test code
    'import.meta.vitest': 'undefined'
  },
	test: {
    environment: 'jsdom',
		includeSource: [
			'src/**/*.{js,ts,svelte}'
		],
    setupFiles: ['__tests__/setupVitest.ts'],
		coverage: {
			reportsDirectory: 'coverage/component',
			all: true,
			include: ['src/**/*.{js,ts,svelte}'],
      exclude: ['__tests__']
    },
		exclude: [
			...configDefaults.exclude,
			// Exclude playwright tests folder
			'__tests__/e2e',
		]
	}
};

export default config;
