
BTFW.define("feature:navbar", [], async () => {
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

  function getUserName(){
    try { return (window.CLIENT && CLIENT.name) ? CLIENT.name : ""; }
    catch(_) { return ""; }
  }

  function findUserlistItem(name){
    if (!name) return null;
    const byData = document.querySelector(`#userlist li[data-name="${CSS.escape(name)}"]`);
    if (byData) return byData;
    const items = document.querySelectorAll("#userlist li, #userlist .userlist_item, #userlist .user");
    for (const el of items) {
      const t = (el.textContent || "").trim();
      if (t && t.replace(/\s+/g,"").toLowerCase().startsWith(name.toLowerCase())) return el;
    }
    return null;
  }

  function getProfileImgFromUserlist(name){
    try {
      const li = findUserlistItem(name);
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
  }

  function isMobileNavOpen(){
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

  function ensureMobileCloseButton(){
    const host = document.getElementById("btfw-navhost");
    if (!host) return;
    const nav = host.querySelector(":is(nav.navbar, .navbar, #navbar, .navbar-fixed-top)");
    if (!nav) return;

    let btn = document.getElementById("btfw-mobile-nav-close");
    if (btn && btn.closest(":is(nav.navbar, .navbar, #navbar, .navbar-fixed-top)") !== nav) {
      btn.remove();
      btn = null;
    }

    if (!btn) {
      btn = document.createElement("button");
      btn.type = "button";
      btn.id = "btfw-mobile-nav-close";
      btn.className = "btfw-mobile-nav-close";
      btn.setAttribute("aria-label", "Close navigation menu");
      btn.innerHTML = "<span aria-hidden=\"true\">&times;</span>";
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        setMobileNavOpen(false);
      });
      nav.insertBefore(btn, nav.firstChild);
    }
  }

  function toggleMobileNav(){
    const host = document.getElementById("btfw-navhost");
    if (!host) return;
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
        revealAutohideNav({ autoHideAfter: AUTOHIDE_REVEAL_MS });
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
    zone.classList.toggle("is-active", autohideHidden);
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

  function onAutohideScroll(){
    if (!autohideActive) return;
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const delta = y - autohideScrollLastY;
    autohideScrollLastY = y;
    if (delta < -8) revealAutohideNav({ autoHideAfter: AUTOHIDE_REVEAL_MS });
    else if (delta > 12 && y > 24) setAutohideNavHidden(true);
  }

  function updateVerticalAutohideState(){
    const host = document.getElementById("btfw-navhost");
    const grid = document.getElementById("btfw-grid");
    if (!host) return;

    const shouldAutohide = Boolean(grid && grid.classList.contains("btfw-grid--vertical")
      && window.innerWidth > MOBILE_BREAKPOINT);
    host.classList.toggle("btfw-navhost--autohide", shouldAutohide);
    autohideActive = shouldAutohide;

    if (!shouldAutohide) {
      if (autohideRevealTimer) {
        clearTimeout(autohideRevealTimer);
        autohideRevealTimer = null;
      }
      autohideHidden = false;
      host.removeAttribute("data-nav-hidden");
      host.removeAttribute("data-nav-revealed");
      const zone = document.getElementById("btfw-nav-reveal-zone");
      if (zone) zone.classList.remove("is-active");
      dispatchAutohideState();
      return;
    }

    ensureNavRevealZone();
    autohideScrollLastY = window.scrollY || 0;
    setAutohideNavHidden(true);
  }

  function setupVerticalAutohide(){
    updateVerticalAutohideState();
    if (autohideHandlersBound) return;
    autohideHandlersBound = true;
    document.addEventListener("btfw:layout:orientation", () => updateVerticalAutohideState());
    window.addEventListener("resize", () => updateVerticalAutohideState());
    window.addEventListener("scroll", onAutohideScroll, { passive: true });
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
      setMobileNavOpen(true);
    }
    updateVerticalAutohideState();
  }

  function setupMobileNav(){
    const host = document.getElementById("btfw-navhost");
    if (!host) return;
    ensureMobileCloseButton();
    updateMobileNavState();
    setupVerticalAutohide();
    if (mobileNavHandlersBound) return;
    mobileNavHandlersBound = true;
    window.addEventListener("resize", () => updateMobileNavState());
    host.addEventListener("click", (ev) => {
      if (window.innerWidth > MOBILE_BREAKPOINT) return;
      const target = ev.target.closest?.('#btfw-navhost a, #btfw-navhost button');
      if (!target) return;
      setMobileNavOpen(false);
    }, true);
  }

  document._btfw_nav_setMobileOpen = setMobileNavOpen;
  document._btfw_nav_toggleMobile = toggleMobileNav;
  document._btfw_nav_isMobileOpen = isMobileNavOpen;

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

