import { defineConfig } from "@playwright/test";

const port = "5199";
const url = `http://localhost:${port}/3d-experiments/`;

// Smoke tests: open every page, collect errors, save a screenshot per page.
// HEADED=1 shows the browser (useful when WebGPU does not start headless).
export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: url,
    // the installed Google Chrome (real GPU, WebGPU support) instead of the bundled Chromium
    channel: "chrome",
    headless: !process.env.HEADED,
    viewport: { width: 1280, height: 800 },
    launchOptions: {
      args: ["--enable-unsafe-webgpu", "--ignore-gpu-blocklist"]
    }
  },
  webServer: {
    command: `npm run dev -- --port ${port} --strictPort`,
    url,
    reuseExistingServer: true,
    timeout: 60_000
  }
});
