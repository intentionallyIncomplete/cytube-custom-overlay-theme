/**
 * Central app state bag. Legacy document._btfw_* hooks are thin shims over this object.
 */
export function createBtfwState() {
  return {
    userlist: {
      isOpen: null,
      open: null,
      close: null,
      position: null
    },
    nav: {
      setMobileOpen: null,
      toggleMobile: null,
      isMobileOpen: null,
      setMenuOpen: null,
      toggleMenu: null
    },
    theme: {
      openSettings: null
    },
    chat: {
      userlistWatch: false,
      btnWatch: false,
      nameContextWired: false
    }
  };
}

export function installLegacyStateShims(state, doc = document) {
  Object.defineProperty(doc, "_btfw_userlist_watch", {
    configurable: true,
    get() {
      return state.chat.userlistWatch;
    },
    set(value) {
      state.chat.userlistWatch = value;
    }
  });

  doc._btfw_userlist_isOpen = () => state.userlist.isOpen?.();
  doc._btfw_userlist_open = (...args) => state.userlist.open?.(...args);
  doc._btfw_userlist_close = (...args) => state.userlist.close?.(...args);
  doc._btfw_userlist_position = (...args) => state.userlist.position?.(...args);

  doc._btfw_nav_setMobileOpen = (...args) => state.nav.setMobileOpen?.(...args);
  doc._btfw_nav_toggleMobile = (...args) => state.nav.toggleMobile?.(...args);
  doc._btfw_nav_isMobileOpen = (...args) => state.nav.isMobileOpen?.(...args);
  doc._btfw_nav_setMenuOpen = (...args) => state.nav.setMenuOpen?.(...args);
  doc._btfw_nav_toggleMenu = (...args) => state.nav.toggleMenu?.(...args);

  doc._btfw_openThemeSettings = (...args) => state.theme.openSettings?.(...args);
}
