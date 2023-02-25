const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","tests/pure-html/index.html","tests/pure-html/script.js","tests/pure-html/style.css"]),
	mimeTypes: {".png":"image/png",".html":"text/html",".js":"application/javascript",".css":"text/css"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.bc2b963b.js","imports":["_app/immutable/entry/start.bc2b963b.js","_app/immutable/chunks/index.b48e0a7e.js","_app/immutable/chunks/singletons.86daaef3.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.b4a7168d.js","imports":["_app/immutable/entry/app.b4a7168d.js","_app/immutable/chunks/index.b48e0a7e.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./chunks/0-408d1f79.js'),
			() => import('./chunks/1-9f53ec1d.js'),
			() => import('./chunks/2-b5f6e393.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};

const prerendered = new Set([]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
