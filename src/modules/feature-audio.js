// BTFW Audio Processing System - boost, normalization, mono/stereo fix.
// The Web Audio engine (proxy watchdog, chain building, feature toggles)
// lives in ./audio/audio-engine.ts (#228 Phase 3, step 5) and is consumed
// here via the BTFW_AUDIO singleton import.
import { BTFW_AUDIO } from "./audio/audio-engine.js";
// Audio controls module (boost, normalization, mono/stereo)
(function() {
  'use strict';

  const POPOVER_SUPPORTED = typeof HTMLElement !== 'undefined' &&
    Object.hasOwn(HTMLElement.prototype, 'popover');
  const ANCHOR_POSITIONING_SUPPORTED = typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    CSS.supports('position-anchor: --btfw-anchor-probe');
  const BOOST_ANCHOR_NAME = '--btfw-boost-anchor';
  const NORM_ANCHOR_NAME = '--btfw-norm-anchor';

  // Positions a popover/context menu against its trigger button. Prefers CSS
  // anchor positioning (no JS geometry, follows scroll/resize for free) and
  // falls back to getBoundingClientRect() math where unsupported.
  function positionContextMenu(menu, button, anchorName) {
    // Sit flush under the trigger so the pointer never crosses a hover gap
    // between button and menu (top-layer popovers aren't hover-connected).
    if (ANCHOR_POSITIONING_SUPPORTED && anchorName) {
      button.style.setProperty('anchor-name', anchorName);
      menu.style.setProperty('position-anchor', anchorName);
      menu.style.setProperty('top', 'anchor(bottom)');
      menu.style.setProperty('left', 'anchor(left)');
      return;
    }
    const rect = button.getBoundingClientRect();
    menu.style.left = rect.left + 'px';
    menu.style.top = rect.bottom + 'px';
  }

  function whenBTFWReady(callback) {
    if (window.BTFW && typeof BTFW.define === 'function') {
      callback();
    } else {
      setTimeout(() => whenBTFWReady(callback), 0);
    }
  }

  whenBTFWReady(function() {
    BTFW.define("feature:audio", [], async () => {
      const $ = (selector, root = document) => root.querySelector(selector);
      const sharedAudio = BTFW_AUDIO;

      let boostButton = null;
      let normButton = null;
      let monoButton = null;
      let shouldBoostAfterMediaChange = false;
      let shouldNormalizeAfterMediaChange = false;
      let shouldMonoAfterMediaChange = false;
      let boostContextMenu = null;
      let normContextMenu = null;
      let boostMenuHideTimer = null;
      let normMenuHideTimer = null;

      const BOOST_PRESETS = [
        { multiplier: 1.5, label: '150%' },
        { multiplier: 2.5, label: '250%' },
        { multiplier: 3.5, label: '350%' }
      ];

      function updateBoostButtonState(active) {
        if (!boostButton) return;

        if (active) {
          boostButton.classList.add('active');
          boostButton.style.background = 'rgba(46, 213, 115, 0.3)';
          boostButton.style.borderColor = '#2ed573';
          boostButton.style.color = '#2ed573';
          boostButton.style.boxShadow = '0 0 12px rgba(46, 213, 115, 0.6)';
        } else {
          boostButton.classList.remove('active');
          boostButton.style.background = '';
          boostButton.style.borderColor = '';
          boostButton.style.color = '';
          boostButton.style.boxShadow = '';
        }
      }

      function showToast(message, type = 'info') {
        let toast = $('#btfw-audioboost-toast');
        if (!toast) {
          toast = document.createElement('div');
          toast.id = 'btfw-audioboost-toast';
          toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(46, 213, 115, 0.9)' : 'rgba(235, 77, 75, 0.9)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-family: system-ui, -apple-system, sans-serif;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          `;
          document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.background = type === 'success' ? 'rgba(46, 213, 115, 0.9)' : 'rgba(235, 77, 75, 0.9)';
        toast.style.opacity = '1';

        setTimeout(() => { toast.style.opacity = '0'; }, 2000);
      }

      async function activateAudioBoost() {
        const success = await sharedAudio.enableBoost();
        if (success) {
          shouldBoostAfterMediaChange = true;
          const percentage = Math.round(sharedAudio.BOOST_MULTIPLIER * 100);
          showToast(`Boosted by ${percentage}%`, 'success');
          updateBoostButtonState(true);
        } else {
          const msg = sharedAudio._hasIframeOnlyMedia()
            ? 'Audio boost requires direct video playback'
            : 'Failed to activate boost';
          showToast(msg, 'error');
        }
      }

      async function deactivateAudioBoost() {
        await sharedAudio.disableBoost();
        shouldBoostAfterMediaChange = false;
        updateBoostButtonState(false);
      }

      function updateNormButtonState(active) {
        if (!normButton) return;

        if (active) {
          normButton.classList.add('active');
          normButton.style.background = 'rgba(52, 152, 219, 0.3)';
          normButton.style.borderColor = '#3498db';
          normButton.style.color = '#3498db';
          normButton.style.boxShadow = '0 0 12px rgba(52, 152, 219, 0.6)';
        } else {
          normButton.classList.remove('active');
          normButton.style.background = '';
          normButton.style.borderColor = '';
          normButton.style.color = '';
          normButton.style.boxShadow = '';
        }
      }

      function showNormToast(message, type = 'info') {
        let toast = $('#btfw-audionorm-toast');
        if (!toast) {
          toast = document.createElement('div');
          toast.id = 'btfw-audionorm-toast';
          toast.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(52, 152, 219, 0.9)' : 'rgba(235, 77, 75, 0.9)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-family: system-ui, -apple-system, sans-serif;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          `;
          document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.background = type === 'success' ? 'rgba(52, 152, 219, 0.9)' : 'rgba(235, 77, 75, 0.9)';
        toast.style.opacity = '1';

        setTimeout(() => { toast.style.opacity = '0'; }, 2000);
      }

      async function activateNormalization() {
        const success = await sharedAudio.enableNormalization();
        if (success) {
          shouldNormalizeAfterMediaChange = true;
          showNormToast('Normalization enabled', 'success');
          updateNormButtonState(true);
        } else {
          const msg = sharedAudio._hasIframeOnlyMedia()
            ? 'Audio normalization requires direct video playback'
            : 'Failed to activate';
          showNormToast(msg, 'error');
        }
      }

      async function deactivateNormalization() {
        await sharedAudio.disableNormalization();
        shouldNormalizeAfterMediaChange = false;
        updateNormButtonState(false);
      }

      function updateMonoButtonState(active) {
        if (!monoButton) return;

        if (active) {
          monoButton.classList.add('active');
          monoButton.style.background = 'rgba(155, 89, 182, 0.3)';
          monoButton.style.borderColor = '#9b59b6';
          monoButton.style.color = '#9b59b6';
          monoButton.style.boxShadow = '0 0 12px rgba(155, 89, 182, 0.6)';
        } else {
          monoButton.classList.remove('active');
          monoButton.style.background = '';
          monoButton.style.borderColor = '';
          monoButton.style.color = '';
          monoButton.style.boxShadow = '';
        }
      }

      function showMonoToast(message, type = 'info') {
        let toast = $('#btfw-mono-toast');
        if (!toast) {
          toast = document.createElement('div');
          toast.id = 'btfw-mono-toast';
          toast.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(155, 89, 182, 0.9)' : 'rgba(235, 77, 75, 0.9)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-family: system-ui, -apple-system, sans-serif;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          `;
          document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.background = type === 'success' ? 'rgba(155, 89, 182, 0.9)' : 'rgba(235, 77, 75, 0.9)';
        toast.style.opacity = '1';

        setTimeout(() => { toast.style.opacity = '0'; }, 2000);
      }

      async function activateMonoAudio() {
        const success = await sharedAudio.enableMono();
        if (success) {
          shouldMonoAfterMediaChange = true;
          showMonoToast('Stereo audio enabled', 'success');
          updateMonoButtonState(true);
        } else {
          const msg = sharedAudio._hasIframeOnlyMedia()
            ? 'Mono audio requires direct video playback'
            : 'Failed to activate';
          showMonoToast(msg, 'error');
        }
      }

      async function deactivateMonoAudio() {
        await sharedAudio.disableMono();
        shouldMonoAfterMediaChange = false;
        updateMonoButtonState(false);
      }

      function createBoostButton() {
        const btn = document.createElement('button');
        btn.id = 'btfw-vo-audioboost';
        btn.className = 'btn btn-sm btn-default btfw-vo-adopted';
        const percentage = Math.round(sharedAudio.BOOST_MULTIPLIER * 100);
        btn.title = `Toggle Audio Boost (${percentage}%)`;
        btn.setAttribute('data-btfw-overlay', '1');
        const boostIcon = document.createElement('i');
        boostIcon.className = 'fa fa-bullhorn';
        btn.appendChild(boostIcon);

        btn.addEventListener('click', () => {
          if (sharedAudio.boostEnabled) {
            deactivateAudioBoost();
          } else {
            activateAudioBoost();
          }
        });

        btn.addEventListener('mouseenter', () => {
          if (boostMenuHideTimer) { clearTimeout(boostMenuHideTimer); boostMenuHideTimer = null; }
          showBoostContextMenu();
        });
        btn.addEventListener('mouseleave', () => {
          boostMenuHideTimer = setTimeout(() => hideBoostContextMenu(), 150);
        });

        return btn;
      }

      function createNormButton() {
        const btn = document.createElement('button');
        btn.id = 'btfw-vo-audionorm';
        btn.className = 'btn btn-sm btn-default btfw-vo-adopted';
        const presetLabel = sharedAudio.NORM_PRESETS[sharedAudio.currentNormPreset].label;
        btn.title = `Toggle Audio Normalization (${presetLabel})`;
        btn.setAttribute('data-btfw-overlay', '1');
        const normIcon = document.createElement('i');
        normIcon.className = 'fa fa-sliders';
        btn.appendChild(normIcon);

        btn.addEventListener('click', () => {
          if (sharedAudio.normalizationEnabled) {
            deactivateNormalization();
          } else {
            activateNormalization();
          }
        });

        btn.addEventListener('mouseenter', () => {
          if (normMenuHideTimer) { clearTimeout(normMenuHideTimer); normMenuHideTimer = null; }
          showNormContextMenu();
        });
        btn.addEventListener('mouseleave', () => {
          normMenuHideTimer = setTimeout(() => hideNormContextMenu(), 150);
        });

        return btn;
      }

      function createMonoButton() {
        const btn = document.createElement('button');
        btn.id = 'btfw-vo-mono';
        btn.className = 'btn btn-sm btn-default btfw-vo-adopted';
        btn.title = 'Toggle Mono Audio (mix both channels to stereo)';
        btn.setAttribute('data-btfw-overlay', '1');
        const monoIcon = document.createElement('i');
        monoIcon.className = 'fa fa-headphones';
        btn.appendChild(monoIcon);

        btn.addEventListener('click', () => {
          if (sharedAudio.monoEnabled) {
            deactivateMonoAudio();
          } else {
            activateMonoAudio();
          }
        });

        return btn;
      }

      function createBoostContextMenu() {
        if (boostContextMenu) return boostContextMenu;

        const menu = document.createElement('div');
        menu.id = 'btfw-boost-context-menu';
        if (POPOVER_SUPPORTED) menu.popover = 'auto';
        menu.style.cssText = `
          position: fixed;
          background: rgba(20, 31, 54, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(109, 77, 246, 0.3);
          border-radius: 8px;
          padding: 6px;
          margin: 0;
          z-index: 10000;
          min-width: 100px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          ${POPOVER_SUPPORTED ? '' : 'display: none;'}
        `;

        BOOST_PRESETS.forEach(preset => {
          const item = document.createElement('button');
          item.className = 'btfw-context-item';
          item.textContent = preset.label;
          item.style.cssText = `
            display: block;
            width: 100%;
            padding: 6px 12px;
            background: transparent;
            border: none;
            color: #e0e0e0;
            text-align: left;
            cursor: pointer;
            border-radius: 4px;
            font-size: 13px;
            transition: all 0.2s ease;
          `;

          if (sharedAudio.BOOST_MULTIPLIER === preset.multiplier) {
            item.style.background = 'rgba(46, 213, 115, 0.2)';
            item.style.color = '#2ed573';
          }

          item.addEventListener('mouseenter', () => {
            if (sharedAudio.BOOST_MULTIPLIER !== preset.multiplier) {
              item.style.background = 'rgba(109, 77, 246, 0.2)';
            }
          });

          item.addEventListener('mouseleave', () => {
            if (sharedAudio.BOOST_MULTIPLIER !== preset.multiplier) {
              item.style.background = 'transparent';
            }
          });

          item.addEventListener('click', async () => {
            await sharedAudio.setBoostMultiplier(preset.multiplier);
            updateBoostContextMenuSelection();
            if (boostButton) {
              const percentage = Math.round(preset.multiplier * 100);
              boostButton.title = `Toggle Audio Boost (${percentage}%)`;
            }
            if (sharedAudio.boostEnabled) {
              showToast(`Boost set to ${preset.label}`, 'success');
            }
          });

          menu.appendChild(item);
        });

        menu.addEventListener('mouseenter', () => {
          if (boostMenuHideTimer) { clearTimeout(boostMenuHideTimer); boostMenuHideTimer = null; }
        });
        menu.addEventListener('mouseleave', () => {
          boostMenuHideTimer = setTimeout(() => hideBoostContextMenu(), 100);
        });

        document.body.appendChild(menu);
        boostContextMenu = menu;
        return menu;
      }

      function showBoostContextMenu() {
        if (!boostButton) return;
        const menu = createBoostContextMenu();
        positionContextMenu(menu, boostButton, BOOST_ANCHOR_NAME);
        if (POPOVER_SUPPORTED) {
          if (!menu.matches(':popover-open')) menu.showPopover();
        } else {
          menu.style.display = 'block';
        }
      }

      function hideBoostContextMenu() {
        if (!boostContextMenu) return;
        if (POPOVER_SUPPORTED) {
          if (boostContextMenu.matches(':popover-open')) boostContextMenu.hidePopover();
        } else {
          boostContextMenu.style.display = 'none';
        }
      }

      function updateBoostContextMenuSelection() {
        if (!boostContextMenu) return;
        const items = boostContextMenu.querySelectorAll('.btfw-context-item');
        items.forEach((item, idx) => {
          const preset = BOOST_PRESETS[idx];
          if (sharedAudio.BOOST_MULTIPLIER === preset.multiplier) {
            item.style.background = 'rgba(46, 213, 115, 0.2)';
            item.style.color = '#2ed573';
          } else {
            item.style.background = 'transparent';
            item.style.color = '#e0e0e0';
          }
        });
      }

      function createNormContextMenu() {
        if (normContextMenu) return normContextMenu;

        const menu = document.createElement('div');
        menu.id = 'btfw-norm-context-menu';
        if (POPOVER_SUPPORTED) menu.popover = 'auto';
        menu.style.cssText = `
          position: fixed;
          background: rgba(20, 31, 54, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(52, 152, 219, 0.3);
          border-radius: 8px;
          padding: 6px;
          margin: 0;
          z-index: 10000;
          min-width: 110px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          ${POPOVER_SUPPORTED ? '' : 'display: none;'}
        `;

        Object.keys(sharedAudio.NORM_PRESETS).forEach(key => {
          const preset = sharedAudio.NORM_PRESETS[key];
          const item = document.createElement('button');
          item.className = 'btfw-context-item';
          item.textContent = preset.label;
          item.style.cssText = `
            display: block;
            width: 100%;
            padding: 6px 12px;
            background: transparent;
            border: none;
            color: #e0e0e0;
            text-align: left;
            cursor: pointer;
            border-radius: 4px;
            font-size: 13px;
            transition: all 0.2s ease;
          `;

          if (sharedAudio.currentNormPreset === key) {
            item.style.background = 'rgba(52, 152, 219, 0.2)';
            item.style.color = '#3498db';
          }

          item.addEventListener('mouseenter', () => {
            if (sharedAudio.currentNormPreset !== key) {
              item.style.background = 'rgba(109, 77, 246, 0.2)';
            }
          });

          item.addEventListener('mouseleave', () => {
            if (sharedAudio.currentNormPreset !== key) {
              item.style.background = 'transparent';
            }
          });

          item.addEventListener('click', async () => {
            await sharedAudio.setNormPreset(key);
            updateNormContextMenuSelection();
            if (normButton) {
              normButton.title = `Toggle Audio Normalization (${preset.label})`;
            }
            if (sharedAudio.normalizationEnabled) {
              showNormToast(`Preset: ${preset.label}`, 'success');
            }
          });

          menu.appendChild(item);
        });

        menu.addEventListener('mouseenter', () => {
          if (normMenuHideTimer) { clearTimeout(normMenuHideTimer); normMenuHideTimer = null; }
        });
        menu.addEventListener('mouseleave', () => {
          normMenuHideTimer = setTimeout(() => hideNormContextMenu(), 100);
        });

        document.body.appendChild(menu);
        normContextMenu = menu;
        return menu;
      }

      function showNormContextMenu() {
        if (!normButton) return;
        const menu = createNormContextMenu();
        positionContextMenu(menu, normButton, NORM_ANCHOR_NAME);
        if (POPOVER_SUPPORTED) {
          if (!menu.matches(':popover-open')) menu.showPopover();
        } else {
          menu.style.display = 'block';
        }
      }

      function hideNormContextMenu() {
        if (!normContextMenu) return;
        if (POPOVER_SUPPORTED) {
          if (normContextMenu.matches(':popover-open')) normContextMenu.hidePopover();
        } else {
          normContextMenu.style.display = 'none';
        }
      }

      function updateNormContextMenuSelection() {
        if (!normContextMenu) return;
        const items = normContextMenu.querySelectorAll('.btfw-context-item');
        Object.keys(sharedAudio.NORM_PRESETS).forEach((key, idx) => {
          const item = items[idx];
          if (sharedAudio.currentNormPreset === key) {
            item.style.background = 'rgba(52, 152, 219, 0.2)';
            item.style.color = '#3498db';
          } else {
            item.style.background = 'transparent';
            item.style.color = '#e0e0e0';
          }
        });
      }

      function addButtonsToOverlay() {
        const voLeft = $('#btfw-vo-left');
        if (!voLeft) return false;

        const existingBoost = $('#btfw-vo-audioboost');
        if (existingBoost) existingBoost.remove();
        const existingNorm = $('#btfw-vo-audionorm');
        if (existingNorm) existingNorm.remove();
        const existingMono = $('#btfw-vo-mono');
        if (existingMono) existingMono.remove();

        boostButton = createBoostButton();
        normButton = createNormButton();
        monoButton = createMonoButton();
        voLeft.appendChild(boostButton);
        voLeft.appendChild(normButton);
        voLeft.appendChild(monoButton);
        return true;
      }

      function waitForOverlayBar(callback, maxAttempts = 20) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (addButtonsToOverlay()) {
            clearInterval(interval);
            callback();
          } else if (attempts >= maxAttempts) {
            clearInterval(interval);
          }
        }, 500);
      }

      function initializePlayer() {
        if (typeof videojs === 'undefined') { setTimeout(initializePlayer, 500); return; }

        const playerElement = $('#ytapiplayer');
        if (!playerElement) { setTimeout(initializePlayer, 500); return; }

        sharedAudio.player = videojs('ytapiplayer');
        sharedAudio.originalSrc = sharedAudio._readCurrentSrc();
        sharedAudio.startWatchdog();
        // console.log('[audioboost] Player initialized');
      }

      function handleMediaChange() {
        setTimeout(() => {
          sharedAudio.resetMediaBinding();
          sharedAudio.boostEnabled = false;
          sharedAudio.normalizationEnabled = false;
          sharedAudio.monoEnabled = false;
          sharedAudio.isProxied = false;
          updateBoostButtonState(false);
          updateNormButtonState(false);
          updateMonoButtonState(false);
          initializePlayer();

          if (shouldBoostAfterMediaChange) {
            setTimeout(() => { activateAudioBoost(); }, 1200);
          }
          if (shouldNormalizeAfterMediaChange) {
            setTimeout(() => { activateNormalization(); }, 1200);
          }
          if (shouldMonoAfterMediaChange) {
            setTimeout(() => { activateMonoAudio(); }, 1200);
          }
        }, 600);
      }

      function hookSocketReconnects() {
        if (typeof socket === 'undefined' || !socket.on) return;
        socket.on('disconnect', () => {
          // keep time; watchdog will handle reapply after reconnect
        });
        socket.on('connect', () => {
          // After reconnect, enforce proxy if needed
          setTimeout(() => sharedAudio._checkAndReapply('socket-connect'), 500);
        });
        socket.on('reconnect', () => {
          setTimeout(() => sharedAudio._checkAndReapply('socket-reconnect'), 500);
        });
        socket.on('changeMedia', handleMediaChange);
      }

      function boot() {
        waitForOverlayBar(() => { initializePlayer(); });
        hookSocketReconnects();
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
      } else {
        boot();
      }

      return {
        name: "feature:audio",
        activate: activateAudioBoost,
        deactivate: deactivateAudioBoost,
        isActive: () => sharedAudio.boostEnabled,
        activateNormalization,
        deactivateNormalization,
        isNormalizationActive: () => sharedAudio.normalizationEnabled,
        activateMono: activateMonoAudio,
        deactivateMono: deactivateMonoAudio,
        isMonoActive: () => sharedAudio.monoEnabled
      };
    });

    BTFW.define("feature:audioboost", ["feature:audio"], async (ctx) => ctx.init("feature:audio"));
    BTFW.define("feature:audio-boost", ["feature:audio"], async (ctx) => ctx.init("feature:audio"));
    BTFW.define("feature:audionorm", ["feature:audio"], async (ctx) => ctx.init("feature:audio"));
    BTFW.define("feature:monoaudio", ["feature:audio"], async (ctx) => ctx.init("feature:audio"));
  });
})();
