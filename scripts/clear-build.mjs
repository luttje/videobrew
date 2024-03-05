import { cwd } from 'process';
import path from 'path';
import fs from 'fs';

export const DISTRIBUTION_DIRECTORY = 'dist';

/**
 * Clears the build by deleting the distribution directory for the package.
 * 
 * @param {string} packagePath
 */
export async function main(packagePath = null) {
  if(!packagePath)
    packagePath = cwd(); // script expects to be run relative to package root

  const distributionDirectory = path.join(packagePath, DISTRIBUTION_DIRECTORY);

  if (!fs.existsSync(distributionDirectory))
    return;
  
  fs.rmSync(distributionDirectory, { recursive: true });
}

if (!process.env.VIDEOBREW_UNIT_TESTING)
  main();