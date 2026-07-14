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
};

const esmModuleFiles = [
  "test/**/*.js",
  "scripts/**/*.js",
  "src/lib/**/*.js",
  "src/modules/util-constants.js",
  "src/modules/util-dom.js",
  "src/modules/util-state.js",
  "src/modules/util-templates.js",
  "src/modules/util-chat-autoscroll.js",
  "src/modules/feature-nowplaying.js",
  "src/modules/feature-stack.js",
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
    },
  },
];
