import { defineConfig, devices } from "@playwright/test";

/**
 * E2E runs against a production build in .next-e2e. NEXT_PUBLIC_E2E_WHATSAPP is a fake test number
 * so the WhatsApp hand-off can be asserted; the real store number stays null in src/config/store.ts.
 */
export const E2E_WHATSAPP = "920000000000";
const PORT = 3100;

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: Boolean(process.env.CI),
  reporter: [["list"]],
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npx next build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/en`,
    env: { NEXT_PUBLIC_E2E_WHATSAPP: E2E_WHATSAPP },
    reuseExistingServer: false,
    timeout: 300_000,
  },
});
