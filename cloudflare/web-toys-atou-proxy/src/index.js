const ORIGIN = "https://web-toys-82a.pages.dev";
const PREFIX = "/web-toys";
const R2_OBJECTS = new Map([
  ["/assets/images/astronomy-tower-4k-prompt-v2.webp", "images/astronomy-tower-4k-prompt-v2.webp"],
  ["/assets/images/black-lake-4k-prompt-v2.webp", "images/black-lake-4k-prompt-v2.webp"],
  ["/assets/images/chamber-4k-prompt-v2.webp", "images/chamber-4k-prompt-v2.webp"],
  ["/assets/images/common-room-4k-prompt-v2.webp", "images/common-room-4k-prompt-v2.webp"],
  ["/assets/images/diagon-4k-prompt-v2.webp", "images/diagon-4k-prompt-v2.webp"],
  ["/assets/images/dragon-arena-4k-prompt-v2.webp", "images/dragon-arena-4k-prompt-v2.webp"],
  ["/assets/images/final-duel-4k-prompt-v2.webp", "images/final-duel-4k-prompt-v2.webp"],
  ["/assets/images/graveyard-4k-prompt-v2.webp", "images/graveyard-4k-prompt-v2.webp"],
  ["/assets/images/great-hall-4k-prompt-v2.webp", "images/great-hall-4k-prompt-v2.webp"],
  ["/assets/images/hogsmeade-snow-4k-prompt-v2.webp", "images/hogsmeade-snow-4k-prompt-v2.webp"],
  ["/assets/images/hogwarts-battle-4k-prompt-v2.webp", "images/hogwarts-battle-4k-prompt-v2.webp"],
  ["/assets/images/hogwarts-overlook-4k-prompt-v2.webp", "images/hogwarts-overlook-4k-prompt-v2.webp"],
  ["/assets/images/maze-4k-prompt-v2.webp", "images/maze-4k-prompt-v2.webp"],
  ["/assets/images/ministry-mysteries-4k-prompt-v2.webp", "images/ministry-mysteries-4k-prompt-v2.webp"],
  ["/assets/images/patronus-4k-prompt-v2.webp", "images/patronus-4k-prompt-v2.webp"],
  ["/assets/images/platform-4k-prompt-v2.webp", "images/platform-4k-prompt-v2.webp"],
  ["/assets/images/quidditch-4k-prompt-v2.webp", "images/quidditch-4k-prompt-v2.webp"],
  ["/assets/images/staircases-4k-prompt-v2.webp", "images/staircases-4k-prompt-v2.webp"],
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
    const r2Key = R2_OBJECTS.get(assetPath)
      || (assetPath.startsWith("/assets/thumbs/")
        ? assetPath.slice("/assets/".length)
        : null);

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
