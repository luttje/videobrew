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
exports.createLocalWebServer = void 0;
const local_web_server_1 = __importDefault(require("local-web-server"));
function createLocalWebServer(videoAppPath) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore 7016
        const EnableCorsForIframe = (yield import('./utils/mw-cors.mjs')).default;
        const lws = yield local_web_server_1.default.create({
            port: 8088,
            directory: videoAppPath,
            stack: [
                'lws-body-parser',
                'lws-request-monitor',
                'lws-log',
                'lws-cors',
                'lws-json',
                'lws-compress',
                'lws-rewrite',
                'lws-blacklist',
                'lws-conditional-get',
                'lws-mime',
                'lws-range',
                'lws-spa',
                EnableCorsForIframe,
                'lws-static',
                'lws-index'
            ],
        });
        const tls = require('tls');
        const protocol = lws instanceof tls.Server ? 'https' : 'http';
        const url = `${protocol}://${lws.config.hostname || '127.0.0.1'}:${lws.config.port}`;
        return {
            server: lws,
            url,
            close: () => lws.server.close(),
        };
    });
}
exports.createLocalWebServer = createLocalWebServer;
