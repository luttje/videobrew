const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.e91ae57b.js","imports":["_app/immutable/entry/start.e91ae57b.js","_app/immutable/chunks/index.54b4eb81.js","_app/immutable/chunks/singletons.0770b4a3.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.015f23f0.js","imports":["_app/immutable/entry/app.015f23f0.js","_app/immutable/chunks/index.54b4eb81.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./chunks/0-cfcf7a87.js'),
			() => import('./chunks/1-bf322c79.js'),
			() => import('./chunks/2-ea7cb8f5.js')
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
