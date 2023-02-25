const handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
  return response;
};

export { handle };
//# sourceMappingURL=hooks.server-97e2918a.js.map
