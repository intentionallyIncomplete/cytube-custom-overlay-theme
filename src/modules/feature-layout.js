/* BTFW — feature:layout (thin registration shell; all logic split into modules) */
import { createLayoutColumnsDomain } from "./layout/layout-columns.js";
import { createLayoutViewportDomain } from "./layout/layout-viewport.js";

BTFW.define("feature:layout", ["feature:styleCore", "feature:themeMode"], async () => {

  // Shared mutable state object — one per session, passed to every domain factory.
  const state = {
    videoColumnPx: null,
    videoColumnRatio: null,
    chatSidePref: "right",
    isVertical: false,
    navAutohideActive: false,
    navAutohideHidden: false
  };

  // Direct ESM imports (#247): the registry's init(moduleName) resolves cross-bundle
  // module ids and passes no context, so layout domains are wired here as plain
  // factory calls instead of undefined "util:layout-*" registry entries.
  const columns = createLayoutColumnsDomain({
    state,
    onColumnTemplateApplied: () => {
      // Post-template re-alignment is owned by layout-viewport's
      // updateResponsiveLayout() rAF tail; nothing extra needed here.
    }
  });
  const viewport = createLayoutViewportDomain({
    state,
    columns,
    onCommitFinalize: () => columns.makeResizable()
  });

  // Initialise all domains (order is intentional: state → columns → viewport).
  columns.loadVideoColumnWidth();
  columns.loadVerticalVideoHeight();
  state.chatSidePref = columns.getStoredChatSide();
  columns.applyColumnTemplate();
  viewport.ensureShell();
  viewport.commitLayout();

  // Wire vertical resizable after commitLayout creates the elements
  columns.makeVerticalResizable();

  return {
    name: "feature:layout",
    state,
    commitLayout: viewport.commitLayout
  };
});