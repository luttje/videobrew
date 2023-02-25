#!/usr/bin/env node
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
const child_process_1 = require("child_process");
const process_1 = require("process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const show_help_1 = require("./show-help");
const record_frames_1 = require("./rendering/record-frames");
const video_from_frames_1 = require("./rendering/video-from-frames");
const args = process.argv.slice(2);
const action = args[0];
function main() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const relativeVideoAppPath = (_a = args[1]) !== null && _a !== void 0 ? _a : '.';
        const relativeOutputPath = (_b = args[2]) !== null && _b !== void 0 ? _b : 'out';
        const workingDirectory = (0, process_1.cwd)();
        const root = path_1.default.resolve(__dirname, '..');
        let videoAppPath = path_1.default.join(workingDirectory, relativeVideoAppPath);
        let outputPath = path_1.default.join(workingDirectory, relativeOutputPath);
        // If it is inside the videobrew root, move it up one level
        if (videoAppPath.startsWith(root + path_1.default.sep)) {
            // The directory can not be called videobrew-tests because it would start with the same name as root, causing paths to be rewritten:
            // https://github.com/vitejs/vite-plugin-vue/blob/eef8929c95d8b5cce1385a1d5e60da56a8420c0b/packages/plugin-vue/src/template.ts#L118
            const newVideoAppPath = path_1.default.resolve(root, '..', 'tests-videobrew');
            fs_1.default.mkdirSync(newVideoAppPath, { recursive: true });
            // We do this because we don't want vite to resolve inside our directory. Since most users of videobrew will be outside of the videobrew root, this is not a problem.
            console.log(`Video app path ${videoAppPath} is inside the videobrew root. Copying files outside of root.`);
            // Copy all files from videoAppPath to newVideoAppPath
            fs_1.default.readdirSync(videoAppPath).forEach(file => {
                fs_1.default.copyFileSync(path_1.default.join(videoAppPath, file), path_1.default.join(newVideoAppPath, file));
            });
            videoAppPath = newVideoAppPath;
        }
        const videoAppFilePath = path_1.default.join(videoAppPath, 'index.html');
        if (!fs_1.default.existsSync(videoAppPath)) {
            console.log(`Video app path ${videoAppPath} does not exist! Please provide a valid path to where your video website is located.`);
            (0, show_help_1.showHelp)();
            process.exit(1);
        }
        if (!fs_1.default.existsSync(videoAppFilePath)) {
            console.log(`Video app path does not contain index.html (${videoAppFilePath} does not exist!) Please provide a valid path to where your video webpage is located.`);
            (0, show_help_1.showHelp)();
            process.exit(1);
        }
        if (action === 'render') {
            const framesOutputPath = path_1.default.join(outputPath, 'frames');
            const { framerate, } = yield (0, record_frames_1.recordFrames)(videoAppPath, framesOutputPath);
            yield (0, video_from_frames_1.videoFromFrames)(framesOutputPath, framerate, outputPath);
            console.log(`Video rendered to ${outputPath}`);
        }
        else if (action === 'preview') {
            // We want to run videobrew with HMR enabled, so we can trigger a rebuild when the video app changes
            const devServer = (0, child_process_1.spawn)('npm', ['run', 'dev'], {
                cwd: path_1.default.join(__dirname, '..'),
                stdio: 'inherit',
                shell: true,
                env: {
                    'VIDEOBREW_TARGET': videoAppPath,
                },
            });
            devServer.on('close', (code) => {
                console.log(`DevServer exited with code ${code}`);
                process.exit(code !== null && code !== void 0 ? code : 0);
            });
            devServer.on('error', (err) => {
                console.error(`Build error: ${err}`);
                process.exit(1);
            });
        }
        else {
            console.log('Please provide an action: preview or render');
            (0, show_help_1.showHelp)();
            process.exit(1);
        }
    });
}
main();
