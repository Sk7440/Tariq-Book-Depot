# CLAUDE.md — Tariq Book Depot

Static-first online store in `apps/storefront` (Next.js 15.5 App Router, React 19, TypeScript), deployed on Vercel. There is no backend. Products come from `Products/`, are converted to JSON by a script, and are listed on the site. Orders are Cash on Delivery and are handed to the shop on WhatsApp.

The approved design is `references/tariq-book-depot.html`. Port it to React; don't redesign it. Where any other note disagrees with it on visuals, the HTML wins.

## Non-negotiables

1. **Zero invented data.** Never make up products, prices, brands, reviews, ratings, stock levels, phone numbers, addresses, delivery rates, policies or history (e.g. a founding year). A missing value is `null` plus an entry in `OPEN_QUESTIONS.md`, and the UI shows an honest state.
2. **No hidden errors.** Never use `@ts-ignore`, `@ts-expect-error`, `eslint-disable`, `any`, `typescript.ignoreBuildErrors`, `eslint.ignoreDuringBuilds` or skipped tests to get a green result. Fix the cause. If it still fails after 3 attempts, stop and report the exact error.
3. **Ask before destroying.** Delete or move only what the owner approved. Work on branch `rebuild/json-store`, one commit per finished step, conventional commit messages.
4. **Verify, don't assume.** Check the installed version and official docs before using any API (Next.js, GSAP, Motion, zod, Playwright, Vercel). Paste real command output; never write "should work".
5. **Stay in scope.** No accounts, payment gateway, CMS, database, analytics, or pages beyond the HTML unless the owner asks.

## Architecture (decided)

- **Data flow:** `Products/` → `npm run products:sync` → committed outputs:
  - `apps/storefront/src/data/products.json`
  - `apps/storefront/public/products/**`

  The build reads only these committed files, never `Products/`, so every Vercel build is deterministic. `npm run products:check` fails when the committed outputs don't match `Products/`.
- **Owner-edited files** (the sync never overwrites existing entries; it only appends new categories):
  - `apps/storefront/src/data/categories.json`: `slug`, `name {en, ur | null}`, `departments` (array of `books | stationery | paper | office`, empty until assigned), `order`, `aliases` (folder names, e.g. `"Sharpners"`, `"Blc"`).
  - `apps/storefront/src/data/overrides.json`: per product id: `active`, `sort`, `homeSection` (`stationery | new`), `bestSeller`, `offerPrice`, `unit` (`box | pack | jar | piece | ream`), `imageOrder` (source photo file names in display order; first = cover).

  zod (`src/lib/catalog-schema.ts`) validates all three files at build time with clear messages.
- **Store settings:** `apps/storefront/src/config/store.ts` holds name, city, WhatsApp number, phone, address, hours, and delivery options with prices. Everything is `null` until the owner provides it. No environment variables are needed to build.
- **Rendering:** Server Components and static generation (`generateStaticParams` for product pages). Client components only for cart, search, filters, language toggle and motion.
- **Cart:** stored in localStorage and validated against `products.json` on load. Prices always come from the JSON.
- **Checkout:** Cash on Delivery through an `OrderSink` interface with a WhatsApp implementation. It opens `https://wa.me/<number>?text=…` with the order reference, items, quantities, totals and customer details. If the number is `null`, the button is disabled and says why.
- **Languages:** English (LTR) and Urdu (RTL), using the HTML's dictionaries and logical CSS properties. English product data inside Urdu pages stays in LTR-isolated spans.
- **Motion:**
  - GSAP + `@gsap/react` (`useGSAP`, `gsap.matchMedia`, ScrollTrigger, SplitText): only the hero sequence and the book-shelf scroll moment.
  - Motion (`motion` package, imported from `motion/react`): cart drawer, mobile menu, add-to-cart feedback, filter-grid `layout` reflow, cart lines and FAQ.
  - Never use both libraries on one element. No fade-up on every section. Both respect `prefers-reduced-motion`.

## Product JSON contract

`products.json` is an array of:

