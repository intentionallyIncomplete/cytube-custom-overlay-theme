interface BtfwAppState {
  userlist: Record<string, unknown>;
  nav: Record<string, unknown>;
  theme: Record<string, unknown>;
  chat: Record<string, unknown>;
}

interface BtfwRegistryApi {
  define(
    moduleName: string,
    moduleDeps: string[] | null,
    functionFactory: (ctx: {
      define: BtfwRegistryApi["define"];
      init: BtfwRegistryApi["init"];
      DEV_CDN: string;
    }) => unknown | Promise<unknown>
  ): void;
  init(moduleName: string): Promise<unknown>;
  DEV_CDN: string;
  BASE: string;
  state: BtfwAppState | null;
  SRI?: Record<string, string>;
}

interface CytubeClientLike {
  hasPermission?: (permission: string) => boolean;
  rank?: number;
  login?: string;
  /** Channel name fallback used by theme-admin branding. */
  channel?: string;
}

interface CytubeSocketLike {
  on(event: string, handler: (...args: unknown[]) => void): unknown;
  emit?(event: string, ...args: unknown[]): unknown;
}

/** Minimal jQuery facade used by stack code (data lookups only). */
interface JQueryLike {
  (element: Element): { data(key: string): unknown };
}

/** CyTube media link parser (global from CyTube's util.js). */
declare function parseMediaLink(url: string): { id: unknown; type: string } | null;

interface Window {
  BTFW: BtfwRegistryApi;
  CLIENT?: CytubeClientLike;
  hasPermission?: (permission: string) => boolean;
  RANK?: Record<string, number>;
  Ranks?: Record<string, number>;
  socket?: CytubeSocketLike;
  jQuery?: JQueryLike;
  $?: JQueryLike;
  queue?: (pos: string, type: string) => unknown;
  /** CyTube channel globals consumed by theme-admin. */
  CHANNEL?: { name?: string };
  BTFW_CONFIG?: Record<string, unknown>;
  BTFW_THEME_ADMIN?: unknown;
  __btfwModuleWatcherCleanupRegistered?: boolean;
}
