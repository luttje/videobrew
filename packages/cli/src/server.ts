import LocalWebServer from 'local-web-server';
import EnableCorsForIframe from './utils/mw-cors';

export interface LocalWebServerInstance {
  server: any;
  url: string;
  close: () => void;
}

export async function createLocalWebServer(videoAppPath: string) {
  const lws = await LocalWebServer.create({
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

  const tls = require('tls')
  const protocol = lws instanceof tls.Server ? 'https' : 'http';
  const url = `${protocol}://${lws.config.hostname || '127.0.0.1'}:${lws.config.port}`;

  return {
    server: lws,
    url,
    close: () => lws.server.close(),
  };
}