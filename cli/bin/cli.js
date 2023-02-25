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
exports.args = exports.argumentConfig = void 0;
const video_from_frames_1 = require("./rendering/video-from-frames");
const record_frames_1 = require("./rendering/record-frames");
const ts_command_line_args_1 = require("ts-command-line-args");
const editor_1 = require("./editor");
const process_1 = require("process");
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const DEFAULT_VIDEO_APP_PATH = '.';
const DEFAULT_OUTPUT_PATH = 'out';
const workingDirectory = (0, process_1.cwd)();
exports.argumentConfig = {
    action: { type: String, defaultOption: true, description: 'The action to perform. Either "preview", "render" or "help"' },
    videoAppPath: { type: String, alias: 'i', optional: true, description: `The path to the video app. Defaults to "${DEFAULT_VIDEO_APP_PATH}"` },
    outputPath: { type: String, alias: 'o', optional: true, description: `The path to the output directory. Defaults to "${DEFAULT_OUTPUT_PATH}"` },
    help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide' },
};
exports.args = (0, ts_command_line_args_1.parse)(exports.argumentConfig, {
    hideMissingArgMessages: true,
    stopAtFirstUnknown: true,
}, true, true);
const log = console.log;
function inform(message, chalkFn = chalk_1.default.white) {
    log(chalkFn.underline('[📼 Videobrew]') +
        chalkFn(` ${message}`));
}
function debug(message) {
    inform(message, chalk_1.default.gray);
}
function panic(message) {
    log(chalk_1.default.red(message));
    process.exit(1);
}
function render(videoAppPath, outputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        inform(`Rendering Video app at path: ${videoAppPath}`);
        const framesOutputPath = path_1.default.join(outputPath, 'frames');
        const { framerate, } = yield (0, record_frames_1.recordFrames)(videoAppPath, framesOutputPath);
        const videoConfig = yield (0, video_from_frames_1.buildVideoConfigFromFrames)(framesOutputPath, framerate, outputPath);
        debug(`Rendering with command: ${videoConfig.command}`);
        const output = yield (0, video_from_frames_1.renderVideo)(videoConfig);
        debug(output);
        yield fs_1.default.rmSync(framesOutputPath, { recursive: true });
        inform(`Video rendered to ${outputPath}`);
    });
}
function preview(videoAppPath) {
    return __awaiter(this, void 0, void 0, function* () {
        inform(`Previewing video app at path: ${videoAppPath}`);
        // TODO: Serve the video app @ http://localhost:8088
        const editorServer = yield (0, editor_1.startEditor)();
        editorServer.stdout.on('data', (data) => {
            inform(`Editor Server: ${data}`);
        });
        editorServer.on('close', (code) => {
            inform(`Editor Server exited with code ${code}`);
            process.exit(code !== null && code !== void 0 ? code : 0);
        });
        editorServer.on('error', (err) => {
            inform(`Editor Server ${err}`, chalk_1.default.red);
        });
    });
}
function main() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let relativeVideoAppPath = exports.args.videoAppPath;
        if (!relativeVideoAppPath) {
            if (((_a = exports.args._unknown) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                relativeVideoAppPath = exports.args._unknown[0];
                inform(`No video app path explicitly provided. Using unnamed argument: ${relativeVideoAppPath}`);
            }
            else {
                relativeVideoAppPath = DEFAULT_VIDEO_APP_PATH;
                inform(`No video app path explicitly provided. Defaulting to: ${relativeVideoAppPath}`);
            }
        }
        let relativeOutputPath = exports.args.outputPath;
        if (!relativeOutputPath) {
            if (((_b = exports.args._unknown) === null || _b === void 0 ? void 0 : _b.length) > 1) {
                relativeOutputPath = exports.args._unknown[1];
                inform(`No output path explicitly provided. Using unnamed argument: ${relativeOutputPath}`);
            }
            else {
                relativeOutputPath = DEFAULT_OUTPUT_PATH;
                inform(`No output path explicitly provided. Defaulting to: ${relativeOutputPath}`);
            }
        }
        const videoAppPath = path_1.default.join(workingDirectory, relativeVideoAppPath);
        const videoAppFilePath = path_1.default.join(videoAppPath, 'index.html');
        const outputPath = path_1.default.join(workingDirectory, relativeOutputPath);
        if (!fs_1.default.existsSync(videoAppPath)) {
            panic(`Video app path ${videoAppPath} does not exist! Please provide a valid path to where your video website is located.`);
        }
        if (!fs_1.default.existsSync(videoAppFilePath)) {
            panic(`Video app path does not contain index.html (${videoAppFilePath} does not exist!) Please provide a valid path to where your video webpage is located.`);
        }
        if (exports.args.action === 'render') {
            yield render(videoAppPath, outputPath);
        }
        else if (exports.args.action === 'preview') {
            yield preview(videoAppPath);
        }
        else if (exports.args.action === 'help') {
            exports.args._commandLineResults.printHelp();
            process.exit(0);
        }
        else {
            panic(`Unknown action "${exports.args.action}"! Use "preview" or "render"`);
        }
    });
}
main();