```jsonc
{ "id": "oro-veezo-eraser",                        // kebab-case of name, stable, unique
  "title": "Oro Veezo Eraser – 72 Pieces Jar",     // title line of the .txt, verbatim
  "name": "Oro Veezo Eraser",                      // title before the first " – " or " | "
  "brand": "Oro",                                  // `Brand:` bullet, else null
  "category": "erasers",                           // via categories.json from the folder name
  "price": 450,                                    // PKR integer from the price line
  "priceNote": null,                               // e.g. "per pcs" when the price line says so
  "description": ["…"],
  "specs": [{ "label": "Pack Size", "value": "72 Pieces" }],   // `* Key: Value` bullets (Brand excluded)
  "features": ["Smooth and clean erasing"],                    // other bullets
  "images": ["/products/erasers/oro-veezo-eraser/01.jpeg"],
  "source": "Products/Erasers/oro veezo/oro.txt" }
```

## Sync script rules (`scripts/sync-products.ts`, run with tsx)

**Folders**
- Accept `Products/<Category>/<Product>/`.
- A flat `Products/<Product>/` is accepted only if a category in categories.json lists it as an alias; otherwise it is skipped and reported.
- Entries starting with `_` (e.g. `_TEMPLATE.txt`) are ignored.

**Text file**
- Exactly one `.txt` per product, UTF-8. CRLF and LF are both accepted.
- **Title** = line 1. If line 1 is blank or a bullet, the **product folder name** is used. If line 1 is a full sentence (no ` – ` / ` | `, ends with `.`), its subject before " is a/an " is used (e.g. "Dux 12-Inch Scale"), else the folder name; the sentence stays in the description. Every fallback is reported.
- **Price** = the last line matching `^rs\.?\s*<number>` (case-insensitive). Any text after the number becomes `priceNote`.
- Lines after the price line (e.g. `Available clrs blck blue`) are kept verbatim as description paragraphs and reported.
- Lines ending in `:` that introduce bullets (`Features:`, `Key Features:`, `Product Specifications:` …) are headings and are dropped.
- `* Key: Value` bullets become specs, except `Brand`, which fills `brand`. Other bullets become features.
- In fallback-title files, the paragraph text before the bullets is description.

**Images**
- `.jpg .jpeg .png .webp` in any letter case; spaces in names are fine.
- Default order is by file name; `overrides.imageOrder` sets the order.
- Written to `public/products/<category>/<id>/01.<ext>`, `02.<ext>` … in lowercase kebab-case.
- Byte-identical duplicates (content hash) are skipped. Duplicates across products are reported.
- Outputs of products that no longer exist are deleted.

**Categories**
- A new category folder is appended to categories.json with `en` = folder name in title case, `ur = null`, `departments = []`, and reported.
- Its products appear under All products until the owner sets a department.

**Errors and report**
- Anything unparseable (no price line, 0 or 2+ `.txt` files, no images) is skipped and reported with the reason. Never guess.
- Idempotent. Prints a report: products, images written, duplicates skipped, skipped folders with reasons, fallbacks used, new categories.

## Adding a product

See `Products/_TEMPLATE.txt`. Create `Products/<Category>/<Product name>/`, add one `.txt` and the photos, run `npm run products:sync`, then commit `Products/`, `src/data/` and `public/products/`.

## Commands (from the repo root)

- `npm run dev:storefront`: dev server on port 8000 (`/` → `/en`; Urdu at `/ur`).
- `npm run typecheck` (storefront + scripts) · `npm run lint` · `npm run build:storefront`
- `npm run test:unit`: parser, order and filter tests with coverage.
- `npm run products:sync` · `npm run products:check` (also checks image paths case-sensitively).
- `npm run test:e2e`: Playwright. It builds into `.next-e2e` with `NEXT_PUBLIC_E2E_WHATSAPP` (a fake test number). Production never sets this variable.

## Routing and code map

- Pages live under `src/app/[lang]/` (`en` | `ur`, static). Unknown paths outside `/en` and `/ur` use `src/app/global-not-found.tsx` (`experimental.globalNotFound`).
- UI strings: `src/i18n/dictionaries.ts`, generated from the HTML's `T` object plus four WhatsApp strings (see OPEN_QUESTIONS.md).
- CSS: `src/styles/*.css`, ported verbatim from the HTML and layered under Tailwind v4.
- Orders: `src/lib/order.ts` (pure, tested) → `src/lib/order-sink.ts` (`OrderSink`, WhatsApp) → `src/lib/order-storage.ts` (sessionStorage).
- Client components never import `src/lib/catalog.ts`, which bundles all catalogue JSON; they use `src/lib/format.ts` and `ClientProduct`.
