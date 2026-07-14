import {
  findUserlistItem,
  normalizeUserIdentifier
} from "../lib/find-userlist-item.js";

BTFW.define("util:dom", [], async () => ({
  name: "util:dom",
  findUserlistItem,
  normalizeUserIdentifier
}));
