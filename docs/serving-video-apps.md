# 🔌 Serving your video app yourself

Videobrew needs to access your video app to preview and render it. In the [🚀 Quickstart](../README.md#quickstart) we let Videobrew serve our video app for us. But you can also serve your video app yourself. 

Serve your video app at `http://localhost:8080` and then preview and render it by running these respective commands:

```bash
$ videobrew preview http://localhost:8080

$ videobrew render http://localhost:8080
```

*⚠ If you are working with webpack or another HMR server, you will have to ensure this header is served: `Access-Control-Allow-Origin: *`. This is because Videobrew exposes your video app to the editor through a proxy (`/video`) and any `fetch` done will break [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) protection.*