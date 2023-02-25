# Serving your video app yourself

In the [Quickstart](../README.md#quickstart) we let Videobrew server your video app for you. But you can also serve it yourself.

If your served video app is running at `http://localhost:8080` then you can preview and render your video app by running these respective commands:

```bash
$ videobrew preview http://localhost:8080

$ videobrew render http://localhost:8080
```

Just make sure your server has [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) configured so the editor can access your video app. To do so set these headers for all requests:
  - `Cross-Origin-Embedder-Policy: require-corp` 
  - `Cross-Origin-Resource-Policy: cross-origin`
