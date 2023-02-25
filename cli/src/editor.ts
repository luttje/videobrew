import { exec, spawn, ChildProcess } from 'child_process';
import path from 'path';
import util from 'util';

const execAsync = util.promisify(exec);
const spawnAsync = util.promisify(spawn);
const filePrefix = 'file:';

/**
 * Gets where the editor is installed (globally)
 */
async function getEditorInstallPath() {
  const {
    stdout,
    stderr,
  } = await execAsync('npm list -g videobrew-editor --json');

  if (stderr) {
    console.error(stderr);
    return null;
  }

  const { dependencies } = JSON.parse(stdout);
  const editorPath = dependencies['videobrew-editor'].resolved;

  if (!editorPath.startsWith(filePrefix)) {
    // TODO: support other protocols
    console.error(`[Videobrew | Editor Server] Unsupported protocol for package: ${editorPath} (only ${filePrefix} is supported)`);
    process.exit(1);
  }

  return editorPath.slice(filePrefix.length);
}

/**
 * Installs the editor globally with npm and returns the path
 */
async function installEditor() {
  const {
    stdout,
    stderr,
  } = await execAsync('npm install -g videobrew-editor');

  if (stderr) {
    console.error(stderr);
    return null;
  }

  console.log(stdout);

  return await getEditorInstallPath();
}

/**
 * Starts the editor server
 */
export async function startEditor() {
  let editorPath = await getEditorInstallPath();
    
  if (!editorPath) {
    editorPath = await installEditor();
  }

  const editorServer = <ChildProcess>await spawnAsync('node', ['.'], {
    cwd: path.join(editorPath, 'dist'),
    stdio: 'inherit',
  });

  editorServer.on('close', (code) => {
    console.log(`[Videobrew | Editor Server] exited with code ${code}`);
    process.exit(code ?? 0);
  });

  editorServer.on('error', (err) => {
    console.error(`[Videobrew | Editor Server] error: ${err}`);
  });
}