# Contributing to VideoBrew

**⚠️ This project (and thus this documentation) is still in development.** If you're interested in contributing, please reach out through the issues, or make a pull request.

## Debugging

Prefix `DEBUG=1` to any command to enable debug logging. For example:

```bash
$ DEBUG=1 videobrew preview
```

## Development

1. Clone the repo

2. Install dependencies

3. Run the watchers that will build the packages as you make changes:
    ```bash
    $ npx lerna run watch
    ```

4. Ensure that the `videobrew` CLI and editor are linked as global packages:
    ```bash
    $ cd packages/cli/dist
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

## Building
```bash
$ npm run build
```

### Testing before publishing

1. Go into the `packages/cli/dist` and run `npm pack`. 

2. Run `npm install -g <filename>.tgz` to install the CLI globally.

3. Go into the `packages/editor/dist` and run `npm pack`.

4. Run `npm install -g <filename>.tgz` to install the editor globally.

5. You can now run the CLI render and preview action from anywhere.