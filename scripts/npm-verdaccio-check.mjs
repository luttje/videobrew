import { exec } from 'child_process';
import readline from 'readline';

const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptInstall() {
  readLine.question('Do you want to install verdaccio globally? (y/N) ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      installPackage();
    } else {
      console.log('Installation aborted.');
      readLine.close();
    }
  });
}

function installPackage() {
  console.log('Installing verdaccio globally...');
  exec('npm install -g verdaccio', (error, stdout, stderr) => {
    if (error) {
      console.error('Error installing verdaccio:', stderr);
    } else {
      console.log('verdaccio installed successfully.');
    }
    readLine.close();
  });
}

/**
 * Checks if verdaccio is installed globally.
 */
function checkVerdaccioInstalled() {
  exec('npm list -g verdaccio', (error, stdout, stderr) => {
    if (error || stderr || stdout.includes('(empty)')) {
      console.log('verdaccio is not installed globally.');
      promptInstall();
    } else {
      console.log('verdaccio is already installed globally.');
      readLine.close();
    }
  });
}

checkVerdaccioInstalled();