import { createBtfwState, installLegacyStateShims } from "../lib/btfw-state.js";

BTFW.define("util:state", [], async () => {
  const state = createBtfwState();
  installLegacyStateShims(state);
  if (typeof window !== "undefined" && window.BTFW) {
    window.BTFW.state = state;
  }
  return {
    name: "util:state",
    state,
    installLegacyStateShims
  };
});
