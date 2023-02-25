"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVideoAppUrl = void 0;
function isVideoAppUrl(possibleUrl) {
    return possibleUrl.startsWith('http://') || possibleUrl.startsWith('https://');
}
exports.isVideoAppUrl = isVideoAppUrl;
