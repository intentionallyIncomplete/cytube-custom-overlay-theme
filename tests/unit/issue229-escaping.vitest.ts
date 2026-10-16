import { describe, expect, it } from "vitest";

import { escapeHtml } from "../../src/lib/escape-html";

// Issue #229 regression coverage: the user-controlled escaping paths that the
// #201 remediation wired into the motd editor fallback textarea and the
// movie-suggestions result renderer must keep neutralizing markup-breaking
// payloads. These tests mirror the exact escapeHtml() calls those modules make
// (see docs/INNERHTML-AUDIT.md CRITICAL section).

describe("issue #229 escaping regression coverage", () => {
  it("escapes a script payload interpolated into the motd fallback textarea", () => {
    const initialHTML = '<script>alert("xss")</script>';
    const rendered = `<textarea class="textarea">${escapeHtml(initialHTML)}</textarea>`;
    expect(rendered).not.toContain("<script");
    expect(rendered).toContain("&lt;script&gt;");
    expect(rendered).toContain("&quot;xss&quot;");
  });

  it("escapes an img-onerror payload interpolated as a movie title attribute", () => {
    const title = '"><img src=x onerror=alert(1)>';
    const attr = `data-title="${escapeHtml(title)}"`;
    expect(attr).not.toContain("<img");
    expect(attr).toContain("&lt;img");
    expect(attr).toBe('data-title="&quot;&gt;&lt;img src=x onerror=alert(1)&gt;"');
  });

  it("escapes a quote-breakout attempt in a movie id attribute", () => {
    const id = '1" onmouseover="alert(1)';
    const attr = `data-id="${escapeHtml(id)}"`;
    expect(attr).toBe('data-id="1&quot; onmouseover=&quot;alert(1)"');
  });

  it("cannot break out of the attribute context via a poster path", () => {
    const poster = 'x" onerror="alert(1)';
    const src = `src="${escapeHtml(poster)}"`;
    expect(src).toBe('src="x&quot; onerror=&quot;alert(1)"');
    expect(src).not.toContain('" onerror="');
  });

  it("renders empty string for null/undefined fields", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });
});
