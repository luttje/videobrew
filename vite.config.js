/** @type {import('vite').UserConfig} */
const config = {
	root: './src',
	server: {
		port: 8080,
		headers: {
			'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Embedder-Policy': 'require-corp'
		}
	},
	plugins: []
};

export default config;
