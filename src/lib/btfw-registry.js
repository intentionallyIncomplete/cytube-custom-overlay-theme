/**
 * BTFW module registry (define / init). Used by billtube-fw (bundled) and unit tests.
 */
export function createBtfwRegistry(devCdn) {
  const Registry = Object.create(null);

  function define(moduleName, moduleDeps, functionFactory) {
    Registry[moduleName] = {
      deps: moduleDeps || [],
      factory: functionFactory,
      instance: null
    };
  }

  async function init(moduleName) {
    const module = Registry[moduleName];
    if (!module) {
      throw new Error("Module not found: " + moduleName);
    }
    if (module.instance) {
      return module.instance;
    }

    for (let i = 0; i < module.deps.length; i++) {
      await init(module.deps[i]);
    }

    module.instance = await module.factory({ define, init, DEV_CDN: devCdn });
    return module.instance;
  }

  function getRegistry() {
    return Registry;
  }

  return { define, init, getRegistry };
}
