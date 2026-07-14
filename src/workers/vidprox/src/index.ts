/**
 * CORS video proxy for Web Audio boost/normalization on third-party hosts.
 *
 * GET /?url=<encodeURIComponent(originalVideoUrl)>
 * Forwards Range requests and streams the response with Access-Control-Allow-Origin: *.
 */

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Range, Content-Type",
  "Access-Control-Expose-Headers": "Content-Length, Content-Range, Accept-Ranges, Content-Type",
};

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
    }

    const target = new URL(request.url).searchParams.get("url");
    if (!target) {
      return new Response("Missing url query parameter", { status: 400, headers: CORS_HEADERS });
    }

    let targetUrl: URL;
    try {
      targetUrl = new URL(target);
    } catch {
      return new Response("Invalid url", { status: 400, headers: CORS_HEADERS });
    }

    if (!["http:", "https:"].includes(targetUrl.protocol)) {
      return new Response("Unsupported protocol", { status: 400, headers: CORS_HEADERS });
    }

    const upstreamHeaders = new Headers();
    const range = request.headers.get("Range");
    if (range) upstreamHeaders.set("Range", range);

    try {
      const upstream = await fetch(targetUrl.toString(), {
        method: request.method,
        headers: upstreamHeaders,
        redirect: "follow",
      });
      return withCors(upstream);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upstream fetch failed";
      return new Response(message, { status: 502, headers: CORS_HEADERS });
    }
  },
};
