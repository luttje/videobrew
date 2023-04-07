# [<img src="https://raw.githubusercontent.com/webpack/media/master/logo/icon.svg" height="20px" alt="Webpack Logo" /> Webpack](https://webpack.js.org/) + [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/512px-Typescript_logo_2020.svg.png?20221110153201" height="20px" alt="TypeScript Logo" /> TypeScript](https://www.typescriptlang.org)  Video App Example

[[📼 Watch the rendered video]](https://github.com/luttje/videobrew/blob/main/examples/webpack/out/weather.mp4)

This example video was rendered by running the command `videobrew render -q 100 dist out/weather.mp4` in this directory.

## About this example

This project has been created using **webpack-cli**.

### Development server

To quickly test your video app, serve it with webpack and have Videobrew preview it by supplying the served url.

1. Run the following command to start the development server (keep the terminal open):

    ```bash
    npm run serve
    ```
    *Note the use of [`devServer.devMiddleware.writeToDisk: true` in webpack.config.js](webpack.config.js) to make sure the video app is written to disk so that Videobrew can read it.*

2. Preview by running `videobrew preview http://localhost:8088` in another terminal.

Make changes to the video app. You may need to refresh the video app to see them.

### Build and render

There's two ways to render your video app. The quickest way is to ensure your video app is still served (`npm run serve`) and run:

```bash
videobrew render -q 100 http://localhost:8088 out/weather.mp4
```

Or if you want Videobrew to serve the video app for you, you can build the video app and render it:

1. Build the video app:

    ```bash
    npm run build
    ```



2. Render the video at the highest quality by running:

    ```bash
    videobrew render -q 100 dist out/weather.mp4
    ```

