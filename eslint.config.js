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
  "lib/**/*.js",
  "modules/util-constants.js",
  "modules/util-dom.js",
  "modules/util-state.js",
  "modules/util-templates.js",
  "modules/util-chat-autoscroll.js",
];

export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "billtube-fw.js",
      "eslint.config.js",
      "stylelint.config.js",
      "lint-staged.config.js",
      "commitlint.config.js",
      "**/*.min.js",
      "css/**",
      "scss/**",
      "workers/**",
      ".cursor/**",
      "wiki/**",
      "scripts/.entries/**",
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
    files: ["modules/**/*.js"],
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
    files: ["modules/user-release-notes.generated.js"],
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
