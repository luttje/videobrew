const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.1a419551.js","imports":["_app/immutable/entry/start.1a419551.js","_app/immutable/chunks/index.b48e0a7e.js","_app/immutable/chunks/singletons.90f9d4b8.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.df219ff0.js","imports":["_app/immutable/entry/app.df219ff0.js","_app/immutable/chunks/index.b48e0a7e.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./chunks/0-408d1f79.js'),
			() => import('./chunks/1-c7eda23a.js'),
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
