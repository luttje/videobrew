import { exec, spawn, ChildProcess } from 'child_process';
import { debug, panic } from './utils/logging';
import path from 'path';
import util from 'util';
import fs from 'fs';

const execAsync = util.promisify(exec);

const EDITOR_PACKAGE_NAME = '@videobrew/editor';
const FILE_PREFIX = 'file:';
const PORT = 8087;
const HOST = 'localhost';

export type EditorInstance = {
  server: ChildProcess,
  port: number,
  host: string,
}

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
  let npmPath: string | undefined;
  
  let editorPath = dependencies[EDITOR_PACKAGE_NAME].resolved;
  
  // Individual dependencies can be resolved when they're symlinked with `npm link`
  if (editorPath) {
    if (!editorPath.startsWith(FILE_PREFIX)) {
      // TODO: support other protocols
      panic(`[Videobrew | Editor Server] Unsupported protocol for package: ${editorPath} (only ${FILE_PREFIX} is supported)`);
    }
  
    editorPath = editorPath.substring(FILE_PREFIX.length);
  } else {
    // Otherwise they're relative to the where global npm packages are installed 
    const { stdout } = await execAsync('npm root -g');
    npmPath = stdout.trim();
    editorPath = path.join(npmPath, EDITOR_PACKAGE_NAME);
  }

  if (!fs.existsSync(editorPath)) {
    console.log({
      npmPath,
      dependencies,
      editorPath,
    });
    panic(`[Videobrew | Editor Server] Editor package not found at ${editorPath} (but it was installed according to npm list)`);
  }

  return editorPath;
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
    panic(stderr);
    return null;
  }

  debug(stdout);

  return await getEditorInstallPath();
}

/**
 * Starts the editor server
 */
export async function startEditor(videoAppUrl: string): Promise<EditorInstance> {
  let editorPath = await getEditorInstallPath();
    
  if (!editorPath) {
    editorPath = await installEditor();
  }

  const editorServer = spawn('node', ['.'], {
    cwd: editorPath!,
    stdio: ['inherit', 'pipe', 'inherit'],
    env: {
      'PORT': `${PORT}`,
      'HOST': HOST,
      'VIDEOBREW_VIDEO_APP_URL': videoAppUrl,
    },
  });

  return {
    server: editorServer,
    port: PORT,
    host: HOST,
  }
}