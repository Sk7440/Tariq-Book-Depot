import { expect, test, type Page } from "@playwright/test";
import { LANGS, type Lang } from "../src/i18n/config";
import { pick, t } from "../src/i18n/t";
import categories from "../src/data/categories.json";
import { E2E_WHATSAPP } from "../playwright.config";

const ERASER = { id: "oro-veezo-eraser", name: "Oro Veezo Eraser", price: 450 };
const PENCILS = { id: "piano-lead-pencils", name: "Piano Lead Pencils", price: 250 };
const CUSTOMER = { name: "Test Customer", phone: "0300-1234567", address: "House 12, Street 4, Test Colony", city: "Pattoki", notes: "Please call first" };

function catName(lang: Lang, slug: string): string {
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) throw new Error(`category ${slug} missing`);
  return pick(lang, cat.name);
}

async function blockWhatsApp(page: Page): Promise<void> {
  // Never reach the real WhatsApp in tests; the URL itself is what we assert.
  await page.context().route("https://wa.me/**", (route) => route.fulfill({ status: 200, body: "wa.me stub" }));
}

for (const lang of LANGS) {
  test.describe(`checkout flow (${lang})`, () => {
    test("browse → filter → add → cart → checkout → WhatsApp URL has every detail", async ({ page }) => {
      await blockWhatsApp(page);
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

      // Browse: home → All products
      await page.goto(`/${lang}`);
      await expect(page.locator("html")).toHaveAttribute("dir", lang === "ur" ? "rtl" : "ltr");
      await page.getByRole("navigation", { name: t(lang, "mainNav") }).getByRole("link", { name: t(lang, "all"), exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`/${lang}/shop$`));

      // Filter: Erasers chip
      await page.getByRole("group", { name: t(lang, "category") }).getByRole("button", { name: new RegExp(`^${catName(lang, "erasers")}`) }).click();
      await expect(page).toHaveURL(/cat=erasers/);
      const grid = page.locator("[data-grid]");
      await expect(grid.locator(".card")).toHaveCount(2);

      // Add the eraser from the grid
      await grid.getByRole("button", { name: `${t(lang, "add")}: ${ERASER.name}` }).click();
      await expect(page.locator(".cartbtn__count")).toHaveText("1");

      // Add two packs of pencils from the product page
      await page.goto(`/${lang}/products/${PENCILS.id}`);
      await page.getByRole("button", { name: t(lang, "inc") }).click();
      await page.locator(".pdp__info .buy .btn").click();
      await expect(page.locator(".cartbtn__count")).toHaveText("3");

      // Cart drawer → View cart
      await page.locator(".cartbtn").click();
      const drawer = page.getByRole("dialog", { name: t(lang, "yourCart") });
      await expect(drawer).toBeVisible();
      await expect(drawer.locator(".line")).toHaveCount(2);
      await drawer.getByRole("link", { name: t(lang, "viewCart") }).click();
      await expect(page).toHaveURL(new RegExp(`/${lang}/cart$`));
      await expect(page.locator(".cartpage .line")).toHaveCount(2);
      await page.locator(".summary").getByRole("link", { name: t(lang, "checkout") }).click();

      // Checkout: validation first
      await expect(page).toHaveURL(new RegExp(`/${lang}/checkout$`));
      await page.getByLabel(t(lang, "fPhone"), { exact: true }).fill("12345");
      await page.getByTestId("place-order").click();
      await expect(page.locator(".co__err[role=alert]")).toHaveText(t(lang, "eForm"));
      await expect(page.getByLabel(t(lang, "fName"), { exact: true })).toBeFocused();

      await page.getByLabel(t(lang, "fName"), { exact: true }).fill(CUSTOMER.name);
      await page.getByLabel(t(lang, "fPhone"), { exact: true }).fill(CUSTOMER.phone);
      await page.getByLabel(t(lang, "fAddress"), { exact: true }).fill(CUSTOMER.address);
      await page.getByLabel(t(lang, "fCity"), { exact: true }).fill(CUSTOMER.city);
      await page.getByLabel(t(lang, "fNotes"), { exact: true }).fill(CUSTOMER.notes);

      const total = ERASER.price + PENCILS.price * 2;
      await expect(page.locator(".co__side [data-testid=order-total]")).toHaveText(`Rs ${total}`);

      const popupPromise = page.context().waitForEvent("page");
      await page.getByTestId("place-order").click();
      const popup = await popupPromise;
      await popup.waitForLoadState("domcontentloaded");
      const url = new URL(popup.url());

      expect(url.origin + url.pathname).toBe(`https://wa.me/${E2E_WHATSAPP}`);
      const text = url.searchParams.get("text") ?? "";
      expect(text).toContain(`${ERASER.name} (72 Pieces Jar) x 1 @ Rs 450 = Rs 450`);
      expect(text).toContain(`${PENCILS.name} (12 Pcs Box) x 2 @ Rs 250 = Rs 500`);
      expect(text).toContain(`Total: Rs ${total}`);
      for (const value of Object.values(CUSTOMER)) expect(text).toContain(value);
      expect(text).toContain("Payment: Cash on delivery");
      await popup.close();

      // Confirmation page with the same reference; cart emptied
      await expect(page).toHaveURL(new RegExp(`/${lang}/order$`));
      const ref = (await page.getByTestId("order-ref").textContent()) ?? "";
      expect(ref).toMatch(/^TB-\d{6}-\d{4}$/);
      expect(text).toContain(`New order ${ref}`);
      await expect(page.locator(".cartbtn__count")).toHaveText("0");
      expect(errors).toEqual([]);
    });
  });
}

test("checkout explains when the cart is empty", async ({ page }) => {
  await page.goto("/en/checkout");
  await expect(page.getByRole("heading", { name: t("en", "coEmptyT") })).toBeVisible();
});

test("drawer opens and closes with the keyboard, focus returns to the cart button", async ({ page }) => {
  await page.goto("/en");
  const cartButton = page.locator(".cartbtn");
  await cartButton.focus();
  await page.keyboard.press("Enter");
  const drawer = page.getByRole("dialog", { name: t("en", "yourCart") });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("button", { name: t("en", "closeCart") })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(cartButton).toBeFocused();
});

test("reduced motion: the menu appears without a slide", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/en");
  await page.getByRole("button", { name: t("en", "openMenu") }).click();
  const menu = page.getByRole("dialog", { name: t("en", "menu") });
  await expect(menu).toBeVisible();
  const transform = await menu.evaluate((el) => getComputedStyle(el).transform);
  expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(transform);
});
