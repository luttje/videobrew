import istanbul from 'vite-plugin-istanbul';
import { sveltekit } from '@sveltejs/kit/vite';
import { exec } from 'child_process';
import { defineConfig } from 'vite';
import util from 'util';
import fs from 'fs';
import path from 'path';

export default defineConfig({
	build: {
		sourcemap: true,
	},
	plugins: [
		sveltekit(),
		{
			name: 'run-package-scripts',
			async closeBundle() {
				if (fs.existsSync(path.resolve('dist')))
					await util.promisify(exec)('npm run package');
			}
		},
		istanbul({
			nycrcPath: path.resolve(__dirname, '.nycrc'),
      requireEnv: true,
		}),
	],
	server: {
		port: 8087,
	},
});
