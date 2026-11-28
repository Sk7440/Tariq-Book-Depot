import { expect, test } from "@playwright/test";
import { LANGS } from "../src/i18n/config";

/** Every page at 375, 768, 1024 and 1440px in English and Urdu: no horizontal overflow, no console or hydration errors. */
const WIDTHS = [375, 768, 1024, 1440] as const;
const PAGES = ["", "/shop", "/shop/stationery", "/shop/books", "/search?q=oro", "/products/oro-veezo-eraser", "/cart", "/checkout", "/order", "/about", "/contact"] as const;

for (const lang of LANGS) {
  for (const path of PAGES) {
    test(`${lang}${path || "/"} has no overflow or errors`, async ({ page }, info) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
      page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });

      // A cart line so /cart and /checkout render their full layouts.
      await page.addInitScript(() => window.localStorage.setItem("tbd-cart-v1", JSON.stringify([{ id: "oro-veezo-eraser", qty: 2 }])));

      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/${lang}${path}`, { waitUntil: "load" });
        await page.waitForTimeout(400);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${lang}${path} at ${width}px`).toBeLessThanOrEqual(0);
        const name = `${lang}${path.replace(/[/?=&]/g, "_") || "_home"}-${width}.png`;
        await page.screenshot({ path: info.outputPath(name), fullPage: true });
      }
      expect(errors).toEqual([]);
    });
  }
}

test("unknown routes return 404 in both languages and outside them", async ({ request }) => {
  for (const url of ["/en/not-a-page", "/ur/products/not-a-product", "/nope"]) {
    const res = await request.get(url);
    expect(res.status(), url).toBe(404);
  }
});
