import path from 'path';
import fs from 'fs';
import { main, DISTRIBUTION_DIRECTORY } from './clear-build.mjs';

const testDirectory = 'test-tmp';

describe('clear-build.mjs', () => {
  beforeAll(() => {
    process.env.VIDEOBREW_TESTING = true;

    // Create the test directory
    fs.mkdirSync(path.join(__dirname, testDirectory), { recursive: true });
  });

  afterAll(() => {
    delete process.env.VIDEOBREW_TESTING;

    // Delete the test directory
    fs.rmSync(path.join(__dirname, testDirectory), { recursive: true });
  });
  
  it('should delete the distribution directory', async () => {
    const packagePath = path.join(__dirname, testDirectory);
    const distributionDirectory = path.join(packagePath, DISTRIBUTION_DIRECTORY);

    // Create the distribution directory
    fs.mkdirSync(distributionDirectory, { recursive: true });

    // Verify that the distribution directory exists
    expect(fs.existsSync(distributionDirectory)).toBe(true);

    // Run the clear-build script
    await main(packagePath);

    // Verify that the distribution directory no longer exists
    expect(fs.existsSync(distributionDirectory)).toBe(false);
  });

  it('should not throw an error if the distribution directory does not exist', async () => {
    const packagePath = path.join(__dirname, testDirectory);
    const distributionDirectory = path.join(packagePath, DISTRIBUTION_DIRECTORY);

    // Verify that the distribution directory does not exist
    expect(fs.existsSync(distributionDirectory)).toBe(false);

    // Run the clear-build script
    await main(packagePath);

    // Verify that the distribution directory still does not exist
    expect(fs.existsSync(distributionDirectory)).toBe(false);
  });
});
