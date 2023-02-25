import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		emptyOutDir: true,
	},
	plugins: [
		sveltekit(),
	],
	server: {
		port: 8080,
	},
});
