import { VIDEO_APP_PROXY_PATH } from '$lib/video';
import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
  const videoAppUrl = process.env.VIDEOBREW_VIDEO_APP_URL;

  if (!videoAppUrl)
    throw new Error('VIDEOBREW_VIDEO_APP_URL environment variable not set!');
  
  // The CLI will poll for this
  if (event.url.pathname === '/health') {
    return new Response('OK', {
      status: 200,
    });
  }
  
  const isVideoProxyPath = event.url.pathname.startsWith(VIDEO_APP_PROXY_PATH);
  const referer = event.request.headers.get('Referer');
  let isRefererVideoProxyPath = false;

  if (referer) {
    const refererUrl = new URL(referer);

    isRefererVideoProxyPath =
      refererUrl.hostname === event.url.hostname
      && refererUrl.port === event.url.port
      && refererUrl.pathname.startsWith(VIDEO_APP_PROXY_PATH);
  }

  // If the request is for /video (or coming out of an iframe), proxy it to the video app
  if (isVideoProxyPath || isRefererVideoProxyPath) {
    let path = event.url.pathname;

    if (isVideoProxyPath)
      path = path.substring(VIDEO_APP_PROXY_PATH.length);
    
    const rewrittenUrl = videoAppUrl + path;
    const videoAppUrlResponse = await fetch(rewrittenUrl);

    if (!videoAppUrlResponse.ok)
      throw new Error(`Video app URL ${videoAppUrl} is not responding with 200 OK! Please provide a valid URL to where your video app is being served.`);

    // Proxy the request to the video app, removing encoding
    const response = new Response(videoAppUrlResponse.body, videoAppUrlResponse);
    response.headers.delete('content-encoding');
    return response;
  }

  const response = await resolve(event);
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');

  const contentType = response.headers.get('content-type');

  if (!contentType || !contentType.includes('text/html'))
    return response;

  const body = await response.text();
  const bodyParts = body.split('</body>');

  if (bodyParts.length !== 2)
    throw new Error('Invalid HTML response! Could not find </body> tag before which to insert the script tag.');
  
  const [beforeBody, afterBody] = bodyParts;
  const scriptTag = `<script>window.VIDEOBREW_VIDEO_APP_URL = '${videoAppUrl}';</script>`;
  const newBody = `${beforeBody}${scriptTag}</body>${afterBody}`;
  const newBodySize = new TextEncoder().encode(newBody).length;

  const replacementResponse = new Response(newBody, response);
  replacementResponse.headers.set('content-length', newBodySize.toString());
  return replacementResponse;
}) satisfies Handle;
