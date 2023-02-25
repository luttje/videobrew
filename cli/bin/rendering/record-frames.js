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
exports.recordFrames = void 0;
const playwright_1 = require("playwright");
const fs_1 = __importDefault(require("fs"));
const is_video_url_1 = require("../utils/is-video-url");
function messageVideo(page, type, data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.evaluate((message) => {
            window.postMessage(message);
        }, Object.assign(Object.assign({}, data), { type }));
    });
}
function recordFrames(videoAppPathOrUrl, framesOutputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const browser = yield playwright_1.chromium.launch();
            const page = yield browser.newPage();
            page.on('console', (message) => console.log('PAGE LOG:', message.text()));
            page.on('pageerror', (message) => console.log('PAGE ERROR:', message.message));
            if (!fs_1.default.existsSync(framesOutputPath))
                fs_1.default.mkdirSync(framesOutputPath, { recursive: true });
            const isVideoAppAtUrl = (0, is_video_url_1.isVideoAppUrl)(videoAppPathOrUrl);
            const videoPath = isVideoAppAtUrl ? videoAppPathOrUrl : `file://${videoAppPathOrUrl}/index.html`;
            yield page.goto(videoPath, {
                waitUntil: 'domcontentloaded',
            });
            let frame = 0;
            let frameFiles = [];
            let width, height, framerate, frameCount;
            yield page.exposeFunction('__messageForwarder', (message) => __awaiter(this, void 0, void 0, function* () {
                switch (message.type) {
                    case 'videobrew.setup':
                        ({ width, height, framerate, frameCount } = message);
                        yield page.setViewportSize({ width, height });
                        for (let i = 0; i < frameCount; i++) {
                            frameFiles.push(yield captureFrame(page, frame++, framesOutputPath));
                        }
                        teardown(browser);
                        resolve({
                            width,
                            height,
                            framerate,
                            frameCount,
                            frameFiles,
                        });
                        break;
                    case 'videobrew.init':
                        break; // video side only
                    case 'videobrew.tick':
                        break; // video side only
                    default:
                        console.error('Unknown message type', message.type);
                }
            }));
            yield page.evaluate(() => {
                window.addEventListener('message', (event) => {
                    // @ts-ignore 2304
                    __messageForwarder(event.data);
                });
            });
            messageVideo(page, 'videobrew.init');
        }));
    });
}
exports.recordFrames = recordFrames;
function captureFrame(page, frameIndex, outputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield messageVideo(page, 'videobrew.tick', { frame: frameIndex });
        const output = `${outputPath}/${String(frameIndex).padStart(8, '0')}.jpeg`;
        yield page.screenshot({
            path: output,
            fullPage: true
        });
        return output;
    });
}
function teardown(browser) {
    return __awaiter(this, void 0, void 0, function* () {
        yield browser.close();
    });
}
