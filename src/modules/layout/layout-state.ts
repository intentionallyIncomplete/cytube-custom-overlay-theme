/**
 * Shared layout state + constants (#203 layout split).
 *
 * The mutable layout state lives in one object created by the feature:layout
 * shell and passed to every layout domain factory, so the split modules stay
 * instantiation-order safe and free of module-level singletons.
 */
import { LS_KEYS } from "../../lib/btfw-constants.js";

export const NAV_HOST_ID = "btfw-navhost";
export const VIDEO_MIN_PX = 520;
export const DEFAULT_VIDEO_TARGET = 680;
export const CHAT_MIN_PX = 360;
export const WIDTH_BUFFER = 20;
export const MOBILE_THRESHOLD_MIN = 900;
export const MOBILE_THRESHOLD_MAX = 1100;
export const STACK_HYSTERESIS_PX = 40;
export const MIN_VIDEO_RATIO = 0.35;
export const MAX_VIDEO_RATIO = 0.78;
export const DEFAULT_VIDEO_RATIO = 0.62;
export const VIDEO_MIN_HEIGHT_PX = 180;

export const SPLIT_KEY = "btfw:grid:leftPx";
/** "right" = video left, chat right (default). "left" = chat left, video right. */
export const CHAT_SIDE_KEY = "btfw:layout:chatSide";
export const RATIO_KEY = "btfw:grid:videoRatio";
export const VERTICAL_RATIO_KEY = "btfw:grid:verticalVideoRatio";
export const VERTICAL_VIDEO_MIN_PX = 180;
export const VERTICAL_CHAT_MIN_PX = 220;

export interface LayoutState {
  videoColumnPx: number | null;
  videoColumnRatio: number | null;
  chatSidePref: "left" | "right";
  isVertical: boolean;
  navAutohideActive: boolean;
  navAutohideHidden: boolean;
}

export function createLayoutState(): LayoutState {
  return {
    videoColumnPx: null,
    videoColumnRatio: null,
    chatSidePref: "right",
    isVertical: false,
    navAutohideActive: false,
    navAutohideHidden: false
  };
}
