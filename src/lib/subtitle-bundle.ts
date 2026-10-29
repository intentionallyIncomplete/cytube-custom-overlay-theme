/** Link kinds the add-media subtitle control knows how to bundle. */
export type LinkClass = "drive" | "direct" | "unsupported";

const BLOCKED_DRIVE_PATHS = ["/manifest", "/srt2vtt", "/proxy", "/login"];
const DIRECT_EXT = /\.(mp4|webm|ogg|m3u8)$/i;

/**
 * Merge of the old overlay `srtToVtt` and local-subs `convertSRTtoVTT`.
 * `.srt` files and any body that does not already start with WEBVTT are
 * converted. Existing WebVTT (non-srt names) is returned unchanged.
 */
export function toVtt(fileName: string, text: string): string {
  const raw = text == null ? "" : String(text);
  const name = fileName == null ? "" : String(fileName);
  const withoutBom = raw.replace(/^\uFEFF/, "");
  if (!name.toLowerCase().endsWith(".srt") && withoutBom.startsWith("WEBVTT")) {
    return raw;
  }
  let body = withoutBom.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim() + "\n";
  body = body.replace(/^\d+\s*$\n/gm, "");
  body = body.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
  body = body.replace(
    /(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/g,
    "$1 --> $2"
  );
  return "WEBVTT\n\n" + body;
}

function originOf(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function isBlockedDrivePath(pathname: string): boolean {
  return BLOCKED_DRIVE_PATHS.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/**
 * `driveOrigin` is the Google Drive index worker. Its signed `/download.aspx`
 * playback links are already playable files, so they classify as "direct";
 * its other file paths classify as "drive" and are resolved server-side.
 */
export function classifyLink(url: string, driveOrigin: string): LinkClass {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return "unsupported";
  }
  if (parsed.protocol !== "https:") return "unsupported";
  const drive = originOf(driveOrigin);
  if (drive && parsed.origin === drive) {
    if (parsed.pathname === "/download.aspx") return "direct";
    if (!isBlockedDrivePath(parsed.pathname)) return "drive";
  }
  if (DIRECT_EXT.test(parsed.pathname)) return "direct";
  return "unsupported";
}

/** `bundleOrigin` is the subtitle-bundles worker that issued the manifest URL. */
export function bundleIdFromMediaId(mediaId: string, bundleOrigin: string): string | null {
  let media: URL;
  try {
    media = new URL(mediaId);
  } catch {
    return null;
  }
  const bundles = originOf(bundleOrigin);
  if (!bundles || media.origin !== bundles) return null;
  const match = /^\/bundle\/([^/]+)\.json$/.exec(media.pathname);
  return match && match[1] ? match[1] : null;
}
