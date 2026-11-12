export interface ScrollBox {
  scrollTop: number;
  clientHeight: number;
  scrollHeight: number;
  parentElement: ScrollBox | null;
}

export type OverflowYLookup = (box: ScrollBox) => string;

export function canScrollY(box: ScrollBox, deltaY: number, overflowY: string): boolean {
  if (overflowY !== "auto" && overflowY !== "scroll") return false;
  if (box.scrollHeight <= box.clientHeight + 1) return false;
  return deltaY > 0
    ? box.scrollTop + box.clientHeight < box.scrollHeight - 1
    : box.scrollTop > 0;
}

/** True when some box from `target` up to and including `boundary` can still scroll by `deltaY`. */
export function hasScrollableAncestorY(
  target: ScrollBox | null,
  boundary: ScrollBox,
  deltaY: number,
  getOverflowY: OverflowYLookup
): boolean {
  for (let box = target; box; box = box.parentElement) {
    if (canScrollY(box, deltaY, getOverflowY(box))) return true;
    if (box === boundary) return false;
  }
  return false;
}
