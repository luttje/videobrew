import { afterAll, beforeAll, it, expect, describe, vi } from 'vitest';
import { exec, execSync } from 'child_process';
import {
  startVerdaccio,
  runLernaPublish,
  installNpmPackageInMockWorkspace,
} from "../../../scripts/npm-package-test.mjs";
import { run } from '../../../scripts/run.mjs';

let killVerdaccio: () => void;
let workspaceRemover: () => Promise<void>;
let workspacePath: string;

beforeAll(async () => {
  // We actually want output, so lets not suppress it
  delete process.env.VIDEOBREW_UNIT_TESTING;

  try {
    killVerdaccio = await startVerdaccio();

    await runLernaPublish();

    ({ workspacePath, workspaceRemover } = await installNpmPackageInMockWorkspace());
  } catch (error) {
    console.error('An error occurred while starting Verdaccio:', error);
  }
  
  // clean up function, called once after all tests run
  return async () => {
    killVerdaccio();
  
    if (workspaceRemover) {
      await workspaceRemover();
    }
  }
});

describe('npm package integration tests', () => {
  it('should include specific help text', async () => {
    const output = run('npx videobrew --help', workspacePath);
    expect(output).toContain('Create videos using web technologies.');
  });
});