/* BTFW — feature:footer (legacy CyTube footer removal; stack footer hidden) */
import { debounce } from "../lib/dom-wait.js";

BTFW.define("feature:footer", [], async () => {
  function removeLegacyFooter() {
    document.querySelectorAll("footer#footer").forEach((legacy) => {
      if (legacy?.isConnected) legacy.remove();
    });
  }

  function hideStackFooter() {
    const stackFooter = document.getElementById("btfw-stack-footer");
    if (stackFooter) {
      stackFooter.hidden = true;
      stackFooter.style.display = "none";
    }
    document.querySelectorAll(".btfw-footer-branding").forEach((el) => el.remove());
  }

  function maintainFooter() {
    removeLegacyFooter();
    hideStackFooter();
  }

  function boot() {
    maintainFooter();

    if (!document._btfwFooterObserver) {
      // #203: body-wide observer callbacks are debounced so a busy DOM
      // (chat scrollback, playlist churn) triggers one sweep per burst.
      const debouncedMaintainFooter = debounce(maintainFooter, 150);
      const observer = new MutationObserver(() => debouncedMaintainFooter());
      observer.observe(document.body, { childList: true, subtree: true });
      document._btfwFooterObserver = observer;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  document.addEventListener("btfw:ready", () => removeLegacyFooter(), { once: true });

  return {
    name: "feature:footer",
    removeLegacyFooter,
    hideStackFooter,
  };
});
