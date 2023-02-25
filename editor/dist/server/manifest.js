const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.98ca31c6.js","imports":["_app/immutable/entry/start.98ca31c6.js","_app/immutable/chunks/index.b48e0a7e.js","_app/immutable/chunks/singletons.67854253.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.d567c8e4.js","imports":["_app/immutable/entry/app.d567c8e4.js","_app/immutable/chunks/index.b48e0a7e.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./chunks/0-408d1f79.js'),
			() => import('./chunks/1-14725fee.js'),
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
