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

/** BTFW version, injected at build time via scripts/build-options.js. */
declare const __BTFW_VERSION__: string;

/** VerifyResult type for JSDoc (supports union types in checkJs). */
// @ts-nocheck-next-line
interface VerifyResult {
  ok: boolean;
  reason?: string;
}

interface CytubeClientLike {
  hasPermission?: (permission: string) => boolean;
  rank?: number;
  login?: string;
  /** Channel name fallback used by theme-admin branding. */
  channel?: string;
}

/** Minimal video.js player facade used by the audio engine. */
interface VideoJsPlayerLike {
  currentSrc(): string;
  crossOrigin(value?: string | null): unknown;
  src(source: { src: string; type: string }): void;
  load(): void;
  play(): Promise<void>;
  pause(): void;
  paused(): boolean;
  currentTime(time?: number): number;
  one(event: string, handler: () => void): void;
  on(event: string, handler: () => void): void;
  off(event: string, handler: () => void): void;
  ready(callback: () => void): unknown;
  readyState(): number;
  tech_?: {
    el_?: HTMLMediaElement | null;
    el?: (() => Element) | Element;
  };
}

/** Normalization compressor preset. */
interface BtfwNormPreset {
  threshold: number;
  knee: number;
  ratio: number;
  attack: number;
  release: number;
  label: string;
}

/** BTFW audio engine singleton (from src/modules/audio/audio-engine.ts). */
interface BtfwAudioEngine {
  audioContext: AudioContext | null;
  sourceNode: MediaElementAudioSourceNode | null;
  _sourceMediaElement: HTMLMediaElement | null;
  compressorNode: DynamicsCompressorNode | null;
  gainNode: GainNode | null;
  splitterNode: ChannelSplitterNode | null;
  monoMixGain: GainNode | null;
  mergerNode: ChannelMergerNode | null;
  player: VideoJsPlayerLike | null;
  originalSrc: string | null;
  proxiedSrc: string | null;
  isProxied: boolean;
  boostEnabled: boolean;
  normalizationEnabled: boolean;
  monoEnabled: boolean;
  readonly CORS_PROXY: string;
  BOOST_MULTIPLIER: number;
  currentNormPreset: string;
  NORM_PRESETS: Record<string, BtfwNormPreset>;

  // Watchdog/rebuild internals retained on the singleton.
  _watchdogInterval: ReturnType<typeof setInterval> | null;
  _mutationObserver: MutationObserver | null;
  _sourceObserver: MutationObserver | null;
  _watchdogPlayerHandlers: Record<string, () => void> | null;
  _visibilityHandler: (() => void) | null;
  _lastKnownSrc: string | null;
  _lastInternalSrcSetAt: number;
  _lastAutoReapplyAt: number;
  _rebuildInFlight: Promise<boolean> | null;

  // Core utilities
  _getCorsProxyOrigin(): string;
  _isTrusted(urlStr: string): boolean;
  _unwrapProxiedUrl(urlStr: string): string;
  _markInternalSrcSet(): void;
  _isInsideInternalWindow(): boolean;
  _shouldForceProxy(): boolean;
  _hasAnonymousCrossOrigin(): boolean;
  _ensureAnonymousCrossOrigin(): boolean;
  _clearMediaElementForCorsSwap(): void;
  _same(a: unknown, b: unknown): boolean;
  _getMediaElement(): HTMLMediaElement | null;
  _readCurrentSrc(): string;
  _hasIframeOnlyMedia(): boolean;

  // Chain lifecycle
  disconnectChain(): void;
  resetMediaBinding(): void;
  _swapVideoTechElement(videoEl: HTMLMediaElement): HTMLMediaElement | null;
  _syncFromRegistry(videoEl: HTMLMediaElement): MediaElementAudioSourceNode | null;
  _getOrCreateSourceNode(videoEl: HTMLMediaElement): MediaElementAudioSourceNode;
  _connectPassthrough(): boolean;
  _clearCrossOriginAttribute(): void;
  cleanup(): void;
  _disableAllProcessing(): Promise<boolean>;
  _restorePlayerSrc(
    src: string,
    opts?: { currentTime?: number; wasPlaying?: boolean; clearCrossOrigin?: boolean }
  ): Promise<boolean>;

  // Watchdog
  startWatchdog(): void;
  _startWatchdogInterval(): void;
  _stopWatchdogInterval(): void;
  _onVisibilityChange(): void;
  stopWatchdog(): void;
  _checkAndReapply(reason: string): void;
  _forceProxyPreservingState(currentSrc: string): Promise<boolean>;

  // Proxy/application + toggles
  ensureProxy(): Promise<boolean>;
  rebuildAudioChain(): Promise<boolean>;
  _rebuildAudioChainImpl(): Promise<boolean>;
  enableBoost(): Promise<boolean>;
  disableBoost(): Promise<boolean>;
  enableNormalization(): Promise<boolean>;
  setNormPreset(presetKey: string): Promise<boolean>;
  setBoostMultiplier(multiplier: number): Promise<boolean>;
  disableNormalization(): Promise<boolean>;
  enableMono(): Promise<boolean>;
  disableMono(): Promise<boolean>;
}

/** Theme config injected by the loader. */
interface BtfwConfig {
  corsVideoProxy?: string;
  integrations?: { corsVideoProxy?: string };
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

/** video.js global (from videojs CDN or local bundle). */
declare const videojs: unknown;

/** video.js global on globalThis (for patch-vjs-plugin-wait.js). */
interface GlobalScope {
  videojs?: unknown;
}

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
  BTFW_CONFIG?: BtfwConfig;
  BTFW_THEME_ADMIN?: unknown;
  __btfwModuleWatcherCleanupRegistered?: boolean;
  BTFW_AUDIO?: BtfwAudioEngine;
  __btfwMediaSourceNodes?: WeakMap<object, MediaElementAudioSourceNode>;
  /** video.js global. */
  videojs?: unknown;
}

/** Media-source node cache tag written by the audio engine. */
interface HTMLMediaElement {
  __btfwSourceNode?: MediaElementAudioSourceNode;
}

/** Legacy document shims installed by btfw-state.js (installLegacyStateShims). */
interface Document {
  _btfw_userlist_watch?: boolean;
  _btfw_userlist_isOpen?: () => unknown;
  _btfw_userlist_open?: (...args: unknown[]) => unknown;
  _btfw_userlist_close?: (...args: unknown[]) => unknown;
  _btfw_userlist_position?: (...args: unknown[]) => unknown;
  _btfw_nav_setMobileOpen?: (...args: unknown[]) => unknown;
  _btfw_nav_toggleMobile?: (...args: unknown[]) => unknown;
  _btfw_nav_isMobileOpen?: (...args: unknown[]) => unknown;
  _btfw_nav_setMenuOpen?: (...args: unknown[]) => unknown;
  _btfw_nav_toggleMenu?: (...args: unknown[]) => unknown;
  _btfw_openThemeSettings?: (...args: unknown[]) => unknown;
}

/** String.prototype.replaceAll (ES2021) - needed for checkJs on src/lib with ES2019 target. */
interface String {
  replaceAll(searchValue: string | RegExp, replaceValue: string): string;
}


