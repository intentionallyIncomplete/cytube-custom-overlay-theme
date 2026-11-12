/** Turn pasted filename titles into readable text. Years stay as typed. */

const scrubTokens = ["720p", "brrip", "x264", "yify", "mp4"];
const scrubPattern = new RegExp(`\\b(?:${scrubTokens.join("|")})\\b`, "gi");

export function sanitiseAddMediaTitle(value, options = {}) {
  const { trimEdges = false } = options;
  if (!value) return "";

  let title = String(value);

  title = title.replace(/\.+/g, " ");

  scrubPattern.lastIndex = 0;
  title = title.replace(scrubPattern, " ");

  title = title.replace(/\s+/g, " ");
  return trimEdges ? title.trim() : title;
}
