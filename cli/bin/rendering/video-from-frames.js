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
exports.videoFromFrames = void 0;
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const shell_1 = require("../utils/shell");
const child_process_1 = require("child_process");
const util_1 = __importDefault(require("util"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function videoFromFrames(framesPath, framerate, outputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const output = `${outputPath}/output.mp4`;
        const videoConfig = (0, shell_1.shell)([
            `${ffmpeg_static_1.default}`,
            `-framerate`, `${framerate}`,
            `-i`, path_1.default.join(framesPath, '%08d.jpeg'),
            `-vf`, `pad=ceil(iw/2)*2:ceil(ih/2)*2`,
            `-c:v`, `libx264`,
            `-pix_fmt`, `yuv420p`,
            `-y`,
            `${output}`
        ]);
        console.log(`Rendering with command: ${videoConfig}`);
        const { stdout, stderr } = yield util_1.default.promisify(child_process_1.exec)(videoConfig, {
            cwd: __dirname,
        });
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
        yield fs_1.default.rmSync(framesPath, { recursive: true });
        return output;
    });
}
exports.videoFromFrames = videoFromFrames;