/**
 * Per-viewer movie-info overlay preference (localStorage, off by default).
 *
 * The only place that knows the storage key and the change event name, so
 * feature:themeSettings and feature:movie-info never touch either.
 */

import { EVENTS, LS_KEYS } from "./btfw-constants.js";

export type PrefStorage = Pick<Storage, "getItem" | "setItem">;

export interface MovieInfoChangedDetail {
  readonly enabled: boolean;
}

interface PrefDeps {
  readonly storage?: PrefStorage;
  readonly target?: EventTarget;
}

const ON = "1";
const OFF = "0";

export function isMovieInfoEnabled(storage: PrefStorage = localStorage): boolean {
  try {
    return storage.getItem(LS_KEYS.movieInfoEnabled) === ON;
  } catch {
    return false;
  }
}

export function setMovieInfoEnabled(
  enabled: boolean,
  { storage = localStorage, target = document }: PrefDeps = {}
): void {
  try {
    storage.setItem(LS_KEYS.movieInfoEnabled, enabled ? ON : OFF);
  } catch {
    /* private mode / quota: still apply to the current page */
  }
  target.dispatchEvent(
    new CustomEvent<MovieInfoChangedDetail>(EVENTS.movieInfoChanged, { detail: { enabled } })
  );
}

export function onMovieInfoChanged(
  listener: (enabled: boolean) => void,
  target: EventTarget = document
): () => void {
  const handler = (event: Event): void => {
    const detail = (event as CustomEvent<Partial<MovieInfoChangedDetail>>).detail;
    listener(detail?.enabled === true);
  };
  target.addEventListener(EVENTS.movieInfoChanged, handler);
  return () => target.removeEventListener(EVENTS.movieInfoChanged, handler);
}
