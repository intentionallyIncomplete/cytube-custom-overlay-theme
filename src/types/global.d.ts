export {};

declare global {
  // Global variables provided by CyTube environment
  interface Window {
    CHANNEL: {
      name: string;
      emotes: Array<{ name: string; image: string }>;
      modules?: Record<string, any>;
      [key: string]: any;
    };
    CLIENT: {
      name: string;
      rank: number;
      [key: string]: any;
    };
    hasPermission: (permission: string) => boolean;
    $: any; // jQuery
    socket: {
      emit: (event: string, data?: any) => void;
      on: (event: string, callback: (...args: any[]) => void) => void;
      [key: string]: any;
    };
    BTFW?: {
      define: (moduleName: string, deps: string[], factory: () => void | Promise<void>) => void;
      require: (moduleName: string) => any;
      onInit: (callback: () => void) => void;
      [key: string]: any;
    };
  }

  const $: any; // Global jQuery
  const CHANNEL_NAME: string;
  const BTFW: NonNullable<Window['BTFW']>;
}
