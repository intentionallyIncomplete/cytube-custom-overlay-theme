/** Pure helper for now-playing title overflow measurement (unit-tested). */

export function measureTitleOverflow(outer, inner) {
  if (!outer || !inner) return false;
  const overflows = inner.scrollWidth > outer.clientWidth;
  outer.classList.toggle("is-overflowing", overflows);
  if (overflows) {
    const distance = inner.scrollWidth - outer.clientWidth;
    outer.style.setProperty("--scroll-distance", `${distance}px`);
    const duration = Math.max(4, Math.min(20, distance / 24));
    outer.style.setProperty("--scroll-duration", `${duration}s`);
    const label = inner.textContent || outer.getAttribute("title") || "";
    if (label) outer.setAttribute("aria-label", label);
  } else {
    outer.style.setProperty("--scroll-distance", "0px");
    outer.removeAttribute("aria-label");
  }
  return overflows;
}
