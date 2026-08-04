/**
 * Shared HTML escaping and lightweight sanitization utilities.
 *
 * Centralizes XSS-prevention logic that was previously duplicated (with
 * slightly different character sets) across feature-navbar.js,
 * feature-notify.js, feature-playlist-tools.js, feature-theme-settings.js,
 * util-imdb-card.js, util-letterboxd.js, and util-tmdb-card.js.
 *
 * See https://github.com/intentionallyIncomplete/cytube-custom-overlay-theme/issues/201
 */

const HTML_ESCAPE_PATTERN = /[&<>"']/g;
const HTML_ESCAPE_MAP: Readonly<Record<string, string>> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

/**
 * Escapes text for safe insertion into HTML markup, whether as element
 * content or inside a quoted attribute value. Use this whenever untrusted
 * or externally-sourced data (API results, usernames, titles, etc.) is
 * interpolated into an `innerHTML` template.
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(HTML_ESCAPE_PATTERN, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

/** Escapes only the characters that are unsafe inside a double-quoted HTML attribute. */
function escapeAttributeValue(value: string): string {
  return value.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Escapes stray `<`/`>` in free text without touching pre-existing named/numeric entities. */
function escapeStrayAngleBrackets(text: string): string {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export interface SanitizeHtmlOptions {
  /** Tag names (lowercase) allowed to remain in the output. */
  allowedTags?: readonly string[];
  /** Attribute names (lowercase) allowed per tag; the `"*"` key applies to every tag. */
  allowedAttributes?: Readonly<Record<string, readonly string[]>>;
  /** URL schemes (lowercase, no trailing colon) allowed in `href`/`src` values. */
  allowedSchemes?: readonly string[];
}

/** Reasonable defaults for admin-authored MOTD / notice-style content. */
const DEFAULT_ALLOWED_TAGS: readonly string[] = [
  "a", "b", "strong", "i", "em", "u", "s", "strike", "small",
  "p", "br", "hr", "div", "span",
  "ul", "ol", "li",
  "blockquote", "code", "pre",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "sub", "sup",
  "img",
  "table", "thead", "tbody", "tr", "td", "th",
  "font"
];

const DEFAULT_ALLOWED_ATTRIBUTES: Readonly<Record<string, readonly string[]>> = {
  "*": ["class", "title"],
  a: ["href", "target", "rel"],
  img: ["src", "alt", "width", "height"],
  font: ["color", "size"],
  td: ["colspan", "rowspan", "align"],
  th: ["colspan", "rowspan", "align"]
};

const DEFAULT_ALLOWED_SCHEMES: readonly string[] = ["http", "https", "mailto"];

const TAG_PATTERN_SOURCE = "<(/)?([a-zA-Z][a-zA-Z0-9]*)((?:\\s+[^<>]*?)?)\\s*(/)?>";
const ATTRIBUTE_PATTERN = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g;
const SCHEME_PATTERN = /^\s*([a-zA-Z][a-zA-Z0-9+.-]*):/;

/** Named entities commonly used to smuggle schemes past a naive string check. */
const URL_NAMED_ENTITIES: Readonly<Record<string, string>> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  colon: ":",
  nbsp: " "
};

/**
 * Decode HTML entities / strip C0 controls that browsers normalize away before
 * navigating, so scheme checks see `javascript:` instead of `&#106;avascript:` /
 * `javascript&colon;` / `java\tscript:`.
 */
function normalizeUrlForSchemeCheck(value: string): string {
  let result = value;
  for (let pass = 0; pass < 3; pass += 1) {
    const next = result
      .replace(/&#x([0-9a-fA-F]+);?/g, (_, hex: string) => {
        const code = Number.parseInt(hex, 16);
        if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return "";
        try {
          return String.fromCodePoint(code);
        } catch {
          return "";
        }
      })
      .replace(/&#(\d+);?/g, (_, dec: string) => {
        const code = Number(dec);
        if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return "";
        try {
          return String.fromCodePoint(code);
        } catch {
          return "";
        }
      })
      .replace(/&([a-zA-Z]+);?/g, (match: string, name: string) => {
        const decoded = URL_NAMED_ENTITIES[name.toLowerCase()];
        return decoded !== undefined ? decoded : match;
      });
    if (next === result) break;
    result = next;
  }
  // Drop C0 controls + DEL and collapse whitespace browsers may ignore in schemes.
  return result.replace(/[\u0000-\u001f\u007f]/g, "").replace(/[\s\u00a0]+/g, "");
}

function parseAttributes(attrString: string): Map<string, string> {
  const attrs = new Map<string, string>();
  const pattern = new RegExp(ATTRIBUTE_PATTERN.source, "g");
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(attrString)) !== null) {
    const name = (match[1] ?? "").toLowerCase();
    let value = match[2] ?? "";
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    attrs.set(name, value);
    if (match[0].length === 0) pattern.lastIndex += 1; // guard against zero-width matches
  }
  return attrs;
}

