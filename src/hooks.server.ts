import { videoPathPrefix } from './vite/video-app-plugin';
import { getContentType } from '$lib/content-type';
import type { Handle } from '@sveltejs/kit';
import path from 'path';
import fs from 'fs';

const videoAppPath = process.env.VIDEOBREW_TARGET ?? './tests/pure-html';

if (!fs.existsSync(videoAppPath)) {
  console.error(`Video app not found at ${videoAppPath}`);
  process.exit(1);
}

export const handle = (async ({ event, resolve }) => {
  const url = new URL(event.request.url);
  const refererUrl = event.request.headers.has('referer') ? new URL(event.request.headers.get('referer')!) : null;
  const inVideoDomain = url.pathname.startsWith(videoPathPrefix)
    || (refererUrl && refererUrl.pathname.startsWith(videoPathPrefix));

  // if (inVideoDomain) {
  //   const pathname = url.pathname.startsWith(videoPathPrefix) ? url.pathname.slice(videoPathPrefix.length) : url.pathname;
  //   let filePath = path.join(videoAppPath, pathname === '' ? '/index.html' : pathname);

  //   const exist = fs.existsSync(filePath);

  //   if (!exist) {
  //     return new Response('Not found', { status: 404 });
  //   }
    
  //   let data = fs.readFileSync(filePath);

  //   // Inject webserver to listen to hmr
  //   if (filePath.endsWith('.html')) {
  //     // TODO: find a better way to get the port (5173 is default, though it may increment if occupied)
  //     const webserver = `
  //       <script>
  //         const ws = new WebSocket('ws://localhost:5173');
  //         ws.addEventListener('message', (event) => {
  //           console.log(event);
  //           if (event.data === 'reload') {
  //             window.location.reload();
  //           }
  //         });
  //       </script>
  //     `;

  //     const index = data.indexOf('</body>');
  //     if (index !== -1) {
  //       data = Buffer.concat([data.subarray(0, index), Buffer.from(webserver), data.subarray(index)]);
  //     }
  //   }

  //   const response = new Response(data);
    
  //   response.headers.set('Content-Type', getContentType(filePath));
  //   // response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  //   response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');

  //   return response;
  // }

  const response = await resolve(event);
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
 
  return response;
}) satisfies Handle;
