import { createStackMotd } from "./stack/stack-motd.js";
import { createStackPlaylist } from "./stack/stack-playlist.js";
import { createStackPoll } from "./stack/stack-poll.js";
import { createStackPanelBar } from "./stack/stack-panelbar.js";
import { createStackAssembly } from "./stack/stack-assembly.js";

BTFW.define("feature:stack", ["feature:layout", "util:templates"], async ({ init }) => {
  const templates = await init("util:templates");
  const { stack: stackTpl } = templates;

  // Sub-domain wiring (#228): every collaborator a sub-domain used to read
  // from the old shell's closures is injected as a thunk that forwards to
  // the assembly domain. Thunks are only invoked at boot/populate time —
  // after `assembly` below is initialized — so the forward references are
  // safe and the assembly <-> sub-domain cycles stay broken (same
  // cycle-breaking pattern the panelbar <-> assembly pair already uses).

  const motd = createStackMotd({
    createGroupItem: (...args) => assembly.createGroupItem(...args),
    ensureStackRefs: () => assembly.ensureStack(),
  });
  const playlist = createStackPlaylist({
    tpl: stackTpl,
    getActiveFlyoutGroup: () => panelbar.getActiveFlyoutGroup(),
  });
  const poll = createStackPoll({
    createGroupItem: (...args) => assembly.createGroupItem(...args),
  });
  const panelbar = createStackPanelBar({
    tpl: stackTpl,
    playlist,
    syncPollWrapVisibility: () => poll.syncPollWrapVisibility(),
    setPanelDocked: (...args) => assembly.setPanelDocked(...args),
    ensureStack: () => assembly.ensureStack(),
  });

  // Assembly sub-domain (#228 Phase 3): the stack shell infrastructure
  // (ensureStack, createGroupItem, visibility/dock wiring, populate, boot,
  // footer/header actions) lives here, not in this shell file. Created last
  // because it consumes every sub-domain above.
  const assembly = createStackAssembly({
    tpl: stackTpl,
    motd,
    playlist,
    poll,
    panelbar,
    hasMotdContent: motd.hasMotdContent,
  });

  const { ensureStack, populate, boot } = assembly;

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
