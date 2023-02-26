/**
 * This middleware is used to enable CORS for iframes since LWS seems
 * to be missing the option for Cross-Origin-Resource-Policy. Also I
 * can't seem to figure out how to pass options to the middleware from
 * the API.
 * 
 * @see https://github.com/lwsjs/cors/blob/v4.2.0/index.js
 */
class EnableCorsForIframe {
  description () {
    return 'Support for setting Cross-Origin-Resource-Policy and Cross-Origin-Embedder-Policy headers.'
  }

  middleware(config: any) {
    return async (ctx: any, next: any) => {
      ctx.response.set('Cross-Origin-Resource-Policy', 'cross-origin')
      ctx.response.set('Cross-Origin-Embedder-Policy', 'require-corp')
      await next()
    }
  }
}

export default EnableCorsForIframe