/* BTFW — feature:layout (thin registration shell; all logic split into modules) */
BTFW.define("feature:layout", ["feature:styleCore", "feature:themeMode"], async ({ init }) => {

  // Shared mutable state object — one per session, passed to every domain factory.
  const state = {
    videoColumnPx: null,
    videoColumnRatio: null,
    chatSidePref: "right",
    isVertical: false,
    navAutohideActive: false,
    navAutohideHidden: false
  };

  // Domain factories — each owns its own concern; they all receive the same state.
  const columns = init("util:layout-columns", { state });
  const viewport = init("util:layout-viewport", { state, columns });

  // Wire the shell-level callbacks the domains call back into.
  function onColumnTemplateApplied() {
    // no-op; each domain's applyColumnTemplate() calls its own ctx.onColumnTemplateApplied()
  }
  function onCommitFinalize() {
    columns.makeResizable();
  }

  // Hook the domains' required callbacks.
  columns.onColumnTemplateApplied = onColumnTemplateApplied;
  viewport.onCommitFinalize = onCommitFinalize;

  // Initialise all domains (order is intentional: state → columns → viewport).
  columns.loadVideoColumnWidth();
  columns.applyColumnTemplate();
  viewport.ensureShell();
  viewport.commitLayout();

  return {
    name: "feature:layout",
    state
  };
});