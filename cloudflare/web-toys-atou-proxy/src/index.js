const ORIGIN = "https://web-toys-82a.pages.dev";
const PREFIX = "/web-toys";
const R2_OBJECTS = new Map([
  ["/assets/images/astronomy-tower-4k.png", "images/astronomy-tower-4k.png"],
  ["/assets/images/black-lake-4k.png", "images/black-lake-4k.png"],
  ["/assets/images/chamber-4k.png", "images/chamber-4k.png"],
  ["/assets/images/common-room-4k.png", "images/common-room-4k.png"],
  ["/assets/images/diagon-4k.png", "images/diagon-4k.png"],
  ["/assets/images/dragon-arena-4k.png", "images/dragon-arena-4k.png"],
  ["/assets/images/final-duel-4k.png", "images/final-duel-4k.png"],
  ["/assets/images/graveyard-4k.png", "images/graveyard-4k.png"],
  ["/assets/images/great-hall-4k.png", "images/great-hall-4k.png"],
  ["/assets/images/hogsmeade-snow-4k.png", "images/hogsmeade-snow-4k.png"],
  ["/assets/images/hogwarts-battle-4k.png", "images/hogwarts-battle-4k.png"],
  ["/assets/images/hogwarts-overlook-4k.png", "images/hogwarts-overlook-4k.png"],
  ["/assets/images/maze-4k.png", "images/maze-4k.png"],
  ["/assets/images/ministry-mysteries-4k.png", "images/ministry-mysteries-4k.png"],
  ["/assets/images/patronus-4k.png", "images/patronus-4k.png"],
  ["/assets/images/platform-4k.png", "images/platform-4k.png"],
  ["/assets/images/quidditch-4k.png", "images/quidditch-4k.png"],
  ["/assets/images/staircases-4k.png", "images/staircases-4k.png"],
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
