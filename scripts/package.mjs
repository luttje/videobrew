import { runNpm } from './run.mjs';
import { cwd } from 'process';
import path from 'path';
import fs from 'fs';

const packagePath = cwd(); // script should only be run from package root

const DISTRIBUTION_DIRECTORY = 'dist';

const OMIT_KEYS = ['devDependencies', 'scripts', 'publishConfig.directory'];
const NORMALIZE_KEYS = ['main', 'module', 'types', 'typings', 'bin'];
const FIX_FILE_PATH_KEYS = ['dependencies'];

async function main() {
  const packageJson = fs.readFileSync(path.join(packagePath, 'package.json'), 'utf8');
  const packageJsonParsed = JSON.parse(packageJson);

  OMIT_KEYS.forEach((key) => {
    const keys = key.split('.');
    const lastKey = keys.pop();
    let currentObject = packageJsonParsed;

    keys.forEach((key) => {
      currentObject = currentObject[key];
    });

    delete currentObject[lastKey];
  });

  // Removes the `dist` prefix from keys (since package.json will be in dist)
  NORMALIZE_KEYS.forEach((key) => {
    if (!packageJsonParsed[key])
      return;
    
    // Match `dist` prefix, optionally preceded by a `.`, `/`, or `./`
    const distPrefixRegex = /^\.?\/?dist\//;
    
    if (typeof packageJsonParsed[key] === 'string') {
      packageJsonParsed[key] = packageJsonParsed[key].replace(distPrefixRegex, '');
    } else if (typeof packageJsonParsed[key] === 'object') {
      Object.keys(packageJsonParsed[key]).forEach((subKey) => {
        packageJsonParsed[key][subKey] = packageJsonParsed[key][subKey].replace(distPrefixRegex, '');
      });
    } else if (Array.isArray(packageJsonParsed[key])) {
      packageJsonParsed[key] = packageJsonParsed[key].map((value) => value.replace(distPrefixRegex, ''));
    } else {
      throw new Error(`Unexpected type for key ${key}`);
    }
  });

  // Fix relative paths that start (file:../ -> file:../../)
  FIX_FILE_PATH_KEYS.forEach((key) => {
    if (!packageJsonParsed[key])
      return;
    
    Object.keys(packageJsonParsed[key]).forEach((subKey) => {
      const value = packageJsonParsed[key][subKey];
      if (value.startsWith('file:../')) {
        packageJsonParsed[key][subKey] = value.replace('file:../', 'file:../../');
      }
    });
  });

  fs.writeFileSync(
    path.join(packagePath, DISTRIBUTION_DIRECTORY, 'package.json'),
    JSON.stringify(packageJsonParsed, null, 2),
  );

  const distributionDirectory = path.join(packagePath, DISTRIBUTION_DIRECTORY);

  runNpm('i --package-lock-only', distributionDirectory);
  runNpm('ci --omit=dev', distributionDirectory);
  runNpm('shrinkwrap', distributionDirectory);
}

main();