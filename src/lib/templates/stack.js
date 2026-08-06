// No import from "../escape-html.js" here: that module is TypeScript (escape-html.ts) and
// tests/unit/templates.test.js loads this file via a plain Node ESM `import`, which (unlike
// esbuild's bundler-style resolution used for the production build) cannot resolve a `.js`
// specifier to a sibling `.ts` file. Escape the 5 HTML-sensitive characters inline instead
// (mirrors src/lib/escape-html.ts's escapeHtml()).
function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Tagged template literal that auto-escapes all interpolated values.
 * Local mirror of `src/lib/escape-html.ts`'s `safeHtml` — kept here because
 * this `.js` file cannot import from the sibling `.ts` module in the Node
 * test runner (see comment above `escapeHtml()`).
 */
function safeHtml(strings, ...values) {
  let result = "";
  for (let i = 0; i < strings.length; i += 1) {
    result += strings[i] ?? "";
    if (i < values.length) {
      result += escapeHtml(values[i]);
    }
  }
  return result;
}

export function addMediaPanelHtml() {
  return `
        <div class="btfw-addmedia-panel__inner">
          <header class="btfw-addmedia-panel__header">
            <nav class="btfw-addmedia-tabs" role="tablist"></nav>
            <button type="button" class="btfw-addmedia-close" aria-label="Close add media">
              <span aria-hidden="true">&times;</span>
            </button>
          </header>
          <div class="btfw-addmedia-panel__body">
            <div class="btfw-addmedia-views"></div>
            <p class="btfw-addmedia-help">Queue media by URL or browse your library without leaving the playlist.</p>
          </div>
        </div>
      `;
}

export function stackGroupHeaderHtml(title) {
  return safeHtml`
      <span class="btfw-stack-item__title">${title}</span>
      <div class="btfw-stack-header-toolbar">
        <span class="btfw-stack-header-actions"></span>
        <span class="btfw-stack-arrows">
          <button type="button" class="btfw-arrow btfw-up" aria-label="Move panel up">↑</button>
          <button type="button" class="btfw-arrow btfw-down" aria-label="Move panel down">↓</button>
        </span>
      </div>
    `;
}

export function panelsMenuButtonHtml() {
  return '<span class="btfw-panels-menu-btn__label">Panels</span>';
}

export function panelUndockIconHtml() {
  return '<i class="fa fa-thumb-tack" aria-hidden="true"></i>';
}

export function playlistAddFormHtml() {
  return `
      <label class="btfw-panel-playlist__link-label">
        <span class="btfw-panel-playlist__link-caption">Link</span>
        <input type="url" class="btfw-panel-playlist__link-input input is-small" placeholder="https://..." autocomplete="off" required>
      </label>
      <div class="btfw-panel-playlist__add-actions">
        <button type="submit" class="button is-small is-primary btfw-panel-playlist__submit">Add to queue</button>
      </div>
    `;
}

export function addMediaButtonHtml() {
  return `<span data-btfw-icon-slot="stack-add-media" aria-hidden="true"><i class="fa fa-plus"></i></span><span>Add media</span>`;
}
