import path from 'path';
import fs from 'fs';

const packagePath = process.argv[2];

const DISTRIBUTION_DIRECTORY = 'dist';

async function main() {
  fs.rmSync(path.join(packagePath, DISTRIBUTION_DIRECTORY), { recursive: true });
}

main();