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
exports.argumentConfig = void 0;
const video_from_frames_1 = require("./rendering/video-from-frames");
const ts_command_line_args_1 = require("ts-command-line-args");
const record_frames_1 = require("./rendering/record-frames");
const logging_1 = require("./utils/logging");
const server_1 = require("./server");
const is_video_url_1 = require("./utils/is-video-url");
const ascii_table3_1 = require("ascii-table3");
const editor_1 = require("./editor");
const process_1 = require("process");
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const DEFAULT_VIDEO_APP_PATH = '.';
const DEFAULT_OUTPUT_PATH = 'out/my-video.mp4';
const EXAMPLE_VIDEO_APP_PATH = './video';
const EXAMPLE_VIDEO_APP_URL = 'https://example.test/video';
const EXAMPLE_OUTPUT_PATH = './rendered/video.mp4';
const workingDirectory = (0, process_1.cwd)();
exports.argumentConfig = {
    action: { type: String, defaultOption: true, description: 'Action to perform. Either "preview", "render", "render-formats" or "help"' },
    videoAppPathOrUrl: { type: String, alias: 'i', optional: true, description: `Relative path or absolute URL to the video app. Defaults to "${DEFAULT_VIDEO_APP_PATH}"` },
    output: { type: String, alias: 'o', optional: true, description: `Relative path to the output directory. Defaults to "${DEFAULT_OUTPUT_PATH}"` },
    help: { type: Boolean, optional: true, alias: 'h', description: 'Causes this usage guide to print' },
};
function parseArguments() {
    const actionsTable = new ascii_table3_1.AsciiTable3()
        .addRowMatrix([
        [chalk_1.default.bold('preview'), 'Preview the video app in the browser'],
        [chalk_1.default.bold('render'), 'Render the video app to a video file'],
        [chalk_1.default.bold('render-formats'), 'List all supported video render formats'],
    ])
        .setStyle('none');
    return (0, ts_command_line_args_1.parse)(exports.argumentConfig, {
        hideMissingArgMessages: true,
        stopAtFirstUnknown: true,
        showHelpWhenArgsMissing: true,
        headerContentSections: [
            {
                header: '📼 Videobrew',
                content: 'Create videos using web technologies.',
            },
            {
                header: 'Usage',
                content: [
                    '$ videobrew <action> [options]',
                ],
            },
            {
                header: 'Actions',
                content: actionsTable.toString().split('\n'),
            },
        ],
        footerContentSections: [
            {
                header: 'Examples',
                content: [
                    chalk_1.default.bold('Open a video app located in the current working directory in the browser:'),
                    '$ videobrew preview',
                    '',
                    chalk_1.default.bold('Open a video app being served at an URL in the browser:'),
                    `$ videobrew preview ${EXAMPLE_VIDEO_APP_URL}`,
                    chalk_1.default.bgRed('Note:') + ' This will only work if the video app server has CORS enabled.',
                    '',
                    chalk_1.default.bold(`Render a video app in the current working directory to ${DEFAULT_OUTPUT_PATH}:`),
                    '$ videobrew render',
                    '',
                    chalk_1.default.bold(`Render a video app in a subdirectory to "${EXAMPLE_OUTPUT_PATH}":`),
                    `$ videobrew render ${EXAMPLE_VIDEO_APP_PATH} ${EXAMPLE_OUTPUT_PATH}`,
                    chalk_1.default.bold('or:'),
                    `$ videobrew render -i ${EXAMPLE_VIDEO_APP_PATH} -o ${EXAMPLE_OUTPUT_PATH}`,
                    chalk_1.default.bold('or:'),
                    `$ videobrew render --videoAppPathOrUrl ${EXAMPLE_VIDEO_APP_PATH} --output ${EXAMPLE_OUTPUT_PATH}`,
                    '',
                    chalk_1.default.bold('Render a video app being served at an URL to a video file:'),
                    `$ videobrew render ${EXAMPLE_VIDEO_APP_URL}`,
                ],
            },
            {
                content: [
                    'For more information, see https://github.com/luttje/videobrew/',
                ],
            },
        ],
    }, true, true);
}
function showRenderFormats(containerFormats) {
    return __awaiter(this, void 0, void 0, function* () {
        const formatTable = new ascii_table3_1.AsciiTable3()
            .setStyle('none');
        containerFormats
            .forEach(format => {
            formatTable.addRow(format.extension, format.name);
        });
        (0, logging_1.inform)('Supported render formats:');
        (0, logging_1.inform)(formatTable.toString(), undefined, true);
        (0, logging_1.inform)('To render as one of these formats suffix the output path with the desired format extension.', undefined, true);
        (0, logging_1.inform)('\n(These are the container formats as reported by ffmpeg)', chalk_1.default.italic.gray, true);
    });
}
function render(videoAppUrl, outputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const outputDirectory = path_1.default.dirname(outputPath);
        const framesOutputPath = yield fs_1.default.mkdtempSync(path_1.default.join(outputDirectory, '~tmp-'));
        const { framerate, } = yield (0, record_frames_1.recordFrames)(videoAppUrl, framesOutputPath);
        const videoConfig = yield (0, video_from_frames_1.buildVideoConfigFromFrames)(framesOutputPath, framerate, outputPath);
        (0, logging_1.debug)(`Rendering with command: ${videoConfig.command}`);
        const output = yield (0, video_from_frames_1.renderVideo)(videoConfig);
        (0, logging_1.debug)(output);
        yield fs_1.default.rmSync(framesOutputPath, { recursive: true });
        (0, logging_1.inform)(`Video rendered to ${outputPath}`);
    });
}
function preview(videoAppUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const editorServer = yield (0, editor_1.startEditor)(videoAppUrl);
        editorServer.stdout.on('data', (data) => {
            (0, logging_1.inform)(`Editor Server: ${data}`);
        });
        editorServer.on('close', (code) => {
            (0, logging_1.inform)(`Editor Server exited with code ${code}`);
        });
        editorServer.on('error', (err) => {
            (0, logging_1.inform)(`Editor Server ${err}`, chalk_1.default.red);
        });
    });
}
function main() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const args = yield parseArguments();
        const containerFormats = yield (0, video_from_frames_1.getContainerFormats)();
        if (args.action === 'render-formats') {
            return yield showRenderFormats(containerFormats);
        }
        let relativeVideoAppPath = args.videoAppPathOrUrl;
        if (!relativeVideoAppPath) {
            if (((_a = args._unknown) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                const videoAppPathOrUrl = args._unknown.find(arg => {
                    const extension = path_1.default.extname(arg);
                    return !containerFormats.some(format => `.${format.extension}` === extension);
                });
                if (videoAppPathOrUrl) {
                    relativeVideoAppPath = videoAppPathOrUrl;
                    (0, logging_1.inform)(`Video app path chosen: ${relativeVideoAppPath}`);
                }
            }
            if (!relativeVideoAppPath) {
                relativeVideoAppPath = DEFAULT_VIDEO_APP_PATH;
                (0, logging_1.inform)(`Video app path chosen: ${relativeVideoAppPath} (default)`);
            }
        }
        let relativeOutputPath = args.output;
        if (!relativeOutputPath) {
            if (((_b = args._unknown) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                const outputPath = args._unknown.find(arg => {
                    const extension = path_1.default.extname(arg);
                    return containerFormats.some(format => `.${format.extension}` === extension);
                });
                if (outputPath) {
                    relativeOutputPath = outputPath;
                    (0, logging_1.inform)(`Output path chosen: ${relativeOutputPath}`);
                }
            }
            if (!relativeOutputPath) {
                relativeOutputPath = DEFAULT_OUTPUT_PATH;
                (0, logging_1.inform)(`Output path chosen: ${relativeOutputPath} (default)`);
            }
        }
        const isVideoAppAtUrl = (0, is_video_url_1.isVideoAppUrl)(relativeVideoAppPath);
        let videoAppPathOrUrl = relativeVideoAppPath;
        if (isVideoAppAtUrl) {
            const response = yield fetch(videoAppPathOrUrl);
            if (!response.ok)
                (0, logging_1.panic)(`Video app URL ${videoAppPathOrUrl} is not responding with 200 OK! Please provide a valid URL to where your video app is being served.`);
        }
        else {
            videoAppPathOrUrl = path_1.default.join(workingDirectory, relativeVideoAppPath);
            (0, logging_1.debug)(`Video app full path: ${videoAppPathOrUrl}`);
            const videoAppFilePath = path_1.default.join(videoAppPathOrUrl, 'index.html');
            if (!fs_1.default.existsSync(videoAppPathOrUrl)) {
                (0, logging_1.panic)(`Video app path ${videoAppPathOrUrl} does not exist! Please provide a valid path to where your video app is located.`);
            }
            if (!fs_1.default.existsSync(videoAppFilePath)) {
                (0, logging_1.panic)(`Video app path does not contain index.html (${videoAppFilePath} does not exist!) Please provide a valid path to where your video app is located.`);
            }
        }
        const output = path_1.default.join(workingDirectory, relativeOutputPath);
        (0, logging_1.debug)(`Output full path: ${output}`);
        let videoAppUrl = videoAppPathOrUrl;
        let serverInstance;
        const startLocalServer = () => __awaiter(this, void 0, void 0, function* () {
            if (isVideoAppAtUrl)
                return;
            serverInstance = yield (0, server_1.createLocalWebServer)(videoAppPathOrUrl);
            videoAppUrl = serverInstance.url;
            (0, logging_1.debug)(`Serving video app at URL: ${videoAppUrl}`);
        });
        const stopLocalServer = () => __awaiter(this, void 0, void 0, function* () {
            if (!serverInstance)
                return;
            serverInstance.close();
            (0, logging_1.debug)(`Stopped local server`);
        });
        var nodeCleanup = require('node-cleanup');
        nodeCleanup(function (exitCode, signal) {
            stopLocalServer();
        });
        if (args.action === 'render') {
            yield startLocalServer();
            (0, logging_1.inform)(`Rendering...`);
            yield render(videoAppUrl, output);
            yield stopLocalServer();
        }
        else if (args.action === 'preview') {
            yield startLocalServer();
            (0, logging_1.inform)(`Previewing...`);
            yield preview(videoAppUrl);
        }
        else if (args.action === 'help') {
            args._commandLineResults.printHelp();
        }
        else {
            (0, logging_1.panic)(`Unknown action "${args.action}"! Use "preview", "render" or "render-formats`);
        }
    });
}
main();
