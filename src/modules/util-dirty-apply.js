import {
  createDirtyApplyController,
  eventTargetIsInsideIgnoredRoot,
  isHTMLButtonElement,
  isHTMLElement,
  isPersistFailure,
  isPersistSuccess,
  setApplyButtonVisible
} from "../lib/dirty-apply.js";

BTFW.define("util:dirtyApply", [], async () => ({
  name: "util:dirtyApply",
  createDirtyApplyController,
  setApplyButtonVisible,
  eventTargetIsInsideIgnoredRoot,
  isHTMLElement,
  isHTMLButtonElement,
  isPersistSuccess,
  isPersistFailure
}));
