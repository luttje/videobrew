import { sveltekit } from '@sveltejs/kit/vite';
import { exec } from 'child_process';
import { defineConfig } from 'vite';
import util from 'util';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'run-package-scripts',
			async closeBundle() {
				await util.promisify(exec)('npm run package');
			}
		}
	],
	server: {
		port: 8080,
	},
});
