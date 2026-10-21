import {
  getJsonItem,
  safeGetItem,
  safeRemoveItem,
  safeSetItem,
  setJsonItem,
  storageAvailable
} from "../lib/storage.js";

BTFW.define("util:storage", [], async () => ({
  name: "util:storage",
  storageAvailable,
  getItem: safeGetItem,
  setItem: safeSetItem,
  removeItem: safeRemoveItem,
  getJson: getJsonItem,
  setJson: setJsonItem
}));
