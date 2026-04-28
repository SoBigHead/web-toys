const ORIGIN = "https://web-toys-82a.pages.dev";
const PREFIX = "/web-toys";
const R2_OBJECTS = new Map([
  ["/assets/images/diagon-4k.png", "images/diagon-4k.png"],
]);

export default {
  async fetch(request, env) {
    const incoming = new URL(request.url);

    if (incoming.pathname === PREFIX) {
      return Response.redirect(`${incoming.origin}${PREFIX}/`, 308);
    }

    const assetPath = incoming.pathname.startsWith(`${PREFIX}/`)
      ? incoming.pathname.slice(PREFIX.length) || "/"
      : incoming.pathname;
    const r2Key = R2_OBJECTS.get(assetPath);

    if (r2Key && (request.method === "GET" || request.method === "HEAD")) {
      const object = await env.WEB_TOYS_ASSETS.get(r2Key);

      if (!object) {
        return new Response("Not found", { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("cache-control", "public, max-age=31536000, immutable");
      headers.set("access-control-allow-origin", "*");

      return new Response(request.method === "HEAD" ? null : object.body, {
        headers,
      });
    }

    const upstream = new URL(ORIGIN);
    upstream.pathname = assetPath;
    upstream.search = incoming.search;

    return fetch(new Request(upstream, request));
  },
};
