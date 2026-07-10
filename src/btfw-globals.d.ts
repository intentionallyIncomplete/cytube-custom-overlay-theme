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
}

interface Window {
  BTFW: BtfwRegistryApi;
}
