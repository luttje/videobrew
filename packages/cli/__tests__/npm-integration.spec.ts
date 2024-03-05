import { afterAll, beforeAll, it, expect, describe, vi } from 'vitest';
import {
  startVerdaccio,
  runLernaPublish,
  installNpmPackageInMockWorkspace,
} from "../../../scripts/npm-package-test.mjs";
import { run } from "../../../scripts/run.mjs";

let killVerdaccio: () => void;
let workspaceRemover: () => Promise<void>;
let workspacePath: string;

beforeAll(async () => {
  try {
    killVerdaccio = await startVerdaccio();

    await runLernaPublish();

    ({ workspacePath, workspaceRemover } = await installNpmPackageInMockWorkspace());
  } catch (error) {
    console.error('An error occurred while starting Verdaccio:', error);
  }
});

afterAll(async () => {
  killVerdaccio();

  if (workspaceRemover) {
    await workspaceRemover();
  }
});

describe('npm package integration tests', () => {
  it('can run ', async () => {
    console.log('Running npm integration tests...');
    
    const output = run(
      'npx videobrew --help',
      workspacePath
    );

    expect(output).toContain('Create videos using web technologies.');
  });
});