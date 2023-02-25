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
function startEditor() {
    return __awaiter(this, void 0, void 0, function* () {
        const editorPath = path_1.default.join(__dirname, '..', 'node_modules', 'videobrew-editor');
        const devServer = yield spawnAsync('node', ['build'], {
            cwd: editorPath,
            stdio: 'inherit',
        });
        devServer.on('close', (code) => {
            console.log(`[Videobrew | Editor Server] exited with code ${code}`);
            process.exit(code !== null && code !== void 0 ? code : 0);
        });
        devServer.on('error', (err) => {
            console.error(`[Videobrew | Editor Server] error: ${err}`);
        });
    });
}
exports.startEditor = startEditor;
