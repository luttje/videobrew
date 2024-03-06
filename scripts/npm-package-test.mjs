import { run, runNpm, spawnCommand, spawnCommandAndMoveOn } from './run.mjs';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function startVerdaccio() {
  return await spawnCommandAndMoveOn(
    'verdaccio',
    ['--listen', '4000', '--config', path.join(__dirname, 'verdaccio-config.yaml')],
    'Verdaccio started successfully.',
    'Verdaccio'
  );
}

export async function runLernaPublish() {
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
export async function installNpmPackageInMockWorkspace() {
  const mockWorkspaceDir = path.resolve(__dirname, 'mock-workspace');

  try {
    fs.mkdirSync(mockWorkspaceDir, { recursive: true });
    runNpm(`init -y`, mockWorkspaceDir);
    runNpm(`install @videobrew/cli --registry=http://localhost:4000 --install-strategy=nested`, mockWorkspaceDir);

    console.log('Package installed in mock workspace.');

    // Return a callback to remove the workspace
    return {
      workspacePath: mockWorkspaceDir,
      workspaceRemover: async () => {
        // Without this if it's too scary to run rmdir
        if (!mockWorkspaceDir.includes(path.join('scripts', 'mock-workspace'))) {
          throw new Error('Refusing to remove the workspace, as it is not in the expected location: ' + mockWorkspaceDir);
        }
        
        fs.rmSync(mockWorkspaceDir, { recursive: true, force: true });
        console.log('Mock workspace removed.');
      },
    };
  } catch (error) {
    console.error('Failed to install the package in mock workspace:', error);
    throw error;
  }
}
