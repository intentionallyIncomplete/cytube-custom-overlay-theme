import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createBtfwRegistry } from "../lib/btfw-registry.js";

const DEV_CDN = "https://cdn.example/test";

describe("BTFW registry", () => {
  // Exercises: init → Registry[moduleName] is falsy — throws Module not found
  it("test_init_when_module_missing_then_throws", async () => {
    const { init } = createBtfwRegistry(DEV_CDN);
    await assert.rejects(
      () => init("__missing__"),
      (err) => err instanceof Error && err.message === "Module not found: __missing__"
    );
  });

  // Exercises: init → module.instance already set — returns without re-running factory
  it("test_init_when_cached_instance_then_returns_without_factory", async () => {
    const { define, init, getRegistry } = createBtfwRegistry(DEV_CDN);
    let factoryCalls = 0;
    define("test:cached", [], async () => {
      factoryCalls += 1;
      return { from: "factory" };
    });
    const cached = { from: "cache" };
    getRegistry()["test:cached"].instance = cached;

    const result = await init("test:cached");

    assert.equal(result, cached);
    assert.equal(factoryCalls, 0);
  });

  // Exercises: init → deps.length > 0 — inits each dep before parent factory
  it("test_init_when_module_has_deps_then_inits_deps_first", async () => {
    const { define, init } = createBtfwRegistry(DEV_CDN);
    let depReady = false;
    define("test:dep-a", [], async () => {
      depReady = true;
      return {};
    });
    define("test:with-deps", ["test:dep-a"], async () => {
      assert.equal(depReady, true, "dependency must be initialized before parent factory");
      return { parent: true };
    });

    const result = await init("test:with-deps");

    assert.deepEqual(result, { parent: true });
  });

  // Exercises: init → instance null and deps satisfied — runs factory and caches result
  it("test_init_when_leaf_module_then_runs_factory", async () => {
    const { define, init, getRegistry } = createBtfwRegistry(DEV_CDN);
    let ctxSeen = null;
    define("test:leaf", [], async (ctx) => {
      ctxSeen = ctx;
      return { ok: true };
    });

    const result = await init("test:leaf");
    const entry = getRegistry()["test:leaf"];

    assert.deepEqual(result, { ok: true });
    assert.equal(entry.instance, result);
    assert.equal(typeof ctxSeen.define, "function");
    assert.equal(typeof ctxSeen.init, "function");
    assert.equal(ctxSeen.DEV_CDN, DEV_CDN);
  });

  // Exercises: define → stores Registry entry with deps, factory, instance null
  it("test_define_when_valid_module_then_registers", () => {
    const { define, getRegistry } = createBtfwRegistry(DEV_CDN);
    const factory = async () => null;

    define("test:defined", [], factory);

    const entry = getRegistry()["test:defined"];
    assert.ok(entry);
    assert.deepEqual(entry.deps, []);
    assert.equal(entry.factory, factory);
    assert.equal(entry.instance, null);
  });
});
