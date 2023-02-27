import { exec, spawn, ChildProcess } from 'child_process';
import { debug, panic } from './utils/logging';
import path from 'path';
import util from 'util';
import fs from 'fs';

const execAsync = util.promisify(exec);

export const EDITOR_PACKAGE_NAME = '@videobrew/editor';
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
export async function getEditorInstallPath(installedGlobally: boolean): Promise<string | null> {
  const globalOption = installedGlobally ? '-g ' : '';
  let json: string;

  try {
    const {
      stdout,
    } = await execAsync(`npm list ${globalOption}${EDITOR_PACKAGE_NAME} --json`);
    json = stdout;
  } catch (e) {
    // If the editor is not installed, npm list will exit with code 1
    return null;
  }

  const { dependencies } = JSON.parse(json);
  let npmPath: string | undefined;
  
  let editorPath = dependencies[EDITOR_PACKAGE_NAME].resolved;

  if (!installedGlobally) {
    editorPath = path.join(process.cwd(), 'node_modules', EDITOR_PACKAGE_NAME);
  } else if (editorPath) {
    // Individual dependencies can be resolved when they're symlinked with `npm link`
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
export function getEditorInstaller(installGlobally: boolean) {
  const installOption = installGlobally ? '-g' : '--save-dev';
  const command = `npm install ${installOption} ${EDITOR_PACKAGE_NAME}`;

  return {
    command,
    install: async () => {
      return new Promise((resolve, reject) => {
        const { stdout, stderr } = exec(command, async (exception, stdout, stderr) => {
          if (exception) {
            reject(exception);
          }
          
          resolve(await getEditorInstallPath(installGlobally));
        });
      });
    },
  };
}

/**
 * Starts the editor server
 */
export async function startEditor(videoAppUrl: string, isGloballyInstalled: boolean): Promise<EditorInstance> {
  let editorPath = await getEditorInstallPath(isGloballyInstalled);
    
  if (!editorPath) {
    throw new Error('Editor not installed!');
  }

  const editorServer = spawn('node', [editorPath], {
    stdio: ['inherit', 'pipe', 'pipe'],
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