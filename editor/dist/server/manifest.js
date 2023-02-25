const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.dcfb6876.js","imports":["_app/immutable/entry/start.dcfb6876.js","_app/immutable/chunks/index.54b4eb81.js","_app/immutable/chunks/singletons.f5968e03.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.bcc50745.js","imports":["_app/immutable/entry/app.bcc50745.js","_app/immutable/chunks/index.54b4eb81.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./chunks/0-cfcf7a87.js'),
			() => import('./chunks/1-531a2add.js'),
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
