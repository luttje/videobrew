import { runNpm } from './run.mjs';
import path from 'path';
import fs from 'fs';

const packagePath = process.argv[2];

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

  await runNpm('i --package-lock-only', path.join(packagePath, DISTRIBUTION_DIRECTORY));
  await runNpm('ci --omit=dev', path.join(packagePath, DISTRIBUTION_DIRECTORY));
  await runNpm('shrinkwrap', path.join(packagePath, DISTRIBUTION_DIRECTORY));
}

main();