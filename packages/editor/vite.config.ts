import istanbul from 'vite-plugin-istanbul';
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { configDefaults, type UserConfig as VitestConfig } from 'vitest/config';
import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';

const config: UserConfig & { test: VitestConfig['test'] } = {
	build: {
		sourcemap: true,
	},
	plugins: [
		sveltekit(),
		istanbul({
			nycrcPath: path.resolve(__dirname, '.nycrc'),
      requireEnv: true,
		}),
	],
	server: {
		port: 8087,
	},
	define: {
    // Eliminate in-source test code
    'import.meta.vitest': 'undefined'
  },
	test: {
    globals: true,
    environment: 'jsdom',
		includeSource: [
			'src/**/*.{js,ts,svelte}'
		],
    // Add @testing-library/jest-dom matchers & mocks of SvelteKit modules
    setupFiles: ['__tests__/setup-vitest.ts'],
		coverage: {
			provider: 'istanbul',
			reportsDirectory: 'coverage/component',
			all: true,
			include: ['src/**/*.{js,ts,svelte}'],
      exclude: ['__tests__']
    },
		exclude: [
			...configDefaults.exclude,
			// Exclude playwright tests folder
			'__tests__/e2e'
		]
	}
};

export default config;
