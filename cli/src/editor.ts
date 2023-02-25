import { exec, spawn, ChildProcess } from 'child_process';
import path from 'path';
import util from 'util';

const execAsync = util.promisify(exec);
const spawnAsync = util.promisify(spawn);

const EDITOR_PACKAGE_NAME = '@videobrew/editor';
const FILE_PREFIX = 'file:';

/**
 * Gets where the editor is installed (globally)
 */
async function getEditorInstallPath() {
  let json: string;

  try {
    const {
      stdout,
    } = await execAsync(`npm list -g ${EDITOR_PACKAGE_NAME} --json`);
    json = stdout;
  } catch (e) {
    // If the editor is not installed, npm list will exit with code 1
    return null;
  }

  const { dependencies } = JSON.parse(json);
  const editorPath = dependencies[EDITOR_PACKAGE_NAME].resolved;

  if (!editorPath.startsWith(FILE_PREFIX)) {
    // TODO: support other protocols
    console.error(`[Videobrew | Editor Server] Unsupported protocol for package: ${editorPath} (only ${FILE_PREFIX} is supported)`);
    process.exit(1);
  }

  return editorPath.slice(FILE_PREFIX.length);
}

/**
 * Installs the editor globally with npm and returns the path
 */
async function installEditor() {
  const {
    stdout,
    stderr,
  } = await execAsync(`npm install -g ${EDITOR_PACKAGE_NAME}`);

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
    env: {
      'PORT': '8087',
    },
  });

  editorServer.on('close', (code) => {
    console.log(`[Videobrew | Editor Server] exited with code ${code}`);
    process.exit(code ?? 0);
  });

  editorServer.on('error', (err) => {
    console.error(`[Videobrew | Editor Server] error: ${err}`);
  });
}