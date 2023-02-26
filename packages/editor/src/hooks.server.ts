import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
  const response = await resolve(event);
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');

  const contentType = response.headers.get('content-type');

  if (!contentType || !contentType.includes('text/html'))
    return response;

  const videoAppUrl = process.env.VIDEOBREW_VIDEO_APP_URL;

  if (!videoAppUrl)
    throw new Error('VIDEOBREW_VIDEO_APP_URL environment variable not set!');

  const body = await response.text();
  const bodyParts = body.split('</body>');

  if (bodyParts.length !== 2)
    throw new Error('Invalid HTML response! Could not find </body> tag before which to insert the script tag.');
  
  const [beforeBody, afterBody] = bodyParts;
  const scriptTag = `<script>window.VIDEOBREW_VIDEO_APP_URL = '${videoAppUrl}';</script>`;
  const newBody = `${beforeBody}${scriptTag}</body>${afterBody}`;

  const replacementResponse = new Response(newBody, response);
  replacementResponse.headers.set('content-length', newBody.length.toString());
  return replacementResponse;
}) satisfies Handle;
