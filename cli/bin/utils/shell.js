"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shell = void 0;
function shell(commands) {
    return commands.map((command) => `"${command}"`).join(' ');
}
exports.shell = shell;
