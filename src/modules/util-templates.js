import * as chat from "../lib/templates/chat.js";
import * as stack from "../lib/templates/stack.js";
import * as channelThemeAdmin from "../lib/templates/channel-theme-admin.js";

BTFW.define("util:templates", [], async () => ({
  name: "util:templates",
  chat,
  stack,
  channelThemeAdmin
}));
