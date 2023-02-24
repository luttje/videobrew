import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { videobrew } from './src/vite/video-app-plugin';

export default defineConfig({
	plugins: [
		sveltekit(),
		videobrew(),
	],
	server: {
		port: 8080,
	},
});
