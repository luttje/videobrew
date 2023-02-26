import { cwd } from 'process';
import path from 'path';
import fs from 'fs';

const packagePath = cwd(); // script should only be run from package root

const DISTRIBUTION_DIRECTORY = 'dist';

async function main() {
  fs.rmSync(path.join(packagePath, DISTRIBUTION_DIRECTORY), { recursive: true });
}

main();