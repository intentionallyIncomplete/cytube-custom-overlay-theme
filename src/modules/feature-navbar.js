BTFW.define("feature:navbar", ["util:dom", "util:state"], async ({ init }) => {
  const dom = await init("util:dom");
  const { state } = await init("util:state");
  const $  = (s,r=document)=>r.querySelector(s);

  const MOBILE_BREAKPOINT = 768;
  const AUTOHIDE_REVEAL_MS = 3200;
  let mobileNavActive = false;
  let mobileNavHandlersBound = false;
  let autohideActive = false;
  let autohideHidden = true;
  let autohideRevealTimer = null;
  let autohideScrollLastY = 0;
  let autohideHandlersBound = false;
  let lastMobileDispatch = { open: null, mobile: null };
  let lastNavMenuSignature = "";
  let navMenuDismissWired = false;

  function escapeHtml(value){
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getUserName(){
    try { return (window.CLIENT && CLIENT.name) ? CLIENT.name : ""; }
    catch(_) { return ""; }
  }

  function getProfileImgFromUserlist(name){
    try {
      const li = dom.findUserlistItem(name);
      if (!li || !window.jQuery) return "";
      const $li = window.jQuery(li);
      const prof = $li.data && $li.data("profile");
      const img = prof && prof.image;
      return img || "";
    } catch(_) { return ""; }
  }

  function getCyTubeAvatar(){
    try {
      return (window.USEROPTS && USEROPTS.avatar) ? USEROPTS.avatar : "";
    } catch(_) { return ""; }
  }

  function initialsDataURL(name, sizePx){
    const colors = ["#1abc9c","#16a085","#f1c40f","#f39c12","#2ecc71","#27ae60","#e67e22",
                    "#d35400","#3498db","#2980b9","#e74c3c","#c0392b","#9b59b6","#8e44ad",
                    "#0080a5","#34495e","#2c3e50"];
    const seed = (name||"?").codePointAt(0) || 63;
    const bg = colors[seed % colors.length];
    const letters = (name||"?").trim().slice(0,2).toUpperCase() || "?";
    const sz = sizePx || 28;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}">
      <rect width="100%" height="100%" rx="${Math.round(sz*0.2)}" fill="${bg}"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            fill="#fff" font-family="Inter,Arial,sans-serif" font-weight="600"
            font-size="${Math.round(sz*0.5)}">${letters}</text>
    </svg>`;
    return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
  }

  function findNavList(){
    const themeBtn = document.getElementById("btfw-theme-btn-nav");
    if (themeBtn) {
      const ul = themeBtn.closest("ul");
      if (ul) return ul;
    }
    return document.querySelector(".navbar .nav.navbar-nav")
        || document.querySelector(".navbar-nav")
        || document.querySelector(".navbar .navbar-end ul")
        || document.querySelector(".btfw-navbar ul")
        || document.querySelector(".navbar ul");
  }

  function styleThemeButton(btn){
    if (!btn) return;
    btn.id = "btfw-theme-btn-nav";
    btn.classList.add("btfw-nav-pill");
    btn.classList.remove("button","is-dark","is-small","btn","btn-default","is-primary");
    if (btn.tagName === "BUTTON" && !btn.hasAttribute("type")) {
      btn.type = "button";
    }
    if (!btn.getAttribute("aria-label")) {
      btn.setAttribute("aria-label", "Theme settings");
    }
  }

  function ensureThemeButtonHook(){
    const existing = document.getElementById("btfw-theme-btn-nav");
    if (existing) { styleThemeButton(existing); return; }

    const navUL = findNavList();
    if (!navUL) return;

    let btn = navUL.querySelector(".fa-sliders, .fa-sliders-h, .fa-sliders-simple, .fa-sliders-h::before");
    if (btn) {
      const a = btn.closest("a,button");
      if (a) {
        styleThemeButton(a);
        return;
      }
    }

    const li = document.createElement("li");
    const a  = document.createElement("a");
    a.innerHTML = `
      <span class="btfw-nav-pill__icon" data-btfw-icon-slot="nav-theme" aria-hidden="true"><i class="fa fa-sliders"></i></span>
      <span class="btfw-nav-pill__label">Theme</span>
    `;
    a.href = "javascript:void(0)";
    styleThemeButton(a);
    li.appendChild(a);
    navUL.appendChild(li);
  }

  function findAccountDropdownItem() {
    const root = document.getElementById("btfw-navhost") || document;
    const items = root.querySelectorAll("li.dropdown");
    for (const li of items) {
      if (li.id === "btfw-nav-avatar-item") continue;
      const toggle = li.querySelector(":scope > a.dropdown-toggle, :scope > .dropdown-toggle");
      if (!toggle) continue;
      const label = (toggle.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      if (label.startsWith("account")) return li;
    }
    return null;
  }

  function hideLogoutForm() {
    const form = document.getElementById("logoutform");
    if (!form || form.dataset.btfwHidden === "1") return;
    form.dataset.btfwHidden = "1";
    form.classList.add("btfw-logoutform--hidden");
    form.setAttribute("aria-hidden", "true");
    if (form.parentElement !== document.body) {
      document.body.appendChild(form);
    }
  }

  function setupAvatarAccountDropdown() {
    const avatarLi = document.getElementById("btfw-nav-avatar-item");
    if (!avatarLi) return;

    let menu = avatarLi.querySelector(":scope > .dropdown-menu");
    if (!menu) {
      const accountLi = findAccountDropdownItem();
      if (accountLi) {
        menu = accountLi.querySelector(":scope > .dropdown-menu");
        if (menu) {
          avatarLi.classList.add("dropdown");
          menu.classList.add("dropdown-menu-right");
          avatarLi.appendChild(menu);
        }
        accountLi.remove();
      }
    }

    const toggle = avatarLi.querySelector(".btfw-nav-avatar-link");
    if (!toggle) return;

    const name = getUserName();
    if (menu && name) {
      toggle.href = "#";
      toggle.removeAttribute("target");
      toggle.classList.add("dropdown-toggle");
      toggle.setAttribute("data-toggle", "dropdown");
      toggle.setAttribute("role", "button");
      toggle.setAttribute("aria-haspopup", "true");
      toggle.setAttribute("aria-expanded", "false");
      toggle.title = name;

      if (!toggle.dataset.btfwAvatarDropdown) {
        toggle.dataset.btfwAvatarDropdown = "1";
        toggle.addEventListener("click", (ev) => {
          ev.preventDefault();
        });
      }
      return;
    }

    toggle.classList.remove("dropdown-toggle");
    toggle.removeAttribute("data-toggle");
    toggle.removeAttribute("aria-haspopup");
    toggle.removeAttribute("aria-expanded");
    toggle.removeAttribute("role");
    delete toggle.dataset.btfwAvatarDropdown;
    toggle.href = name ? "/account/profile" : "/login";
    if (name) toggle.target = "_blank";
    else toggle.removeAttribute("target");
    toggle.title = name ? name : "Sign in";
  }

  function buildAvatarElement(name){
    const size = 28;
    let src = name ? (getProfileImgFromUserlist(name) || getCyTubeAvatar() || "") : "";
    if (!src) src = initialsDataURL(name || "Guest", size);

    const a = document.createElement("a");
    a.href   = name ? "/account/profile" : "/login";
    a.target = "_blank";
    a.className = "btfw-nav-avatar-link";
    a.title = name ? name : "Sign in";

    const img = document.createElement("img");
    img.id = "btfw-useravatar";
    img.className = "btfw-nav-avatar";
    img.src = src;
    img.alt = name || "guest";
    img.width = size; img.height = size;

    a.appendChild(img);
    return a;
  }

  function renderAvatar(){
    const navUL = findNavList();
    if (!navUL) return;

    let li = document.getElementById("btfw-nav-avatar-item");
    const existingMenu = li?.querySelector(":scope > .dropdown-menu");

    if (!li) {
      li = document.createElement("li");
      li.id = "btfw-nav-avatar-item";
      li.className = "btfw-nav-avatar-item";
      navUL.appendChild(li);
    } else {
      li.innerHTML = "";
      li.classList.remove("dropdown");
    }

    li.appendChild(buildAvatarElement(getUserName()));

    if (existingMenu) {
      li.classList.add("dropdown");
      li.appendChild(existingMenu);
    }
  }

  function pruneNavLinks(){
    const navUL = findNavList();
    if (!navUL) return;
    Array.from(navUL.querySelectorAll("li")).forEach(li => {
      const link = li.querySelector("a");
      if (!link) return;
      const label = (link.textContent || "").trim().toLowerCase();
      const href = (link.getAttribute("href") || "").trim();
      const isHome = label === "home" || href === "/";
      const isLayout = label === "layout" || /layout/i.test(link.dataset?.target || "");
      if (isHome || isLayout) {
        li.remove();
      }
    });
  }

  function refresh(){
    hideLogoutForm();
    pruneNavLinks();
    renderAvatar();
    setupAvatarAccountDropdown();
    setupMobileNav();
    lastNavMenuSignature = "";
    syncNavMenuBar();
  }

  function isVerticalStacked(){
    const grid = document.getElementById("btfw-grid");
    return Boolean(grid && grid.classList.contains("btfw-grid--vertical"));
  }

  function isNavMenuOpen(){
    return document.documentElement.classList.contains("btfw-nav-menu-open");
  }

  async function openThemeSettingsFromNav(){
    try {
      const themeSettings = await BTFW.init("feature:themeSettings");
      if (themeSettings?.open) {
        themeSettings.open();
        return;
      }
    } catch (err) {
      console.warn("[navbar] Theme Settings open failed:", err);
    }

    if (typeof document._btfw_openThemeSettings === "function") {
      void document._btfw_openThemeSettings();
      return;
    }

    document.dispatchEvent(new CustomEvent("btfw:openThemeSettings"));
  }

  function getNavLinkLabel(link){
    const labelEl = link.querySelector(".btfw-nav-pill__label");
    return (labelEl?.textContent || link.textContent || "").replace(/\s+/g, " ").trim();
  }

  function collectNavMenuItems(){
    const items = [];
    const navUL = findNavList();
    if (!navUL) return items;

    Array.from(navUL.querySelectorAll(":scope > li")).forEach((li) => {
      if (li.id === "btfw-nav-avatar-item") return;

      const link = li.querySelector(":scope > a, :scope > button");
      if (!link) return;
      const label = getNavLinkLabel(link);
      if (!label) return;
      items.push({
        key: link.id || label,
        label,
        source: link,
        action: link.id === "btfw-theme-btn-nav" || label === "Theme" ? "theme" : null,
      });
    });

    return items;
  }

  function getNavMenuSignature(items){
    return items.map((item) => `${item.key}:${item.label}`).join("|");
  }

  function activateNavSource(source){
    if (!source) return;

    if (source.id === "btfw-theme-btn-nav") {
      openThemeSettingsFromNav();
      return;
    }

    const onclick = source.getAttribute("onclick") || "";
    if (/showUserOptions/i.test(onclick) && typeof window.showUserOptions === "function") {
      window.showUserOptions();
      return;
    }
    if ((/showChannelSettings/i.test(onclick) || source.id === "showchansettings")
        && typeof window.showChannelSettings === "function") {
      window.showChannelSettings();
      return;
    }

    const href = source.getAttribute("href") || "";
    if (href && href !== "#" && !href.startsWith("javascript:")) {
      if (source.target === "_blank") {
        window.open(href, "_blank", "noopener");
      } else {
        window.location.href = href;
      }
      return;
    }

    source.click();
  }

  function rebuildNavMenuBar(items){
    const bar = document.getElementById("btfw-nav-menu-bar");
    if (!bar) return;

    bar.innerHTML = "";
    bar.style.setProperty("--btfw-nav-menu-count", String(items.length));

    items.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btfw-nav-menu-item";
      btn.setAttribute("role", "menuitem");
      btn.innerHTML = `<span class="btfw-nav-menu-item__label">${escapeHtml(item.label)}</span>`;

      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        setNavMenuOpen(false);
        window.setTimeout(() => {
          if (item.action === "theme" || item.label === "Theme") {
            void openThemeSettingsFromNav();
          } else {
            activateNavSource(item.source);
          }
        }, 0);
      });
      bar.appendChild(btn);
    });
  }

  function syncNavMenuBar(){
    if (!isVerticalStacked()) {
      lastNavMenuSignature = "";
      return;
    }

    const items = collectNavMenuItems();
    const signature = getNavMenuSignature(items);
    if (signature === lastNavMenuSignature) return;
    lastNavMenuSignature = signature;
    rebuildNavMenuBar(items);
  }

  function setNavMenuOpen(open){
    const bar = document.getElementById("btfw-nav-menu-bar");
    const btn = document.getElementById("btfw-nav-access-btn");
    const on = !!open;

    if (on) closeNavMenuAvatar();

    if (bar) bar.classList.toggle("open", on);
    document.documentElement.classList.toggle("btfw-nav-menu-open", on);
    if (btn) {
      btn.classList.toggle("is-expanded", on);
      btn.setAttribute("aria-expanded", on ? "true" : "false");
    }
    dispatchMobileState(on);
  }

  function closeNavMenu(){
    setNavMenuOpen(false);
  }

  function toggleNavMenu(){
    if (!isVerticalStacked()) return;
    ensureNavMenuShell();
    syncNavMenuBar();
    setNavMenuOpen(!isNavMenuOpen());
  }

  function onNavMenuButtonClick(ev){
    ev.preventDefault();
    ev.stopPropagation();
    toggleNavMenu();
  }

  function closeNavMenuAvatar(){
    const wrap = document.getElementById("btfw-nav-menu-avatar-wrap");
    const btn = document.getElementById("btfw-nav-menu-avatar-btn");
    wrap?.classList.remove("open");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  function onNavMenuAvatarClick(ev){
    ev.preventDefault();
    ev.stopPropagation();
    closeNavMenu();

    const wrap = document.getElementById("btfw-nav-menu-avatar-wrap");
    const btn = document.getElementById("btfw-nav-menu-avatar-btn");
    if (!wrap || !btn) return;

    const menu = wrap.querySelector(":scope > .dropdown-menu");
    const name = getUserName();

    if (menu && name) {
      wrap.classList.toggle("open");
      btn.setAttribute("aria-expanded", wrap.classList.contains("open") ? "true" : "false");
      return;
    }

    const href = name ? "/account/profile" : "/login";
    if (name) window.open(href, "_blank", "noopener");
    else window.location.href = href;
  }

  function restoreAvatarDropdownToNav(){
    const avatarLi = document.getElementById("btfw-nav-avatar-item");
    const wrap = document.getElementById("btfw-nav-menu-avatar-wrap");
    if (!avatarLi || !wrap) return;
    const menu = wrap.querySelector(":scope > .dropdown-menu");
    if (menu) avatarLi.appendChild(menu);
    closeNavMenuAvatar();
  }

  function ensureNavMenuToolbar(shell){
    let toolbar = shell.querySelector(".btfw-nav-menu-toolbar");
    if (!toolbar) {
      toolbar = document.createElement("div");
      toolbar.className = "btfw-nav-menu-toolbar";
      const btn = shell.querySelector("#btfw-nav-access-btn");
      if (btn) toolbar.appendChild(btn);
      shell.appendChild(toolbar);
    }
    return toolbar;
  }

  function syncNavMenuAvatar(){
    if (!isVerticalStacked()) {
      restoreAvatarDropdownToNav();
      const wrap = document.getElementById("btfw-nav-menu-avatar-wrap");
      if (wrap) wrap.hidden = true;
      return;
    }

    const shell = ensureNavMenuShell();
    const toolbar = ensureNavMenuToolbar(shell);
    const avatarLi = document.getElementById("btfw-nav-avatar-item");
    const avatarLink = avatarLi?.querySelector(".btfw-nav-avatar-link");
    if (!avatarLink) {
      document.getElementById("btfw-nav-menu-avatar-wrap")?.remove();
      return;
    }

    let wrap = document.getElementById("btfw-nav-menu-avatar-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "btfw-nav-menu-avatar-wrap";
      wrap.className = "btfw-nav-menu-avatar-wrap dropdown";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.id = "btfw-nav-menu-avatar-btn";
      btn.className = "btfw-nav-menu-avatar-btn";
      btn.setAttribute("aria-label", "Account menu");
      btn.setAttribute("aria-haspopup", "true");
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", onNavMenuAvatarClick);
      wrap.appendChild(btn);
      toolbar.appendChild(wrap);
    } else if (wrap.parentElement !== toolbar) {
      toolbar.appendChild(wrap);
    }

    const btn = document.getElementById("btfw-nav-menu-avatar-btn");
    const imgSrc = avatarLink.querySelector("img")?.src || initialsDataURL(getUserName() || "Guest", 28);
    const name = getUserName();
    btn.title = name || "Sign in";
    btn.setAttribute("aria-label", name ? `${name} account menu` : "Sign in");
    btn.innerHTML = `<img class="btfw-nav-menu-avatar-btn__img" src="${escapeHtml(imgSrc)}" alt="" width="28" height="28">`;

    let menu = avatarLi.querySelector(":scope > .dropdown-menu");
    if (!menu) menu = wrap.querySelector(":scope > .dropdown-menu");
    if (menu && menu.parentElement !== wrap) {
      menu.classList.add("dropdown-menu-right");
      wrap.appendChild(menu);
    }

    if (menu) {
      menu.querySelectorAll(":scope > li > a").forEach((a) => {
        if (a.dataset.btfwNavAvatarMenuWired) return;
        a.dataset.btfwNavAvatarMenuWired = "1";
        a.addEventListener("click", () => closeNavMenuAvatar());
      });
    }

    wrap.hidden = false;
  }

  function wireNavMenuDismiss(){
    if (navMenuDismissWired) return;
    navMenuDismissWired = true;
    document.addEventListener("click", (ev) => {
      if (!isNavMenuOpen()) return;
      if (ev.target.closest("#btfw-nav-menu-shell")) return;
      closeNavMenu();
    });
    document.addEventListener("click", (ev) => {
      const wrap = document.getElementById("btfw-nav-menu-avatar-wrap");
      if (!wrap?.classList.contains("open")) return;
      if (ev.target.closest("#btfw-nav-menu-avatar-wrap")) return;
      closeNavMenuAvatar();
    });
  }

  function ensureNavMenuShell(){
    let shell = document.getElementById("btfw-nav-menu-shell");
    if (!shell) {
      shell = document.createElement("div");
      shell.id = "btfw-nav-menu-shell";
      shell.className = "btfw-nav-menu-shell";
      shell.setAttribute("aria-label", "Channel navigation");

      const bar = document.createElement("div");
      bar.id = "btfw-nav-menu-bar";
      bar.className = "btfw-nav-menu-bar";
      bar.setAttribute("role", "menu");
      shell.appendChild(bar);

      const toolbar = document.createElement("div");
      toolbar.className = "btfw-nav-menu-toolbar";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.id = "btfw-nav-access-btn";
      btn.className = "btfw-nav-access-btn btfw-nav-menu-btn";
      btn.setAttribute("aria-label", "Channel navigation menu");
      btn.setAttribute("aria-expanded", "false");
      btn.innerHTML = '<span class="btfw-nav-access-btn__icon" aria-hidden="true"><i class="fa fa-bars"></i></span><span class="btfw-nav-access-btn__label">Menu</span>';
      btn.addEventListener("click", onNavMenuButtonClick);
      toolbar.appendChild(btn);
      shell.appendChild(toolbar);

      document.body.appendChild(shell);
      wireNavMenuDismiss();
    }

    ensureNavMenuToolbar(shell);

    const toolbar = shell.querySelector(".btfw-nav-menu-toolbar");
    const bar = document.getElementById("btfw-nav-menu-bar");
    if (toolbar && bar && bar.parentElement !== toolbar) {
      toolbar.insertBefore(bar, toolbar.firstChild);
    }

    const orphanBtn = document.getElementById("btfw-nav-access-btn");
    if (orphanBtn && toolbar && orphanBtn.parentElement !== toolbar) {
      toolbar.insertBefore(orphanBtn, toolbar.firstChild);
      if (!orphanBtn.dataset.btfwNavMenuWired) {
        orphanBtn.addEventListener("click", onNavMenuButtonClick);
        orphanBtn.dataset.btfwNavMenuWired = "1";
      }
    }

    return shell;
  }

  function syncNavMenuVisibility(){
    if (!isVerticalStacked()) {
      closeNavMenu();
      restoreAvatarDropdownToNav();
      const shell = document.getElementById("btfw-nav-menu-shell");
      if (shell) shell.hidden = true;
      return;
    }

    ensureNavMenuShell();
    const shell = document.getElementById("btfw-nav-menu-shell");
    if (shell) shell.hidden = false;
    syncNavMenuBar();
    syncNavMenuAvatar();
  }

  function isMobileNavOpen(){
    if (isVerticalStacked()) return isNavMenuOpen();
    const host = document.getElementById("btfw-navhost");
    if (!host) return false;
    return host.getAttribute("data-mobile-open") === "true";
  }

  function dispatchMobileState(open){
    const host = document.getElementById("btfw-navhost");
    const mobile = host?.classList.contains("btfw-navhost--mobile") || false;
    if (lastMobileDispatch.open === open && lastMobileDispatch.mobile === mobile) return;
    lastMobileDispatch = { open, mobile };
    document.dispatchEvent(new CustomEvent("btfw:navbar:mobileState", {
      detail: { open, mobile }
    }));
  }

  function setMobileNavOpen(open){
    const host = document.getElementById("btfw-navhost");
    if (!host) return;

    if (isVerticalStacked()) {
      if (!open) closeNavMenu();
      return;
    }

    const value = open ? "true" : "false";
    const prev = host.getAttribute("data-mobile-open");
    if (prev !== value) {
      host.setAttribute("data-mobile-open", value);
    }

    const isMobile = host.classList.contains("btfw-navhost--mobile");
    if (document.body) {
      if (isMobile && open) document.body.classList.add("btfw-mobile-nav-open");
      else document.body.classList.remove("btfw-mobile-nav-open");
    }

    dispatchMobileState(open);
  }

  function toggleMobileNav(){
    const host = document.getElementById("btfw-navhost");
    if (!host) return;
    if (isVerticalStacked()) {
      toggleNavMenu();
      return;
    }
    if (!host.classList.contains("btfw-navhost--mobile")) {
      setMobileNavOpen(true);
      return;
    }
    setMobileNavOpen(!isMobileNavOpen());
  }

  function dispatchAutohideState(){
    document.dispatchEvent(new CustomEvent("btfw:navbar:autohide", {
      detail: {
        active: autohideActive,
        hidden: autohideHidden
      }
    }));
  }

  function ensureNavRevealZone(){
    let zone = document.getElementById("btfw-nav-reveal-zone");
    if (!zone) {
      zone = document.createElement("button");
      zone.type = "button";
      zone.id = "btfw-nav-reveal-zone";
      zone.setAttribute("aria-label", "Show navigation");
      zone.addEventListener("click", (ev) => {
        ev.preventDefault();
        if (isVerticalStacked()) toggleNavMenu();
        else revealAutohideNav({ autoHideAfter: AUTOHIDE_REVEAL_MS });
      });
      document.body.appendChild(zone);
    }
    return zone;
  }

  function setAutohideNavHidden(hidden){
    const host = document.getElementById("btfw-navhost");
    if (!host || !autohideActive) return;
    autohideHidden = !!hidden;
    host.setAttribute("data-nav-hidden", autohideHidden ? "true" : "false");
    host.setAttribute("data-nav-revealed", autohideHidden ? "false" : "true");
    const zone = ensureNavRevealZone();
    zone.classList.toggle("is-active", autohideHidden && !isVerticalStacked());
    dispatchAutohideState();
  }

  function revealAutohideNav(opts = {}){
    if (!autohideActive) return;
    setAutohideNavHidden(false);
    if (autohideRevealTimer) clearTimeout(autohideRevealTimer);
    const delay = opts.autoHideAfter;
    if (Number.isFinite(delay) && delay > 0) {
      autohideRevealTimer = setTimeout(() => {
        autohideRevealTimer = null;
        setAutohideNavHidden(true);
      }, delay);
    }
  }

  function getLayoutScrollY(){
    const grid = document.getElementById("btfw-grid");
    if (grid?.classList.contains("btfw-grid--vertical")) {
      return grid.scrollTop || 0;
    }
    return window.scrollY || document.documentElement.scrollTop || 0;
  }

  function onAutohideScroll(){
    if (!autohideActive || isVerticalStacked()) return;
    const y = getLayoutScrollY();
    const delta = y - autohideScrollLastY;
    autohideScrollLastY = y;
    if (delta < -8) revealAutohideNav({ autoHideAfter: AUTOHIDE_REVEAL_MS });
    else if (delta > 12 && y > 24) setAutohideNavHidden(true);
  }

  function updateVerticalAutohideState(){
    const host = document.getElementById("btfw-navhost");
    if (!host) return;

    const stacked = isVerticalStacked();
    host.classList.toggle("btfw-navhost--stacked-menu", stacked);

    if (!stacked) {
      closeNavMenu();
    }

    syncNavMenuVisibility();

    if (autohideRevealTimer) {
      clearTimeout(autohideRevealTimer);
      autohideRevealTimer = null;
    }
    autohideActive = false;
    autohideHidden = false;
    host.classList.remove("btfw-navhost--autohide");
    host.removeAttribute("data-nav-hidden");
    host.removeAttribute("data-nav-revealed");
    const zone = document.getElementById("btfw-nav-reveal-zone");
    if (zone) zone.classList.remove("is-active");
    dispatchAutohideState();
  }

  function setupVerticalAutohide(){
    updateVerticalAutohideState();
    if (autohideHandlersBound) return;
    autohideHandlersBound = true;
    document.addEventListener("btfw:layout:orientation", () => updateVerticalAutohideState());
    window.addEventListener("resize", () => updateVerticalAutohideState());
    window.addEventListener("scroll", onAutohideScroll, { passive: true });
    const grid = document.getElementById("btfw-grid");
    if (grid) grid.addEventListener("scroll", onAutohideScroll, { passive: true });
  }

  function updateMobileNavState(){
    const host = document.getElementById("btfw-navhost");
    if (!host) return;
    const wasMobile = host.classList.contains("btfw-navhost--mobile");
    const shouldEnable = window.innerWidth <= MOBILE_BREAKPOINT;
    host.classList.toggle("btfw-navhost--mobile", shouldEnable);
    if (shouldEnable) {
      if (!mobileNavActive || !wasMobile) {
        mobileNavActive = true;
        setMobileNavOpen(false);
      } else {
        setMobileNavOpen(isMobileNavOpen());
      }
    } else {
      mobileNavActive = false;
      closeNavMenu();
      host.setAttribute("data-mobile-open", "true");
      if (document.body) document.body.classList.remove("btfw-mobile-nav-open");
      dispatchMobileState(true);
    }
    updateVerticalAutohideState();
  }

  function setupMobileNav(){
    const host = document.getElementById("btfw-navhost");
    if (!host) return;
    updateMobileNavState();
    setupVerticalAutohide();
    if (mobileNavHandlersBound) return;
    mobileNavHandlersBound = true;
    window.addEventListener("resize", () => updateMobileNavState());
    document.addEventListener("btfw:layout:orientation", () => syncNavMenuVisibility());
  }

  state.nav.setMobileOpen = setMobileNavOpen;
  state.nav.toggleMobile = toggleMobileNav;
  state.nav.isMobileOpen = isMobileNavOpen;
  state.nav.setMenuOpen = setNavMenuOpen;
  state.nav.toggleMenu = toggleNavMenu;

  // ---------- Boot ----------
  function boot(){
    hideLogoutForm();
    ensureThemeButtonHook();
    pruneNavLinks();
    renderAvatar();
    setupAvatarAccountDropdown();
    setupMobileNav();

    const userlist = $("#userlist");
    if (userlist && !userlist._btfwNavMO){
      const mo = new MutationObserver(()=> refresh());
      mo.observe(userlist, { childList:true, subtree:true });
      userlist._btfwNavMO = mo;
    }

    try {
      if (window.socket && socket.on) {
        socket.on("login", refresh);
        socket.on("logout", refresh);
        socket.on("setProfile", refresh);
        socket.on("userlist", refresh);
      }
    } catch(_) {}

    let tries = 0;
    const t = setInterval(()=>{
      tries++;
      const navUL = findNavList();
      if (navUL) {
        hideLogoutForm();
        ensureThemeButtonHook();
        pruneNavLinks();
        renderAvatar();
        setupAvatarAccountDropdown();
        setupMobileNav();
      }
      if (tries > 10 || navUL) clearInterval(t);
    }, 300);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  return { name:"feature:navbar", refresh };
});

