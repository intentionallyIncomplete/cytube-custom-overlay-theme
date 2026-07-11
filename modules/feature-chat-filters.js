/* BillTube Framework — feature:chat-filters (imports required CyTube chat filters) */
BTFW.define("feature:chat-filters", ["util:letterboxd", "util:tenor", "util:tmdb-card"], async ({ init: btfwInit }) => {
  const letterboxd = await btfwInit("util:letterboxd");
  const tenor = await btfwInit("util:tenor");
  const tmdbCard = await btfwInit("util:tmdb-card");

const customFilters = [
  { name: "monospace", source: "`(.+?)`", flags: "g", replace: "<code>\\1</code>", active: true, filterlinks: false },
  { name: "bold", source: "\\*(.+?)\\*", flags: "g", replace: "<strong>\\1</strong>", active: true, filterlinks: false },
  { name: "italic", source: "_(.+?)_", flags: "g", replace: "<em>\\1</em>", active: true, filterlinks: false },
  { name: "strike", source: "~~(.+?)~~", flags: "g", replace: "<s>\\1</s>", active: true, filterlinks: false },
  { name: "inline spoiler", source: "\\[sp\\](.*?)\\[\\/sp\\]", flags: "gi", replace: "<span class=\"spoiler\">\\1</span>", active: true, filterlinks: false },
  { name: "partial quote", source: "&gt;(.+?)$", flags: "g", replace: "<span class=\"quote\">&gt;\\1 </span>", active: true, filterlinks: false },
  { name: "italic text", source: "\\[i\\](.+?)\\[\\/i\\]", flags: "g", replace: "<em>\\1</em>", active: true, filterlinks: false },
  { name: "monospace text", source: "\\[code\\](.+?)\\[\\/code\\]", flags: "gi", replace: "<code>\\1</code>", active: true, filterlinks: false },
  { name: "bold text", source: "\\[b\\](.+?)\\[\\/b\\]", flags: "gi", replace: "<strong>\\1</strong>", active: true, filterlinks: false },
  { name: "striked text", source: "\\[s\\](.+?)\\[\\/s\\]", flags: "gi", replace: "<s>\\1</s>", active: true, filterlinks: false },
  { name: "short spoiler", source: "\\[sp\\]", flags: "g", replace: "<span class=\"spoiler\">", active: true, filterlinks: false },
  { name: "closing font style", source: "\\[\\/\\]", flags: "g", replace: "<span>", active: true, filterlinks: false },
  { name: "chat colors (premium)", source: "col:(.*?):", flags: "g", replace: "<span style=\"color:\\1\" class=\"chatcolor\">", active: true, filterlinks: false },
  { name: "giphy v1", source: "https?://media\\d+\\.giphy\\.com/media/v1\\.[^/]+/([^ /\\n]+)/giphy\\.gif", flags: "gi", replace: "<img class=\"giphy chat-picture chat-media\" src=\"https://media.giphy.com/media/\\1/giphy_s.gif\" />", active: true, filterlinks: true },
  { name: "giphy", source: "https?://media\\d+\\.giphy\\.com/media/(?!v1\\.)([^ /\\n]+)/giphy\\.gif", flags: "gi", replace: "<img class=\"giphy chat-picture chat-media\" src=\"https://media.giphy.com/media/\\1/giphy_s.gif\" />", active: true, filterlinks: true },
  { name: "giphy i.giphy", source: "https?://i\\.giphy\\.com/([^ /\\n]+)\\.gif", flags: "gi", replace: "<img class=\"giphy chat-picture chat-media\" src=\"https://media.giphy.com/media/\\1/giphy_s.gif\" />", active: true, filterlinks: true },
  { name: "giphy page", source: "https?://(?:www\\.)?giphy\\.com/gifs/(?:.*-)?([a-zA-Z0-9]+)", flags: "gi", replace: "<img class=\"giphy chat-picture chat-media\" src=\"https://media.giphy.com/media/\\1/giphy_s.gif\" />", active: true, filterlinks: true },
  { name: "klipy cdn", source: "(https?://static\\d*\\.klipy\\.com/[^\\s<]+)", flags: "gi", replace: "<span class=\"btfw-klipy-wrap\"><img class=\"klipy chat-picture chat-media\" src=\"\\1\" /></span>", active: true, filterlinks: true },
  { name: "tenor media m", source: "(https?://media\\d*\\.tenor\\.com/m/[^\\s<]+\\.(?:gif|webp))", flags: "gi", replace: "<img class=\"tenor chat-picture chat-media\" src=\"\\1\" />", active: true, filterlinks: true },
  { name: "tenor", source: "(https?://c\\.tenor\\.com/[\\w-]+/[^\\s<]+\\.(?:gif|webp))", flags: "gi", replace: "<img class=\"tenor chat-picture chat-media\" src=\"\\1\" />", active: true, filterlinks: true },
  { name: "tenor media", source: "(https?://media\\d*\\.tenor\\.com/(?!m/)[\\w-]+/[^\\s<]+\\.(?:gif|webp))", flags: "gi", replace: "<img class=\"tenor chat-picture chat-media\" src=\"\\1\" />", active: true, filterlinks: true },
  { name: "tenor short", source: "(https?://(?:www\\.)?tenor\\.com/[\\w-]+\\.(?:gif|webp))", flags: "gi", replace: "<img class=\"tenor chat-picture chat-media\" src=\"\\1\" />", active: true, filterlinks: true },
  { name: "TMDB", source: "\\[tmdbcard\\]([^|]+)\\|([^|]+)\\|([^|]+)\\|([^|]+)\\|([^|]+)(?:\\|([^\\[]+))?\\[\\/tmdbcard\\]", flags: "g", replace: "<a class=\"tmdb-card chat-media-card\" href=\"https:\\6\" target=\"_blank\" rel=\"noopener noreferrer\"><img class=\"tmdb-card__poster chat-media\" src=\"https://image.tmdb.org/t/p/w342\\5\" alt=\"\\1 poster\" onerror=\"this.style.display='none'\"><div class=\"tmdb-card__content\"><div class=\"tmdb-card__title\">\\1 <span class=\"tmdb-card__year\">(\\2)</span></div><div class=\"tmdb-card__rating\">★ \\3</div><div class=\"tmdb-card__overview\">\\4</div></div></a>", active: true, filterlinks: false },
  { name: "Letterboxd", source: "\\[letterboxdcard\\]([^|]+)\\|([^|]+)\\|([^|]+)\\|([^|]+)\\|([^|]+)(?:\\|([^\\[]+))?\\[\\/letterboxdcard\\]", flags: "g", replace: "<a class=\"letterboxd-card chat-media-card\" href=\"https:\\6\" target=\"_blank\" rel=\"noopener noreferrer\"><img class=\"letterboxd-card__poster chat-media\" src=\"\\5\" alt=\"\\1 poster\" onerror=\"this.style.display='none'\"><div class=\"letterboxd-card__content\"><div class=\"letterboxd-card__title\">\\1 <span class=\"letterboxd-card__year\">(\\2)</span></div><div class=\"letterboxd-card__rating\">★ \\3</div><div class=\"letterboxd-card__overview\">\\4</div></div></a>", active: true, filterlinks: false }
];

  function getjQuery() {
    if (window.jQuery && typeof window.jQuery === "function") {
      return window.jQuery;
    }
    if (window.$ && typeof window.$ === "function") {
      return window.$;
    }
    return null;
  }

  function hasLetterboxdUrl(text) {
    return /https?:\/\/(?:www\.)?letterboxd\.com\/film\/[a-zA-Z0-9-]+\/?/i.test(text);
  }

  function sendChat(msg) {
    try {
      if (window.socket?.emit) {
        window.socket.emit("chatMsg", { msg });
        return true;
      }
    } catch (_) {}
    return false;
  }

  function hasTenorViewUrl(text) {
    return /https?:\/\/(?:www\.)?tenor\.com\/view\/[^\s]+/i.test(text);
  }

  function hasTmdbUrl(text) {
    return /https?:\/\/(?:www\.)?themoviedb\.org\/(?:movie|tv)\/\d+/i.test(text);
  }

  function needsChatUrlExpansion(text) {
    return hasLetterboxdUrl(text) || hasTenorViewUrl(text) || hasTmdbUrl(text);
  }

  async function expandChatUrls(text) {
    let out = text;
    if (hasLetterboxdUrl(out) && letterboxd.isAvailable()) {
      out = await letterboxd.expandUrlsInMessage(out);
    }
    if (hasTmdbUrl(out) && tmdbCard.isAvailable()) {
      out = await tmdbCard.expandUrlsInMessage(out);
    }
    if (hasTenorViewUrl(out) && tenor.isAvailable()) {
      out = await tenor.expandViewUrlsInMessage(out);
    }
    return out;
  }

  function wireChatUrlExpansion() {
    const input = document.getElementById("chatline");
    if (!input || input.dataset.btfwChatUrlExpandWired === "1") return;
    input.dataset.btfwChatUrlExpandWired = "1";

    let expanding = false;

    input.addEventListener("keydown", (event) => {
      if (expanding || event.key !== "Enter" || event.shiftKey) return;
      const text = input.value.trim();
      if (!text || text.startsWith("!") || text.startsWith("/me ")) return;
      if (!needsChatUrlExpansion(text)) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      expanding = true;
      expandChatUrls(text)
        .then((msg) => {
          sendChat(msg || text);
          input.value = "";
        })
        .catch((err) => {
          console.warn("[BTFW chat-filters] URL expand failed:", err);
          sendChat(text);
          input.value = "";
        })
        .finally(() => {
          expanding = false;
        });
    }, true);
  }

  function normalizeProtocolRelativeCardHrefs(html) {
    return String(html || "").replace(
      /(<a class="(?:letterboxd|tmdb)-card[^"]*" href=")\/\/([^"]+)"/g,
      '$1https://$2"'
    );
  }

  function renderMediaCardsInMessage(span) {
    if (!span) return;
    let html = span.innerHTML;
    const hadLetterboxd =
      html.includes("letterboxd-card") ||
      html.includes("[letterboxdcard]") ||
      html.includes("[/letterboxdcard]");
    const hadTmdb =
      html.includes("tmdb-card") ||
      html.includes("[tmdbcard]") ||
      html.includes("[/tmdbcard]");
    if (!hadLetterboxd && !hadTmdb) return;
    if (hadLetterboxd) html = letterboxd.renderCardsInHtml(html);
    if (hadTmdb) html = tmdbCard.renderCardsInHtml(html);
    html = normalizeProtocolRelativeCardHrefs(html);
    if (html !== span.innerHTML) span.innerHTML = html;
  }

  function processChatMessageDiv(div) {
    if (!div || div.nodeType !== 1) return;
    div.querySelectorAll("span").forEach((span) => {
      if (span.classList.contains("timestamp")) return;
      if (span.classList.contains("username") || span.querySelector(".username")) return;
      renderMediaCardsInMessage(span);
    });
  }

  function wireMediaCardRendering() {
    const buf = document.getElementById("messagebuffer");
    if (!buf || buf.dataset.btfwMediaCardRenderWired === "1") return;
    buf.dataset.btfwMediaCardRenderWired = "1";

    const processNode = (node) => {
      if (!node || node.nodeType !== 1) return;
      if (node.id === "messagebuffer") {
        node.querySelectorAll("div").forEach(processChatMessageDiv);
        return;
      }
      if (node.matches("div")) {
        processChatMessageDiv(node);
        return;
      }
      node.querySelectorAll("div").forEach(processChatMessageDiv);
    };

    processNode(buf);

    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((n) => processNode(n));
      }
    });
    mo.observe(buf, { childList: true, subtree: true });
  }

  function importCustomChatFiltersToTextarea($) {
    const exportTextField = $("#cs-chatfilters-exporttext");
    if (!exportTextField || !exportTextField.length) {
      console.error("[BTFW chat-filters] Unable to find export text field.");
      return;
    }
    try {
      exportTextField.val(JSON.stringify(customFilters, null, 2));
      console.info("[BTFW chat-filters] Imported custom chat filters into text field.", customFilters);
    } catch (error) {
      console.error("[BTFW chat-filters] Error serializing custom filters:", error);
    }
  }

  function addChatFilterButton($) {
    const chatFilterMenu = $("#cs-chatfilters");
    if (!chatFilterMenu || !chatFilterMenu.length) {
      console.error("[BTFW chat-filters] Chat filter menu not found.");
      return;
    }
    if (chatFilterMenu.find("#btfw-add-custom-filter-button").length) {
      return;
    }

    const newFilterButton = $(
      '<button id="btfw-add-custom-filter-button" class="btn btn-sm btn-primary" style="margin-top: 10px;">Import Required BillTube Chat Filters</button>'
    );
    newFilterButton.on("click", function (event) {
      event.preventDefault();
      importCustomChatFiltersToTextarea($);
    });

    chatFilterMenu.append(newFilterButton);
  }

  function bootChatFilters() {
    const $ = getjQuery();
    if (!$) {
      console.warn("[BTFW chat-filters] jQuery not available; cannot attach import button.");
      wireMediaCardRendering();
      return;
    }

    const run = () => {
      addChatFilterButton($);
      wireChatUrlExpansion();
      wireMediaCardRendering();
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run, { once: true });
    } else {
      run();
    }
  }

  bootChatFilters();

  return {
    importCustomChatFiltersToTextarea: ($) => importCustomChatFiltersToTextarea($ || getjQuery()),
    customFilters,
  };
});
