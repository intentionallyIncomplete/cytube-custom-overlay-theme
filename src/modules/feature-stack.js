import { createStackMotd } from "./stack/stack-motd.js";
import { createStackPlaylist } from "./stack/stack-playlist.js";
import { createStackPoll } from "./stack/stack-poll.js";
import { createStackPanelBar } from "./stack/stack-panelbar.js";
import { createStackAssembly } from "./stack/stack-assembly.js";
import {
  MOTD_VISIBILITY_KEY,
  PLAYLIST_VISIBILITY_KEY,
  POLL_VISIBILITY_KEY,
  DOCKED_KEYS,
  GROUP_LABELS,
  GROUPS,
  SKIP_SELECTORS,
  saveStackOrder as save,
  loadStackOrder as load,
  getStoredVisibility,
  storeVisibility,
  getStoredDocked,
  storeDocked,
  isPanelInDrawer,
  applyStoredPanelOpenState,
  dispatchStackVisibility,
} from "../lib/stack-core.js";
import { getDefaultPollOpen, hasPollContent } from "../lib/stack-poll-visibility.js";

BTFW.define("feature:stack", ["feature:layout", "util:templates"], async ({ init }) => {
  const templates = await init("util:templates");
  const { stack: stackTpl } = templates;

  // Sub-domain instances (created before assembly so they are available for injection)
  const motd = createStackMotd();
  const playlist = createStackPlaylist();
  const poll = createStackPoll();
  const panelbar = createStackPanelBar();

  // Assembly sub-domain (#228 Phase 3): the stack shell infrastructure
  // (ensureStack, createGroupItem, visibility/dock wiring, populate, boot,
  // footer/header actions) lives here, not in this shell file.
  const assembly = createStackAssembly({
    tpl: stackTpl,
    motd,
    playlist,
    poll,
    panelbar,
    hasMotdContent: motd.hasMotdContent,
  });

  // Expose the assembly domain's methods as the public shell API so that
  // existing callers (e.g. the panelbar module's boot-time wiring) continue
  // to work without import changes.
  const {
    ensureStack,
    createGroupItem,
    setPanelDocked,
    attachPanelDockButton,
    attachStackVisibilityToggle,
    attachFooter,
    populate,
    boot,
    relocateStackHeaderActions,
  } = assembly;

  document.addEventListener("btfw:layoutReady", boot);
  document.addEventListener("btfw:chat:barsReady", () => {
    panelbar.ensurePanelsMenuShell();
    panelbar.ensurePanelsMenuButton();
    panelbar.syncPanelBar();
  });
  setTimeout(boot, 1200);

  document.addEventListener("btfw:channelThemeTint", () => {
    const refs = ensureStack();
    if (refs) {
      setTimeout(() => populate(refs), 100);
    }
  });

  document.addEventListener("btfw:motd:updated", (event) => {
    const html = event?.detail?.html;
    if (typeof html !== "string") return;
    motd.applyMotdUpdate(html);
  });

  return {
    name: "feature:stack",
    hasMotdContent: motd.hasMotdContent,
    resolveMotdHost: motd.resolveMotdHost,
    normalizeMotdStructure: motd.normalizeMotdStructure,
    applyMotdUpdate: motd.applyMotdUpdate,
  };
});
