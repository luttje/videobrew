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
    $ cd packages/cli # run this in project root to get to the CLI dist (ensure it's built first)
    $ npm link
    $ cd ../../editor
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

1. Discover third-party licenses used and generate a `LICENSES-THIRD-PARTY` file in the project root *([`scripts/licenses.mjs`](https://github.com/luttje/videobrew/blob/main/scripts/licenses.mjs))*.

2. Clear the `dist` directories in each package *(by [`scripts/clear-build.mjs`](https://github.com/luttje/videobrew/blob/main/scripts/clear-build.mjs))*.

3. Call the `build` script in each package to compile its TypeScript code. Build output is placed in the `dist` directory of each package.

4. Build a readme for each package containing the project root readme and a package specific readme. It will also copy `LICENSE` and `LICENSES-THIRD-PARTY`. All this will be placed in the package root directory *(by [`scripts/docs-build.mjs`](https://github.com/luttje/videobrew/blob/main/scripts/docs-build.mjs))*.

## Publishing

1. Run:

    ```bash
    npm run publish # run in project root
    ```

2. Choose the desired version number.

3. The packages will be versioned and pushed to Git for a GitHub release.

4. The production-needed contents of each package directory will be published to npm.