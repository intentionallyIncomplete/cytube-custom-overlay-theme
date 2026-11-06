/**
 * Movie-info checkbox in Theme Settings.
 * The dirty-apply snapshot must include this control or toggling it never
 * reveals Apply, and closing the modal drops the change.
 */

export const MOVIE_INFO_TOGGLE_SELECTOR = "#btfw-movie-info-enabled";

export interface QueryRoot {
  querySelector(selector: string): unknown;
}

interface Checkable {
  checked?: boolean;
}

function movieInfoInput(root: QueryRoot | null | undefined): Checkable | null {
  if (!root) return null;
  const found = root.querySelector(MOVIE_INFO_TOGGLE_SELECTOR);
  if (!found || typeof found !== "object") return null;
  return found as Checkable;
}

export function readMovieInfoToggle(root: QueryRoot | null | undefined): boolean {
  return !!movieInfoInput(root)?.checked;
}

export function writeMovieInfoToggle(root: QueryRoot | null | undefined, enabled: boolean): void {
  const input = movieInfoInput(root);
  if (!input) return;
  input.checked = !!enabled;
}
