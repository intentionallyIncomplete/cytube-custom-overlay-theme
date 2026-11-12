import { describe, expect, it } from "vitest";
import { canScrollY, hasScrollableAncestorY, type ScrollBox } from "../../src/lib/wheel-containment.js";

function box(
  parent: ScrollBox | null,
  { scrollTop = 0, clientHeight = 100, scrollHeight = 100 } = {}
): ScrollBox {
  return { scrollTop, clientHeight, scrollHeight, parentElement: parent };
}

describe("canScrollY", () => {
  it("ignores boxes that are not user-scrollable", () => {
    expect(canScrollY(box(null, { scrollHeight: 500 }), 10, "hidden")).toBe(false);
    expect(canScrollY(box(null, { scrollHeight: 500 }), 10, "visible")).toBe(false);
  });

  it("ignores boxes whose content fits", () => {
    expect(canScrollY(box(null), 10, "auto")).toBe(false);
  });

  it("respects the top and bottom edges", () => {
    const top = box(null, { scrollTop: 0, scrollHeight: 500 });
    const bottom = box(null, { scrollTop: 400, scrollHeight: 500 });
    expect(canScrollY(top, -10, "auto")).toBe(false);
    expect(canScrollY(top, 10, "auto")).toBe(true);
    expect(canScrollY(bottom, 10, "scroll")).toBe(false);
    expect(canScrollY(bottom, -10, "scroll")).toBe(true);
  });
});

describe("hasScrollableAncestorY", () => {
  it("is false for a chat input with no scrollable box before the column", () => {
    const page = box(null, { scrollHeight: 3000 });
    const column = box(page);
    const bar = box(column);
    const input = box(bar);
    const overflow = (b: ScrollBox) => (b === page ? "auto" : "hidden");
    expect(hasScrollableAncestorY(input, column, 10, overflow)).toBe(false);
  });

  it("is true when a pane inside the column can scroll", () => {
    const column = box(null);
    const buffer = box(column, { scrollTop: 50, scrollHeight: 500 });
    const line = box(buffer);
    const overflow = (b: ScrollBox) => (b === buffer ? "auto" : "visible");
    expect(hasScrollableAncestorY(line, column, 10, overflow)).toBe(true);
  });

  it("stops at the boundary instead of reaching the page", () => {
    const page = box(null, { scrollHeight: 3000 });
    const column = box(page);
    const overflow = (b: ScrollBox) => (b === page ? "auto" : "visible");
    expect(hasScrollableAncestorY(column, column, 10, overflow)).toBe(false);
  });
});
