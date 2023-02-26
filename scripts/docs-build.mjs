import { fileURLToPath } from 'url';
import { cwd } from 'process';
import path from 'path';
import fs from 'fs';

const packagePath = cwd(); // script should only be run from package root

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DISTRIBUTION_DIRECTORY = 'dist';

async function main() {
  // Merge README with PACKAGE_README into dist
  fs.writeFileSync(
    path.join(packagePath, DISTRIBUTION_DIRECTORY, 'README.md'),
    (fs.readFileSync(path.join(packagePath, 'PACKAGE_README.md'), 'utf8') +
      '\n' +
      fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8'))
  )

  // Copy LICENSES-THIRD-PARTY to dist
  const thirdPartyLicenseFile = path.join(packagePath, 'LICENSES-THIRD-PARTY');

  if (!fs.existsSync(thirdPartyLicenseFile))
    return;
  
  fs.writeFileSync(
    path.join(packagePath, DISTRIBUTION_DIRECTORY, 'LICENSES-THIRD-PARTY'),
    fs.readFileSync(thirdPartyLicenseFile, 'utf8')
  )
}

main();