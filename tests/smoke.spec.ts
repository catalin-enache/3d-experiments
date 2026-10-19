import { test, expect } from "@playwright/test";
import { flatRoutes } from "@src/routes";

// Opens every route, waits for a canvas to render a few frames,
// saves a screenshot in `screenshots/` and fails on console / page errors.
// Run one page: `npm run smoke -- -g "Stencil Portal"`.

const settleMs = Number(process.env.SETTLE_MS ?? 1500);

for (const route of flatRoutes) {
  const title = route.breadcrumbs.join(" / ");

  test(title, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
    });
    page.on("pageerror", (error) => {
      errors.push(`pageerror: ${error.message}`);
    });

    // HashRouter: routes live after `#`
    await page.goto(`./#${route.path}`);
    await expect(page.locator("canvas").first()).toBeVisible({
      timeout: 15_000
    });
    await page.waitForTimeout(settleMs);

    const fileName = route.path.replace(/^\//, "").replace(/\//g, "__");
    await page.screenshot({
      path: `screenshots/${fileName || "home"}.png`
    });

    expect(errors, errors.join("\n")).toEqual([]);
  });
}
