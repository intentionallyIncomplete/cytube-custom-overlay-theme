import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/unit/**/*.vitest.ts"],
    exclude: [...configDefaults.exclude, "tests/e2e/**", "test-results/**"],
  },
});
