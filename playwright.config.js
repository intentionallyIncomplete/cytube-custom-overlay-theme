import { defineConfig, devices } from "@playwright/test";

const host = process.env.E2E_HOST || "127.0.0.1";
const port = Number(process.env.E2E_PORT || 3099);
const fixturePath = "/e2e/fixture/channel.html";
const defaultBaseUrl = `http://${host}:${port}`;
const baseURL = process.env.E2E_BASE_URL || defaultBaseUrl;
const useExternalTarget = Boolean(process.env.E2E_BASE_URL);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["github"], ["list"], ["html", { open: "never" }]]
    : "list",
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  webServer: useExternalTarget
    ? undefined
    : {
        command: "node scripts/e2e-server.js",
        url: `${defaultBaseUrl}${fixturePath}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: {
          E2E_HOST: host,
          E2E_PORT: String(port)
        }
      }
});
