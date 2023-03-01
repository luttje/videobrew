# 🔌 Serving your video app yourself

Videobrew needs to access your video app to preview and render it. In the [🚀 Quickstart](../README.md#quickstart) we let Videobrew serve our video app for us. But you can also serve your video app yourself. 

Serve your video app at `http://localhost:8080` and then preview and render it by running these respective commands:

```bash
$ videobrew preview http://localhost:8080

$ videobrew render http://localhost:8080
```

> ## ⚠ <u>Insecure</u> [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) headers required
> In order for the editor to access your video app you need to set these headers for all requests to your video app:
>  - `Access-Control-Allow-Origin: *`
>  - `Cross-Origin-Embedder-Policy: require-corp` 
>  - `Cross-Origin-Resource-Policy: cross-origin`
>
> **You should never run a Video app (or any app) with these settings in a live environment.** With these CORS settings a bad actor could do serious harm to your users' privacy. Videobrew is only intended for local use.