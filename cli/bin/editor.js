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
const EDITOR_PACKAGE_NAME = '@videobrew/editor';
const FILE_PREFIX = 'file:';
/**
 * Gets where the editor is installed (globally)
 */
function getEditorInstallPath() {
    return __awaiter(this, void 0, void 0, function* () {
        let json;
        try {
            const { stdout, } = yield execAsync(`npm list -g ${EDITOR_PACKAGE_NAME} --json`);
            json = stdout;
        }
        catch (e) {
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
    });
}
/**
 * Installs the editor globally with npm and returns the path
 */
function installEditor() {
    return __awaiter(this, void 0, void 0, function* () {
        const { stdout, stderr, } = yield execAsync(`npm install -g ${EDITOR_PACKAGE_NAME}`);
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
function startEditor(videoAppUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        let editorPath = yield getEditorInstallPath();
        if (!editorPath) {
            editorPath = yield installEditor();
        }
        const editorServer = (0, child_process_1.spawn)('node', ['.'], {
            cwd: path_1.default.join(editorPath, 'dist'),
            stdio: ['inherit', 'pipe', 'inherit'],
            env: {
                'PORT': '8087',
                'HOST': 'localhost',
                'VIDEOBREW_VIDEO_APP_URL': videoAppUrl,
            },
        });
        return editorServer;
    });
}
exports.startEditor = startEditor;
