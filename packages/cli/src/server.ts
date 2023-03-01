import LocalWebServer from 'local-web-server';
import { Server } from 'tls';

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
      'lws-static',
      'lws-index'
    ],
  });

  const protocol = lws instanceof Server ? 'https' : 'http';
  const url = `${protocol}://${lws.config.hostname || '127.0.0.1'}:${lws.config.port}`;

  return {
    server: lws,
    url,
    close: () => lws.server.close(),
  };
}