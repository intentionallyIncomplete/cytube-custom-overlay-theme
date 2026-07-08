## Objective

Merge `feature-audio-enhancer.js` into `feature-audio-boost.js`, deploy an owned CORS proxy worker, and delete the enhancer module.

**Decision:** MERGE into `feature-audio-boost.js`; DELETE `feature-audio-enhancer.js`

## Details

Two parallel implementations (~2100 lines combined) target the same overlay buttons and Web Audio pipeline. Channel theme admin toggle exists but admin panel is stripped — users only see always-on boost from `feature:audioboost`.

### Implementation plan

#### 1. Deploy owned Cloudflare CORS proxy worker

Replace inaccessible `vidprox.billtube.workers.dev` with a worker we control.

| Item | Spec |
|------|------|
| Request | `GET /?url=<encodeURIComponent(originalVideoUrl)>` |
| Behavior | Server-side fetch, stream body to client |
| Response | `Access-Control-Allow-Origin: *`, support `Range` / `206` |
| Scope | Fallback only for hosts without CORS |

#### 2. Trusted-domain policy

Replace exact-host `TRUSTED_DOMAINS` with `*.workers.dev` suffix match — skip proxy, use `crossOrigin('anonymous')` + Web Audio chain directly.

#### 3. Merge enhancer into boost

| Keep from enhancer | Action |
|--------------------|--------|
| `#btfw-vo-audionorm` button + preset menu | Port into boost; boot with boost |
| Norm Web Audio chain | Wire UI only (`BTFW_AUDIO` already has compressor) |
| Integration gate / duplicate engine | Drop |

| Keep from boost | Action |
|-----------------|--------|
| `BTFW_AUDIO` engine + watchdog | Retain with new trusted/proxy policy |
| `#btfw-vo-audioboost` button | Retain, always shown for direct media |
| `feature:audioboost` boot init | Sole entry point |

#### 4. Remove dead code

| File / location | Change |
|-----------------|--------|
| `modules/feature-audio-enhancer.js` | Delete |
| `scripts/build.js` player bundle | Remove enhancer entry |
| `billtube-fw.js` / `src/billtube-fw.js` | Remove `BTFW.init("feature:audioEnhancer")` |
| `modules/feature-channel-theme-admin.js` | Remove `integrations.audioEnhancer` toggle + sync |
| `feature:audionorm` IIFE in boost | Fold into single module |

## Checklist

- [ ] Create and deploy CORS video proxy Cloudflare Worker
- [ ] Update `CORS_PROXY` constant to owned worker URL
- [ ] Replace `TRUSTED_DOMAINS` with `*.workers.dev` suffix match
- [ ] Merge norm button/UI from enhancer into `feature-audio-boost.js`
- [ ] Remove integration gate and duplicate engine
- [ ] Delete `feature-audio-enhancer.js`; update bundle + boot
- [ ] Remove `audioEnhancer` from channel theme admin
- [ ] Smoke test: `*.workers.dev` direct file (boost without proxy), third-party URL (proxy fallback)

## Notes

Source audit: `docs/issue-prep/modules-cleanup.md` (feature-audio-boost + feature-audio-enhancer section).
