import { run, runNpm } from './run.mjs';
import { fileURLToPath } from 'url';
import { cwd } from 'process';
import path from 'path';
import fs from 'fs';

const packagePath = cwd(); // script should only be run from package root

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DISTRIBUTION_DIRECTORY = 'dist';

const OMIT_KEYS = ['devDependencies', 'scripts', 'publishConfig'];
const NORMALIZE_KEYS = ['main', 'types', 'typings', 'bin'];

async function main() {
  const packageJson = fs.readFileSync(path.join(packagePath, 'package.json'), 'utf8');
  const packageJsonParsed = JSON.parse(packageJson);

  OMIT_KEYS.forEach((key) => {
    delete packageJsonParsed[key];
  });

  // Removes the `dist` prefix from keys (since package.json will be in dist)
  NORMALIZE_KEYS.forEach((key) => {
    if (!packageJsonParsed[key])
      return;
    
    if (typeof packageJsonParsed[key] === 'string') {
      packageJsonParsed[key] = packageJsonParsed[key].replace(/^dist\//, '');
    } else if (typeof packageJsonParsed[key] === 'object') {
      Object.keys(packageJsonParsed[key]).forEach((subKey) => {
        packageJsonParsed[key][subKey] = packageJsonParsed[key][subKey].replace(/^dist\//, '');
      });
    } else if (Array.isArray(packageJsonParsed[key])) {
      packageJsonParsed[key] = packageJsonParsed[key].map((value) => value.replace(/^dist\//, ''));
    } else {
      throw new Error(`Unexpected type for key ${key}`);
    }
  });

  fs.writeFileSync(
    path.join(packagePath, DISTRIBUTION_DIRECTORY, 'package.json'),
    JSON.stringify(packageJsonParsed, null, 2),
  );

  const distributionDirectory = path.join(packagePath, DISTRIBUTION_DIRECTORY);

  runNpm('i --package-lock-only', distributionDirectory);
  runNpm('ci --omit=dev', distributionDirectory);
  runNpm('shrinkwrap', distributionDirectory);

  const licenseCheckerPath = path.join(__dirname, '../node_modules/.bin/license-checker-rseidelsohn');

  run(`${licenseCheckerPath} --start ${distributionDirectory} --direct --plainVertical > LICENSES-THIRD-PARTY`, packagePath);
}

main();