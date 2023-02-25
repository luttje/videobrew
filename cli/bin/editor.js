"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startEditor = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const execAsync = util_1.default.promisify(child_process_1.exec);
const spawnAsync = util_1.default.promisify(child_process_1.spawn);
const filePrefix = 'file:';
/**
 * Gets where the editor is installed (globally)
 */
function getEditorInstallPath() {
    return __awaiter(this, void 0, void 0, function* () {
        const { stdout, stderr, } = yield execAsync('npm list -g videobrew-editor --json');
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
    });
}
/**
 * Installs the editor globally with npm and returns the path
 */
function installEditor() {
    return __awaiter(this, void 0, void 0, function* () {
        const { stdout, stderr, } = yield execAsync('npm install -g videobrew-editor');
        if (stderr) {
            console.error(stderr);
            return null;
        }
        console.log(stdout);
        return yield getEditorInstallPath();
    });
}
/**
 * Starts the editor server
 */
function startEditor() {
    return __awaiter(this, void 0, void 0, function* () {
        let editorPath = yield getEditorInstallPath();
        if (!editorPath) {
            editorPath = yield installEditor();
        }
        const editorServer = yield spawnAsync('node', ['.'], {
            cwd: path_1.default.join(editorPath, 'dist'),
            stdio: 'inherit',
        });
        editorServer.on('close', (code) => {
            console.log(`[Videobrew | Editor Server] exited with code ${code}`);
            process.exit(code !== null && code !== void 0 ? code : 0);
        });
        editorServer.on('error', (err) => {
            console.error(`[Videobrew | Editor Server] error: ${err}`);
        });
    });
}
exports.startEditor = startEditor;
