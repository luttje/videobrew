const fs = require('fs');
const path = require('path');

const packagePath = process.argv[2];

const DISTRIBUTION_DIRECTORY = 'dist';

fs.writeFileSync(path.join(packagePath, DISTRIBUTION_DIRECTORY, 'README.md'),
  fs.readFileSync(path.join(packagePath, 'PACKAGE_README.md'), 'utf8') +
  '\n' +
  fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8')
)