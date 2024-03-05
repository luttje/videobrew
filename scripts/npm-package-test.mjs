import { run, runNpm, spawnCommand, spawnCommandAndMoveOn } from './run.mjs';
import path from 'path';
import fs from 'fs';

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

/**
 * Creats a mock workspace and installs the package in it.
 * 
 * Ideally we would install it globally, but this way we can remove the workspace after the test.
 * Globally it could conflict on the developer's machine.
 */
async function installNpmPackageInMockWorkspace() {
  const mockWorkspaceDir = path.resolve('./scripts/mock-workspace');

  try {
    fs.mkdirSync(mockWorkspaceDir, { recursive: true });
    runNpm(`init -y`, mockWorkspaceDir);
    runNpm(`install @videobrew/cli --registry=http://localhost:4000`, mockWorkspaceDir);

    console.log('Package installed in mock workspace.');

    // Return a callback to remove the workspace
    return async () => {
      // Without this if it's too scary to run rmdir
      if (!mockWorkspaceDir.includes('scripts/mock-workspace') && !mockWorkspaceDir.includes('scripts\\mock-workspace')) {
        throw new Error('Refusing to remove the workspace, as it is not in the expected location: ' + mockWorkspaceDir);
      }
      
      fs.rmdirSync(mockWorkspaceDir, { recursive: true, force: true });
      console.log('Mock workspace removed.');
    };
  } catch (error) {
    console.error('Failed to install the package in mock workspace:', error);
    throw error;
  }
}

/**
 * Runs the tests in the mock workspace.
 * 
 * @returns {boolean} True if the tests passed.
 */
async function runNpmTests() {
  const mockWorkspaceDir = path.resolve('./scripts/mock-workspace');

  const output = run(
    'npx videobrew --help',
    mockWorkspaceDir
  );

  if (!output.includes('Create videos using web technologies.')) {
    throw new Error('The output of "npx videobrew --help" did not contain the expected string.');
  } else {
    console.log('The output of "npx videobrew --help" contained the expected string.');
  }

  return true;
}

async function main() {
  try {
    const killVerdaccio = await startVerdaccio();

    await runLernaPublish();
    const workspaceRemover = await installNpmPackageInMockWorkspace();
    
    console.log('Running npm integration tests...');
    const success = runNpmTests();

    await workspaceRemover();

    killVerdaccio();

    if (!success) {
      throw new Error('Tests failed.');
    }

    console.log('All npm integration tests passed.');
    process.exit(0);
  } catch (error) {
    console.error('An error occurred while starting Verdaccio:', error);
    process.exit(1);
  }
}

main();