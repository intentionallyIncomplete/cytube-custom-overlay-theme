import { defineConfig, devices } from "@playwright/test";

const host = process.env.E2E_HOST || "127.0.0.1";
const port = Number(process.env.E2E_PORT || 3099);
const fixturePath = "/tests/fixtures/channel.html";
const defaultBaseUrl = `http://${host}:${port}`;
const baseURL = process.env.E2E_BASE_URL || defaultBaseUrl;
const useExternalTarget = Boolean(process.env.E2E_BASE_URL);

// Use OpenClaw managed Chromium wrapper (includes LD_LIBRARY_PATH for libnspr4.so) to avoid libnspr4.so issues in WSL
const chromiumExecutable = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  "/home/escape/.local/chromium-libs/chrome-wrapper.sh";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "tests/test-results",
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
      name: "custom-chromium",
      use: {
        ...devices["Desktop Chrome"],
        executablePath: chromiumExecutable
      },
      browserName: "chromium"
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
