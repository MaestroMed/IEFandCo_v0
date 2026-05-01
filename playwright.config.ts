import { defineConfig, devices } from "@playwright/test";

// Port 3100 (instead of Next's default 3000) to avoid colliding with any
// already-running dev server on the developer's machine.
const E2E_PORT = process.env.PLAYWRIGHT_E2E_PORT || "3100";
const customBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = customBaseURL || `http://localhost:${E2E_PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : [["html", { open: "never" }], ["list"]],
  timeout: 60_000,
  expect: { timeout: 5_000 },

  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Auto-launch `next dev` only when we're not pointed at a custom URL.
  webServer: customBaseURL
    ? undefined
    : {
        command: `npm run dev -- --port ${E2E_PORT}`,
        url: `http://localhost:${E2E_PORT}`,
        reuseExistingServer: false,
        timeout: 180_000,
      },
});
