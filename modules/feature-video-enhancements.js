/* BTFW — feature:videoEnhancements (title extraction, changeMedia handling) */
BTFW.define("feature:videoEnhancements", [], async () => {
  
  // Title length CSS variable handling
  function updateTitleLength(){
    const titleElements = document.querySelectorAll("#currenttitle, .current-title");
    titleElements.forEach(el => {
      const text = (el.textContent || el.innerText || "").trim();
      el.style.setProperty("--length", text.length);
    });
  }

  // Remove the fullscreen button if present
  function removeVjsFullscreenButton(){
    const fullscreenBtn = document.querySelector(".vjs-fullscreen-control");
    if (fullscreenBtn) {
      fullscreenBtn.remove();
    }
  }

  // Hide the quality button when there are no real options
  function handleQualityButton(){
    const qualityBtn = document.querySelector(".vjs-resolution-button");
    if (!qualityBtn) return;

    const qualityMenu = qualityBtn.querySelector(".vjs-menu");
    if (!qualityMenu) {
      qualityBtn.style.display = "none";
      return;
    }

    const menuItems = qualityMenu.querySelectorAll(".vjs-menu-item");
    if (menuItems.length <= 1) {
      qualityBtn.style.display = "none";
    }
  }

  // Ensure the fullscreen button is hidden via CSS as a fallback
  function ensureFullscreenCss(){
    if (document.getElementById("btfw-video-enhancements-style")) return;

    const style = document.createElement("style");
    style.id = "btfw-video-enhancements-style";
    style.textContent = `
      .vjs-fullscreen-control {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Try to remove fullscreen controls and hide unused quality options
  function tryHideQuality(){
    removeVjsFullscreenButton();
    handleQualityButton();
  }

  // Media URL processing and title extraction
  function encodeMediaUrlForQueue(raw) {
    const url = String(raw || "").trim();
    if (!url || !/\s/.test(url)) return url;

    const match = url.match(/^([a-zA-Z][a-zA-Z0-9+.-]*:)(\/\/)?(.*)$/s);
    if (!match) {
      return url.replace(/ /g, "%20");
    }

    const candidate = `${match[1]}${match[2] || ""}${match[3].replace(/ /g, "%20")}`;

    try {
      return new URL(candidate).href;
    } catch (_) {
      return candidate;
    }
  }

  function encodeMediaUrlsInField(linkList) {
    const raw = String(linkList || "");
    if (!raw || !/\s/.test(raw)) return raw;

    const parts = raw.split(",http");
    const links = parts.map((link, i) => encodeMediaUrlForQueue(i > 0 ? `http${link}` : link));

    let out = links[0];
    for (let i = 1; i < links.length; i++) {
      out += `,http${links[i].replace(/^https?:/i, "")}`;
    }
    return out;
  }

  function normalizeMediaUrlField(input) {
    if (!input || !input.value) return;
    const encoded = encodeMediaUrlsInField(input.value);
    if (encoded !== input.value) {
      input.value = encoded;
    }
  }

  function wrapQueueUrlEncoding() {
    if (window._btfwQueueUrlWrapped || typeof window.queue !== "function") return;
    const original = window.queue;
    window.queue = function queueWithEncodedUrls(pos, src) {
      const mediaInput = document.getElementById("mediaurl");
      if (mediaInput && (!src || src === "url")) {
        normalizeMediaUrlField(mediaInput);
      }
      return original.apply(this, arguments);
    };
    window._btfwQueueUrlWrapped = true;
  }

  function processMediaUrl(urlInput){
    if (!urlInput || !urlInput.value) return;

    let url = urlInput.value;
    if (!url.trim()) return;

    // Dropbox URL transformation only while typing; encode spaces on queue submit
    url = url.replace("//www.dropbox.com/s/", "//dl.dropbox.com/s/")
             .replace("?dl=0", "")
             .replace("?a=view", "");

    if (url !== urlInput.value) {
      urlInput.value = url;
    }

    // Auto-title extraction
    setTimeout(() => {
      const titleInput = document.querySelector("#addfromurl-title-val, #mediaurl-title, .media-title-input");
      if (titleInput && !titleInput.value.trim()) {
        try {
          const decodedUrl = decodeURI(url.trim());
          const pathParts = decodedUrl.split("/");
          const filename = pathParts[pathParts.length - 1];
          const nameParts = filename.split("?")[0].split(".");
          
          // Build title from filename parts (exclude extension)
          let title = "";
          for (let i = 0; i < nameParts.length - 1; i++) {
            title += nameParts[i] + (i < nameParts.length - 2 ? "." : "");
          }
          
          // Clean up title
          title = title.replace(/[._-]/g, " ")
                      .replace(/\s+/g, " ")
                      .trim();

          if (title) {
            titleInput.value = title;
          }
        } catch (err) {
          console.warn("[video-enhancements] Title extraction failed:", err);
        }
      }
    }, 100);
  }

  function bindMediaUrlSubmitEncoding() {
    const encodeField = () => {
      const input = document.getElementById("mediaurl");
      if (input) normalizeMediaUrlField(input);
    };

    ["#queue_end", "#queue_next"].forEach((selector) => {
      const btn = document.querySelector(selector);
      if (!btn || btn._btfwUrlEncodeBound) return;
      btn._btfwUrlEncodeBound = true;
      btn.addEventListener("click", encodeField, true);
    });

    const input = document.getElementById("mediaurl");
    if (input && !input._btfwSubmitEncodeBound) {
      input._btfwSubmitEncodeBound = true;
      input.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") encodeField();
      }, true);
    }
  }

  // Setup media URL processing
  function bindMediaUrlProcessing(){
    const urlInputs = document.querySelectorAll("#mediaurl, .media-url-input");
    urlInputs.forEach(input => {
      if (input._btfwUrlBound) return;
      input._btfwUrlBound = true;

      input.addEventListener("paste", () => {
        setTimeout(() => processMediaUrl(input), 50);
      });

      input.addEventListener("input", () => {
        setTimeout(() => processMediaUrl(input), 50);
      });
    });
  }

  // changeMedia event handler
  function handleChangeMedia(){
    setTimeout(() => {
      updateTitleLength();
    }, 100);

    setTimeout(tryHideQuality, 500);
    setTimeout(tryHideQuality, 1000);
    setTimeout(tryHideQuality, 2000);
  }

  // Initialize
  function boot(){
    // Initial setup
    updateTitleLength();
    wrapQueueUrlEncoding();
    bindMediaUrlProcessing();
    bindMediaUrlSubmitEncoding();
    ensureFullscreenCss();
    tryHideQuality();
    setTimeout(tryHideQuality, 500);
    setTimeout(tryHideQuality, 1000);
    setTimeout(tryHideQuality, 2000);

    // Bind to changeMedia event
    if (window.socket) {
      try {
        socket.on("changeMedia", handleChangeMedia);
      } catch (err) {
        console.warn("[video-enhancements] Failed to bind changeMedia:", err);
      }
    }

    // Watch for DOM changes to rebind URL processing
    const observer = new MutationObserver(() => {
      bindMediaUrlProcessing();
      bindMediaUrlSubmitEncoding();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(wrapQueueUrlEncoding, 0);
    setTimeout(wrapQueueUrlEncoding, 1000);
    setTimeout(bindMediaUrlSubmitEncoding, 0);
    setTimeout(bindMediaUrlSubmitEncoding, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  return { 
    name: "feature:videoEnhancements",
    updateTitleLength: updateTitleLength
  };
});
