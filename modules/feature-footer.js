/* BTFW — feature:footer (legacy CyTube footer removal; stack footer hidden) */
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
      const observer = new MutationObserver(() => maintainFooter());
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
