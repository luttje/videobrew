# Contributing to VideoBrew

**⚠️ This project (and thus this documentation) is still in development.** If you're interested in contributing, please reach out through the issues, or make a pull request.

## Development

1. Clone the repo

2. Install dependencies

3. Run the development servers:
    ```bash
    $ npx learn run dev
    ```

4. Ensure that the `videobrew` CLI is linked as a global package:
    ```bash
    $ cd packages/cli/dist
    $ npm link
    ```

5. You can now run the CLI from anywhere:
    ```bash
    # Go to a directory with a video app and run
    $ videobrew preview
    ```


## Building
```bash
$ npx lerna run build
```