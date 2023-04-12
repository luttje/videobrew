import { fileURLToPath } from 'url';
import { cwd } from 'process';
import path from 'path';
import fs from 'fs';

const packagePath = cwd(); // script should only be run from package root

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  // Merge README with PACKAGE_README into dist
  fs.writeFileSync(
    path.join(packagePath, 'README.md'),
    (fs.readFileSync(path.join(packagePath, 'PACKAGE_README.md'), 'utf8') +
      '\n' +
      fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8'))
  )
  
  fs.copyFileSync(
    path.join(__dirname, '..', 'LICENSE'),
    path.join(packagePath, 'LICENSE')
  );

  fs.copyFileSync(
    path.join(__dirname, '..', 'LICENSES-THIRD-PARTY'),
    path.join(packagePath, 'LICENSES-THIRD-PARTY')
  );
}

main();