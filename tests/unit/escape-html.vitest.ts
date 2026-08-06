import { describe, expect, it } from "vitest";

import { escapeHtml, safeHtml, sanitizeHtml } from "../../src/lib/escape-html";

describe("escapeHtml", () => {
  it("escapes the five HTML-sensitive characters", () => {
    expect(escapeHtml(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&#39;");
  });

  it("leaves plain text untouched", () => {
    expect(escapeHtml("Rock and Roll")).toBe("Rock and Roll");
  });

  it("coerces non-string values", () => {
    expect(escapeHtml(42)).toBe("42");
    expect(escapeHtml(true)).toBe("true");
  });

  it("returns an empty string for null/undefined", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });

  it("neutralizes a classic script injection payload", () => {
    expect(escapeHtml("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"
    );
  });

  it("neutralizes an img onerror payload", () => {
    expect(escapeHtml(`<img src=x onerror="alert(1)">`)).toBe(
      "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"
    );
  });
});

describe("sanitizeHtml", () => {
  it("returns an empty string for null/undefined", () => {
    expect(sanitizeHtml(null)).toBe("");
    expect(sanitizeHtml(undefined)).toBe("");
  });

  it("keeps allowed formatting tags", () => {
    expect(sanitizeHtml("<b>bold</b> and <i>italic</i>")).toBe(
      "<b>bold</b> and <i>italic</i>"
    );
  });

  it("strips disallowed tags but keeps inert inner text", () => {
    expect(sanitizeHtml("<script>alert(1)</script>")).toBe("alert(1)");
    expect(sanitizeHtml("<iframe src='//evil.example'></iframe>")).toBe("");
  });

  it("removes event handler attributes", () => {
    expect(sanitizeHtml(`<img src="pic.png" onerror="alert(1)">`)).toBe(
      `<img src="pic.png">`
    );
  });

  it("removes javascript: and data: URL schemes from href/src", () => {
    expect(sanitizeHtml(`<a href="javascript:alert(1)">click</a>`)).toBe(
      "<a>click</a>"
    );
    expect(sanitizeHtml(`<img src="data:text/plain;base64,aGVsbG8=">`)).toBe("<img>");
  });

  it("removes entity-encoded and control-smuggled javascript: URLs", () => {
    expect(sanitizeHtml(`<a href="&#106;avascript:alert(1)">click</a>`)).toBe(
      "<a>click</a>"
    );
    expect(sanitizeHtml(`<a href="java&#115;cript:alert(1)">click</a>`)).toBe(
      "<a>click</a>"
    );
    expect(sanitizeHtml(`<a href="javascript&colon;alert(1)">click</a>`)).toBe(
      "<a>click</a>"
    );
    expect(sanitizeHtml(`<a href="java\tscript:alert(1)">click</a>`)).toBe(
      "<a>click</a>"
    );
  });

  it("keeps safe http/https href values", () => {
    expect(sanitizeHtml(`<a href="https://example.com">link</a>`)).toBe(
      `<a href="https://example.com">link</a>`
    );
  });

  it("allows data:image when data is in allowedSchemes, rejects data:text/html", () => {
    const opts = {
      allowedTags: ["img"],
      allowedAttributes: { img: ["src"] },
      allowedSchemes: ["http", "https", "data"]
    };
    expect(
      sanitizeHtml(`<img src="data:image/png;base64,aaaa">`, opts)
    ).toBe(`<img src="data:image/png;base64,aaaa">`);
    expect(
      sanitizeHtml(`<img src="data:text/html,alert(1)">`, opts)
    ).toBe("<img>");
  });

  it("forces rel=noopener when target=_blank", () => {
    expect(sanitizeHtml(`<a href="https://example.com" target="_blank">link</a>`)).toBe(
      `<a href="https://example.com" target="_blank" rel="noopener noreferrer">link</a>`
    );
  });

  it("drops disallowed attributes such as style", () => {
    expect(sanitizeHtml(`<div style="background:url(javascript:alert(1))">hi</div>`)).toBe(
      "<div>hi</div>"
    );
  });

  it("escapes stray angle brackets in text content", () => {
    expect(sanitizeHtml("5 < 10 and 10 > 5")).toBe("5 &lt; 10 and 10 &gt; 5");
  });

  it("preserves pre-existing named entities in text content", () => {
    expect(sanitizeHtml("Tom &amp; Jerry")).toBe("Tom &amp; Jerry");
  });

  it("strips HTML comments", () => {
    expect(sanitizeHtml("<!-- evil --><b>ok</b>")).toBe("<b>ok</b>");
  });

  it("respects custom allowedTags/allowedAttributes options", () => {
    expect(
      sanitizeHtml(`<p class="x" data-foo="bar">hi</p>`, {
        allowedTags: ["p"],
        allowedAttributes: { p: ["data-foo"] }
      })
    ).toBe(`<p data-foo="bar">hi</p>`);
  });
});

describe("safeHtml", () => {
  it("auto-escapes interpolated values", () => {
    const payload = "<script>alert('xss')</script>";
    expect(safeHtml`<span>${payload}</span>`).toBe(
      "<span>&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;</span>"
    );
  });

  it("passes static parts verbatim when there are no interpolations", () => {
    expect(safeHtml`<b>bold</b>`).toBe("<b>bold</b>");
  });

  it("returns empty string for null/undefined interpolations", () => {
    expect(safeHtml`<span>${null}</span>`).toBe("<span></span>");
    expect(safeHtml`<span>${undefined}</span>`).toBe("<span></span>");
  });

  it("coerces numeric and boolean interpolations safely", () => {
    expect(safeHtml`<span>${42}</span>`).toBe("<span>42</span>");
    expect(safeHtml`<span>${true}</span>`).toBe("<span>true</span>");
  });

  it("escapes each interpolation independently", () => {
    const a = "<em>";
    const b = "</em>";
    expect(safeHtml`A:${a} B:${b}`).toBe("A:&lt;em&gt; B:&lt;/em&gt;");
  });

  it("escapes values in attribute context", () => {
    const url = '" onclick="alert(1)';
    const label = "<img src=x onerror=alert(1)>";
    expect(safeHtml`<a href="${url}">${label}</a>`).toBe(
      '<a href="&quot; onclick=&quot;alert(1)">&lt;img src=x onerror=alert(1)&gt;</a>'
    );
  });
});
