# [1.4.0](https://github.com/intentionallyIncomplete/BillTube3-slim/compare/v1.3.1...v1.4.0) (2026-06-11)


### Features

* **dev:** local asset server and generic BASE for CyTube dev stack ([593d609](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/593d6094016ef7acc9f87a3d362d5308297e8707))

## [1.3.1](https://github.com/intentionallyIncomplete/BillTube3-slim/compare/v1.3.0...v1.3.1) (2026-06-09)


### Bug Fixes

* **sync:** restore playback sync on mid-playback channel JS load ([#54](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/54)) ([9979c4b](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/9979c4bfe38510e1bf21377f8c03636af0fe81ba))

# [1.3.0](https://github.com/intentionallyIncomplete/BillTube3-slim/compare/v1.2.1...v1.3.0) (2026-06-08)


### Features

* **ui:** polish stack, polls, video toolbar, and now playing ([#50](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/50)) ([ef5f589](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/ef5f5893983eb4b63557c884b81e944436a3505d))

## [1.2.1](https://github.com/intentionallyIncomplete/BillTube3-slim/compare/v1.2.0...v1.2.1) (2026-06-04)


### Bug Fixes

* **player:** resolve HTMLMediaElement for audio Web Audio chain ([#48](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/48)) ([81a32f7](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/81a32f773f2c8ca2e7942a6607576f90f9dc9747))

# [1.2.0](https://github.com/intentionallyIncomplete/BillTube3-slim/compare/v1.1.1...v1.2.0) (2026-06-04)


### Features

* **ui:** rebrand User Preferences General and hydrate Recent Updates ([#46](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/46)) ([e6daffe](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/e6daffe3c34eca6ff49a1ee19670902938b38844))

## [1.1.1](https://github.com/intentionallyIncomplete/BillTube3-slim/compare/v1.1.0...v1.1.1) (2026-06-04)


### Bug Fixes

* **boot:** bundle and init feature:audioEnhancer after dev mode removal ([e0b5156](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/e0b51561f730943be5650b16299d2fd5521bdaef))
* **player:** filter invalid recent suggestions and slim boot ([8306a3b](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/8306a3b6cfa9620e1689189ecbdf4c7240662565))
* **player:** recent suggestions filter and slim boot cleanup ([e8b7001](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/e8b70011b93f6b8a070dc2b1631603b50ca61c69)), closes [#44](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/44)

# [1.1.0](https://github.com/intentionallyIncomplete/BillTube3-slim/compare/v1.0.7...v1.1.0) (2026-06-02)


### Features

* **ui:** minimal UI refresh — squarer panels, hidden footer, v1.0.8 ([#39](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/39))Strip ko-fi, disclaimer, and framework branding from the page footer and hidethe stack footer host. Tighten the visual system with 4px radius tokens, lightershadows, and consistent spacing across base, chat, overlays, and navbar CSS.Align dark-mode Bulma surfaces with the new tokens.Confirm layout default remains video-left / chat-right when no saved pref.Bump package and CDN pin to v1.0.8; rebuild dist bundles. ([6982d38](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/6982d389eaf635f00c74405fa2882ca50986c83c))

## [1.0.7](https://github.com/intentionallyIncomplete/BillTube3-slim/compare/v1.0.6...v1.0.7) (2026-05-27)

## [1.0.6](https://github.com/intentionallyIncomplete/BillTube3-slim/compare/v1.0.5...v1.0.6) (2026-05-26)


### Bug Fixes

* issue [#32](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/32) ([511ffcc](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/511ffcc3a5b6b4376d752b9aa85dc6c5d4279d34))
* use published @semantic-release/exec@^7.1.0 ([e4b188e](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/e4b188ec247b331da2b9fb68250aa194a3d23cf7))

## [1.0.5](https://github.com/intentionallyIncomplete/BillTube3-slim/compare/v1.0.4...v1.0.5) (2026-05-25)


### Bug Fixes

* issue [#29](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/29) ([1143c69](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/1143c69d41a7e2f84bb8cb7cc12bc3cfa36a186e))

## [1.0.4](https://github.com/intentionallyIncomplete/BillTube3-slim/compare/v1.0.3...v1.0.4) (2026-05-25)


### Bug Fixes

* issue [#29](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/29) ([4cade2f](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/4cade2ff270b547bc351962b2ff76b988add690b))

## [1.0.3](https://github.com/intentionallyIncomplete/BillTube3-slim/compare/v1.0.2...v1.0.3) (2026-05-25)


### Bug Fixes

* issue[#22](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/22) ([a7985c7](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/a7985c79ec651c199e7091deaf120477a0304e08))

## [1.0.2](https://github.com/intentionallyIncomplete/BillTube3-slim/compare/v1.0.1...v1.0.2) (2026-05-25)


### Bug Fixes

* fix release versioning by enforcing commit message formatting ([ae5fd90](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/ae5fd903ead240900e48b2041b9effb4a0d0711f))
* issue[#22](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/22) ([e401e0c](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/e401e0c266b0549f3c84a57cc8059db410ba2dc0))
* issue[#22](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/22) ([9ace909](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/9ace90984df955b139aa3cfa1556b975a7184d35))
* issue[#22](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/22) ([6b01ae1](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/6b01ae190c4a642987456f350d559b7d0bc7dca7))

## [1.0.1](https://github.com/intentionallyIncomplete/BillTube3-slim/compare/v1.0.0...v1.0.1) (2025-11-09)


### Bug Fixes

* simplify CDN loader and fix fallback URL (closes [#11](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/11)) ([4bf7bd8](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/4bf7bd81009831599bede670d5009597618fbbbb))

# 1.0.0 (2025-11-09)


### Bug Fixes

* resolve bundles undefined error (closes [#7](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/7)) ([d7f361d](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/d7f361d806db91f3663c16a0bc56f062c021da00))


### Features

* add automated release workflow ([4219f29](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/4219f296770ce407b9e11d52d61e9d64620263e0))
* Commit the correct node modules ( fixes issue [#4](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/4)) ([85ac865](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/85ac865f06bab611676723e944f5ca11cacf8191))
* disable husky hooks in ci ([f23c121](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/f23c1216767c1e6280c35c9d19c994bff99a36c5))
* fix package-lock.json (fixes [#4](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/4)) ([da4ca58](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/da4ca580eb14892b5f0bc7645a9717c0218c0cb0))
* restyle videojs player ([950434c](https://github.com/intentionallyIncomplete/BillTube3-slim/commit/950434c375e3aef468ffe7815d9992a6c632e695))
