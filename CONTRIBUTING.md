# Contributing to VideoBrew

> ## 🚧 Work in progress
> 
> If you're interested in contributing, please [open an issue](https://github.com/luttje/videobrew/issues/new), or [make a pull request](https://github.com/luttje/videobrew/compare).

## Debugging

Prefix `DEBUG=1` to any command to enable debug logging. For example:

```bash
$ DEBUG=1 videobrew preview
```

## Development

1. Clone the repo

2. Install dependencies for all packages:
    ```bash
    $ npm install # run in project root
    ```

3. Go into the package you wish to maintain and watch for changes using:
    ```bash
    $ npm run watch # run in packages/<package to maintain>
    ```

4. Ensure that the `videobrew` CLI and editor are linked as global packages:
    ```bash
    $ cd packages/cli/dist # run this in project root to get to the CLI dist (ensure it's built first)
    $ npm link
    $ cd ../../editor/dist
    $ npm link
    ```

5. You can now run the CLI from anywhere and preview your video app:
    ```bash
    # For example
    $ cd ../../../examples/0-dependencies
    $ videobrew preview
    ```

## Testing

Most packages are tested using [Jest](https://jestjs.io/) and some with additional [Playwright](https://playwright.dev/) end-to-end tests (`e2e`). To run tests go into the package you wish to test and run:
```bash
$ npm run ci:test # run in packages/<package to test>
```

*To run all tests for all testable packages run that command in the project root.*

## Building

Run:

```bash
$ npm run build # run in project root
```

This will:

1. Discover third-party licenses used and generate a `LICENSES-THIRD-PARTY` file in the project root *([`scripts/licenses.mjs`](./scripts/licenses.mjs))*.

2. Clear the `dist` directories in each package *(using [`scripts/clear-build.mjs`](./scripts/clear-build.mjs))*.

3. Call the `build` script in each package to compile its TypeScript code. Build output is placed in the `dist` directory of each package.

4. Build a readme for each package containing the project root readme and a package specific readme. It will also copy `LICENSE` and `LICENSES-THIRD-PARTY`. All this will be placed in the `dist` directory *(using [`scripts/docs-build.mjs`](./scripts/docs-build.mjs))*.

### Testing before publishing

It may be helpful to test the published package before publishing it. To do this, you can run the following steps:

1. Go into the `packages/cli/dist` and run `npm pack`. 

2. Run `npm install -g <filename>.tgz` to install the CLI globally.

3. Go into the `packages/editor/dist` and run `npm pack`.

4. Run `npm install -g <filename>.tgz` to install the editor globally.

5. You can now run the CLI render and preview action from anywhere. This should give you a good idea of what the published package will behave like.

## Publishing

1. Run:

    ```bash
    npm run publish # run in project root
    ```

2. Choose the desired version number.

3. The packages will be versioned and pushed to Git for a GitHub release.

4. For each package their package.json will be transformed into the `dist` directory, have a package-lock.json generated, get shrinkwrapped *(using [`scripts/package.mjs`](./scripts/package.mjs))*

5. The contents of the `dist` directory will be published to npm.