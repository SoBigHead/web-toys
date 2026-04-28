const ORIGIN = "https://web-toys-82a.pages.dev";
const PREFIX = "/web-toys";

export default {
  async fetch(request) {
    const incoming = new URL(request.url);

    if (incoming.pathname === PREFIX) {
      return Response.redirect(`${incoming.origin}${PREFIX}/`, 308);
    }

    const upstream = new URL(ORIGIN);
    upstream.pathname = incoming.pathname.startsWith(`${PREFIX}/`)
      ? incoming.pathname.slice(PREFIX.length) || "/"
      : incoming.pathname;
    upstream.search = incoming.search;

    return fetch(new Request(upstream, request));
  },
};
