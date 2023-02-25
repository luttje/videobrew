class EnableCorsForIframe {
  description () {
    return 'Support for setting Cross-Origin-Resource-Policy header.'
  }

  optionDefinitions () {
    return [
      {
        name: 'cors.resource',
        description: 'Set a `Cross-Origin-Resource-Policy` value. Default is cross-origin.'
      }
    ]
  }

  middleware(config) {
    const corsOptions = {};

    if (config.corsResource) corsOptions.resource = config.corsResource

    return async (ctx, next) => {
      ctx.response.set('Cross-Origin-Resource-Policy', corsOptions.resource ?? 'cross-origin')
      await next()
    }
  }
}

export default EnableCorsForIframe