import { sveltekit } from '@sveltejs/kit/vite';
import { exec } from 'child_process';
import { defineConfig } from 'vite';
import util from 'util';
import fs from 'fs';
import path from 'path';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'run-package-scripts',
			async closeBundle() {
				if (fs.existsSync(path.resolve('dist')))
					await util.promisify(exec)('npm run package');
			}
		}
	],
	server: {
		port: 8087,
	},
});
