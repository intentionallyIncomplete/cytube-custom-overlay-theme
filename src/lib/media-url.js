/** Encode literal spaces in queue media URLs so CyTube parseMediaLink can parse them. */

export function encodeMediaUrlForQueue(raw) {
  const url = String(raw || "").trim();
  if (!url || !/\s/.test(url)) return url;

  const match = url.match(/^([a-zA-Z][a-zA-Z0-9+.-]*:)(\/\/)?(.*)$/s);
  if (!match) {
    return url.replace(/ /g, "%20");
  }

  const candidate = `${match[1]}${match[2] || ""}${match[3].replace(/ /g, "%20")}`;

  try {
    return new URL(candidate).href;
  } catch (_) {
    return candidate;
  }
}

export function encodeMediaUrlsInField(linkList) {
  const raw = String(linkList || "");
  if (!raw || !/\s/.test(raw)) return raw;

  const parts = raw.split(",http");
  const links = parts.map((link, i) => encodeMediaUrlForQueue(i > 0 ? `http${link}` : link));

  let out = links[0];
  for (let i = 1; i < links.length; i++) {
    out += `,http${links[i].replace(/^https?:/i, "")}`;
  }
  return out;
}
