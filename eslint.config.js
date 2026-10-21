import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import globals from "globals";

const browserGlobals = {
  ...globals.browser,
  BTFW: "readonly",
  socket: "readonly",
  videojs: "readonly",
};

const moduleGlobals = {
  ...browserGlobals,
  CLIENT: "readonly",
  CHANNEL: "readonly",
  USEROPTS: "readonly",
  jQuery: "readonly",
  Callbacks: "readonly",
  parseMediaLink: "readonly",
  makeAlert: "readonly",
  openGifModal: "readonly",
};

const sharedRules = {
  "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  "no-empty": ["error", { allowEmptyCatch: true }],
  "no-console": "off",
  // Issue #202 — storage keys and localStorage access must go through the
  // canonical LS_KEYS registry (src/lib/btfw-constants.js) and the guarded
  // wrapper (src/lib/storage.ts). Adds are allowlisted per-file below.
  "no-restricted-globals": [
    "warn",
    {
      name: "localStorage",
      message:
        "Access localStorage only via src/lib/storage.ts (safeGetItem/safeSetItem/…) with keys from LS_KEYS. New direct uses: add the file to the storageDirectAllowList in eslint.config.js and update scripts/check-storage-keys.js.",
    },
  ],
  // Issue #201 — Task 3.3: warn on direct innerHTML/outerHTML assignment to
  // prevent new raw-HTML sinks. Existing reviewed sites that intentionally use
  // innerHTML (e.g. clearing content with `= ""`, or assigning safeHtml output)
  // should add an inline eslint-disable comment explaining why they are safe.
  "no-restricted-syntax": [
    "warn",
    {
      selector: "AssignmentExpression[left.property.name='innerHTML']",
      message:
        "Avoid `.innerHTML =`. Use `textContent`, `createElement()`, `replaceChildren()`, or the `safeHtml` tagged template from `escape-html.ts`. See docs/INNERHTML-AUDIT.md for guidance.",
    },
    {
      selector: "AssignmentExpression[left.property.name='outerHTML']",
      message:
        "Avoid `.outerHTML =`. Use DOM methods instead. See docs/INNERHTML-AUDIT.md.",
    },
  ],
};

// Files allowed to touch localStorage directly (checked verbatim by
// scripts/check-storage-keys.js — keep both lists in sync):
//   - btfw-constants.js owns the canonical key strings themselves
//   - storage.ts is the guarded wrapper around the raw API
//   - stack-core.ts keeps its own try/catch persistence helpers (typed,
//     unit-covered, exported through the lib seam)
const storageDirectAllowList = [
  "src/lib/btfw-constants.js",
  "src/lib/storage.ts",
  "src/lib/stack-core.ts",
];

const esmModuleFiles = [
  "tests/**/*.js",
  "playwright.config.js",
  "scripts/**/*.js",
  "src/lib/**/*.js",
  "src/modules/util-constants.js",
  "src/modules/util-storage.js",
  "src/modules/util-dom.js",
  // #202: modules migrated onto LS_KEYS + storage wrapper imports
  "src/modules/feature-chat-avatars.js",
  "src/modules/feature-chat-ignore.js",
  "src/modules/feature-chat-media.js",
  "src/modules/feature-chat-timestamps.js",
  "src/modules/feature-chat-tools.js",
  "src/modules/feature-chat-username-colors.js",
  "src/modules/feature-emoji-compat.js",
  "src/modules/feature-emotes.js",
  "src/modules/feature-gifs.js",
  "src/modules/feature-layout.js",
  "src/modules/feature-modal-skin.js",
  "src/modules/feature-notification-sounds.js",
  "src/modules/feature-notify.js",
  "src/modules/feature-playlist-tools.js",
  "src/modules/feature-theme-mode.js",
  "src/modules/feature-video-overlay.js",
  "src/modules/util-state.js",
  "src/modules/util-templates.js",
  "src/modules/util-chat-autoscroll.js",
  "src/modules/util-theme-presets.js",
  "src/modules/util-dirty-apply.js",
  "src/modules/feature-theme-settings.js",
  "src/modules/feature-nowplaying.js",
  "src/modules/feature-stack.js",
  "src/modules/feature-chat-media.js",
  "src/modules/feature-channel-options-apply.js",
  "src/modules/feature-channel-theme-admin.js",
  "src/modules/feature-motd-editor.js",
  "src/modules/feature-navbar.js",
  "src/modules/feature-notify.js",
  "src/modules/feature-playlist-tools.js",
  "src/modules/feature-movie-suggestions.js",
  "src/modules/feature-audio.js",
  "src/modules/feature-theme-icons.js",
  "src/modules/util-imdb-card.js",
  "src/modules/util-letterboxd.js",
  "src/modules/util-tmdb-card.js",
];

export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "eslint.config.js",
      "stylelint.config.js",
      "lint-staged.config.js",
      "commitlint.config.js",
      "**/*.min.js",
      "css/**",
      "scss/**",
      "src/workers/**",
      ".cursor/**",
      "wiki/**",
      "scripts/.entries/**",
      "channel_config_settings.js",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: browserGlobals,
    },
    rules: sharedRules,
  },
  {
    files: ["src/modules/**/*.js"],
    languageOptions: {
      globals: moduleGlobals,
    },
    rules: {
      "no-redeclare": ["error", { builtinGlobals: false }],
    },
  },
  {
    files: esmModuleFiles,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },
  {
    // Issue #202: allowlisted files may use the raw localStorage global.
    files: storageDirectAllowList,
    rules: {
      "no-restricted-globals": "off",
    },
  },
  {
    files: ["src/modules/user-release-notes.generated.js"],
    rules: {
      "no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-unused-vars": "off",
      // TypeScript owns undefined-name checking (DOM libs include ParentNode, etc.)
      "no-undef": "off",
    },
  },
];
