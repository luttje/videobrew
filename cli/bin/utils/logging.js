"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.panic = exports.debug = exports.inform = void 0;
const chalk_1 = __importDefault(require("chalk"));
const log = console.log;
function inform(message, chalkFn = chalk_1.default.white, noPrefix = false) {
    log((noPrefix ? '' : (chalkFn.underline('[📼 Videobrew]') + ' ')) +
        chalkFn(message));
}
exports.inform = inform;
function debug(message) {
    inform(message, chalk_1.default.gray);
}
exports.debug = debug;
function panic(message) {
    log(chalk_1.default.red(message));
    process.exit(1);
}
exports.panic = panic;
