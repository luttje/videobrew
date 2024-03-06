import { afterAll, beforeAll, it, expect, describe, assert } from 'vitest';
import { join } from 'path';
import {
  startVerdaccio,
  runLernaPublish,
  installNpmPackageInMockWorkspace,
} from "../../../scripts/npm-package-test.mjs";
import { run } from '../../../scripts/run.mjs';
import { getVideoSsim } from './utils.js';

let killVerdaccio: () => void;
let workspaceRemover: () => Promise<void>;
let workspacePath: string;
const fixturesPath = join(__dirname, 'fixtures');
const expectedBasePath = join(fixturesPath, 'expected');

beforeAll(async () => {
  // We actually want output, so lets not suppress it
  delete process.env.VIDEOBREW_UNIT_TESTING;

  try {
    killVerdaccio = await startVerdaccio();

    if (!process.env.VIDEOBREW_TESTS_SKIP_LERNA_PUBLISH || process.env.VIDEOBREW_TESTS_SKIP_LERNA_PUBLISH === 'true') {
      await runLernaPublish();
    }

    ({ workspacePath, workspaceRemover } = await installNpmPackageInMockWorkspace());
  } catch (error) {
    console.error('An error occurred while starting Verdaccio:', error);
  }
  
  // clean up function, called once after all tests run
  return async () => {
    killVerdaccio();
  
    if (workspaceRemover && (!process.env.VIDEOBREW_TESTS_KEEP_MOCK_WORKSPACE || process.env.VIDEOBREW_TESTS_KEEP_MOCK_WORKSPACE === 'false')) {
      await workspaceRemover();
    }
  }
});

describe('npm package integration tests', () => {
  it('integration tests use videobrew in mock-workspace', async () => {
    if (!workspacePath) {
      assert.fail('workspacePath is not defined. Lerna publish failed?');
    }

    const output = run('npx which videobrew', workspacePath);
    expect(output).toContain('mock-workspace');
  });
  
  it('should include specific help text', async () => {
    if (!workspacePath) {
      assert.fail('workspacePath is not defined. Lerna publish failed?');
    }

    const output = run('npx videobrew --help', workspacePath);
    expect(output).toContain('Create videos using web technologies.');
  });

  it('should render the 0-dependencies example', async () => {
    if (!workspacePath) {
      assert.fail('workspacePath is not defined. Lerna publish failed?');
    }
    
    const pathRelativeToWorkspace = '../../examples/0-dependencies';
    const output = run(`npx videobrew render ${pathRelativeToWorkspace} out/my-video.mp4`, workspacePath);
    console.log(output);

    expect(output).toContain('Video rendered successfully!');

    const actualPath = `${workspacePath}/out/my-video.mp4`;
    const expectedPath = join(expectedBasePath, '0-dependencies.mp4');
    const ssim = await getVideoSsim(expectedPath, actualPath);
    expect(ssim).toBeCloseTo(1.0, 1);
  });
});