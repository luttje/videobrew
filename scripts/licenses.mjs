import { fileURLToPath } from 'url';
import { run } from './run.mjs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.join(__dirname, '..');
const licenseCheckerPath = path.join(root, 'node_modules/.bin/license-checker-rseidelsohn');

run(`${licenseCheckerPath} --excludePackagesStartingWith "@videobrew" --plainVertical --excludePrivatePackages > LICENSES-THIRD-PARTY`, root);
