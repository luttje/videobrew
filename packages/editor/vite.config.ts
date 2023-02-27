import { sveltekit } from '@sveltejs/kit/vite';
import { spawn } from 'child_process';
import { defineConfig } from 'vite';
import util from 'util';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'run-package-scripts',
			async closeBundle() {
				await util.promisify(spawn)('npm', ['run', 'package'], {
					stdio: 'inherit',
					shell: true
				});
			}
		}
	],
	server: {
		port: 8080,
	},
});
