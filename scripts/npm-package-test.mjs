import { spawnCommand, spawnCommandAndMoveOn } from './run.mjs';

async function startVerdaccio() {
  return await spawnCommandAndMoveOn(
    'verdaccio', 
    ['--listen', '4000', '--config', './scripts/verdaccio-config.yaml'],
    'Verdaccio started successfully.',
    'Verdaccio'
  );
}

async function runLernaPublish() {
  await spawnCommand(
    'npx', 
    ['lerna', 'publish', '--canary', '--no-git-tag-version', '--no-push', '--force-publish', '--no-private', '--registry', 'http://localhost:4000', '--yes'],
    'Lerna publish ran successfully.',
    'Lerna publish'
  );
}

async function runNpmPackageTest() {
  // await spawnCommand(
  //   'npm',
  //   ['run', 'npm-package-test'],
  //   'Npm-package-test ran successfully.',
  //   'Npm-package-test'
  // );
  // TODO: For CI we could just do this by installing it, but for dev we need to sandbox this in a way that does not have the package conflict on the system.
  console.log('todo: somehow install the packages from the local registry and run the tests');
}

async function main() {
  try {
    const killVerdaccio = await startVerdaccio();
    
    try {
      await runLernaPublish();
      await runNpmPackageTest();
    } catch (error) {
      console.error('An error occurred in runLernaPublish or runNpmPackageTest:', error);
    }

    killVerdaccio();
  } catch (error) {
    console.error('An error occurred while starting Verdaccio:', error);
  }
}

main().catch(error => console.error('Unhandled error in main:', error));