/**
 * A URL is safe if it has no scheme (relative) or an explicitly allowed scheme.
 * When `data` is allowed, only `data:image/...` payloads are accepted (blocks
 * `data:text/html` XSS).
 */
function isSafeUrl(value: string, allowedSchemes: readonly string[]): boolean {
  const normalized = normalizeUrlForSchemeCheck(value);
  if (normalized.length === 0) return true;
  const schemeMatch = SCHEME_PATTERN.exec(normalized);
  if (!schemeMatch) return true;
  const scheme = (schemeMatch[1] ?? "").toLowerCase();
  if (!allowedSchemes.includes(scheme)) return false;
  if (scheme === "data") return /^data:image\//i.test(normalized);
  return true;
}

function sanitizeTag(
  closingSlash: string | undefined,
  tagName: string,
  attrString: string,
  selfClosingSlash: string | undefined,
  allowedTags: ReadonlySet<string>,
  allowedAttributes: Readonly<Record<string, readonly string[]>>,
  allowedSchemes: readonly string[]
): string {
  const name = tagName.toLowerCase();
  if (!allowedTags.has(name)) return "";
  if (closingSlash) return `</${name}>`;

  const parsedAttrs = parseAttributes(attrString || "");
  const globalAllowed = allowedAttributes["*"] ?? [];
  const tagAllowed = allowedAttributes[name] ?? [];
  const attrOut: string[] = [];

  for (const [attrName, attrValue] of parsedAttrs) {
    if (attrName.startsWith("on")) continue; // event handlers (onclick, onerror, ...)
    const isAllowed = globalAllowed.includes(attrName) || tagAllowed.includes(attrName);
    if (!isAllowed) continue;
    if ((attrName === "href" || attrName === "src") && !isSafeUrl(attrValue, allowedSchemes)) {
      continue;
    }
    attrOut.push(`${attrName}="${escapeAttributeValue(attrValue)}"`);
  }

  if (name === "a" && parsedAttrs.get("target") === "_blank" && tagAllowed.includes("rel")) {
    if (!attrOut.some((attr) => attr.startsWith("rel="))) {
      attrOut.push('rel="noopener noreferrer"');
    }
  }

  const attrText = attrOut.length > 0 ? ` ${attrOut.join(" ")}` : "";
  const selfClose = selfClosingSlash ? " /" : "";
  return `<${name}${attrText}${selfClose}>`;
}

/**
 * Sanitizes a string that must be allowed to contain a *limited* set of
 * HTML tags (e.g. MOTD content, custom notice bodies). Strips disallowed
 * tags entirely, drops disallowed attributes, removes event-handler
 * attributes (`on*`), and rejects dangerous URL schemes (`javascript:`,
 * `data:text/html`, etc.) in `href`/`src` — including entity-encoded /
 * control-character smuggled forms (`&#106;avascript:`, `javascript&colon;`,
 * `java\tscript:`). When `data` is in `allowedSchemes`, only `data:image/...`
 * payloads are kept.
 *
 * This is a pragmatic allowlist-based sanitizer, not a full HTML parser:
 * - It does not repair malformed/unbalanced markup.
 * - Attribute values containing a literal `>` are not supported.
 * - There is no CSS-safe `style` allowlist; `style` is always dropped.
 *
 * Treat this as an interim safeguard for content that historically stored
 * raw HTML (MOTD, custom notices). Revisit with a dedicated library (e.g.
 * DOMPurify) if richer HTML support is required.
 */
export function sanitizeHtml(input: unknown, options: SanitizeHtmlOptions = {}): string {
  if (input === null || input === undefined) return "";
  const raw = String(input).replace(/<!--[\s\S]*?-->/g, "");

  const allowedTags = new Set((options.allowedTags ?? DEFAULT_ALLOWED_TAGS).map((tag) => tag.toLowerCase()));
  const allowedAttributes = options.allowedAttributes ?? DEFAULT_ALLOWED_ATTRIBUTES;
  const allowedSchemes = options.allowedSchemes ?? DEFAULT_ALLOWED_SCHEMES;

  const tagPattern = new RegExp(TAG_PATTERN_SOURCE, "g");
  let output = "";
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(raw)) !== null) {
    const [fullMatch, closingSlash, tagName = "", attrString = "", selfClosingSlash] = match;
    output += escapeStrayAngleBrackets(raw.slice(lastIndex, match.index));
    output += sanitizeTag(
      closingSlash,
      tagName,
      attrString,
      selfClosingSlash,
      allowedTags,
      allowedAttributes,
      allowedSchemes
    );
    lastIndex = match.index + fullMatch.length;
  }
  output += escapeStrayAngleBrackets(raw.slice(lastIndex));
  return output;
}
