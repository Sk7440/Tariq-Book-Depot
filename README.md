# Tariq Book Depot — online shop

A static Next.js 15 store for Tariq Book Depot, Pattoki: books, stationery and paper. It's in English and Urdu, takes Cash on Delivery, and hands orders to the shop on WhatsApp. There is no backend, database or account system.

- `Products/` holds the shop's product folders. This is the source of truth.
- `npm run products:sync` turns them into `apps/storefront/src/data/products.json` and `apps/storefront/public/products/**`. Commit both.
- The site (`apps/storefront`) reads only those committed files, so every build is the same.

Rules for contributors and AI agents are in [CLAUDE.md](CLAUDE.md). Values that are still unknown are listed in [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md).

## Run locally

Requires Node.js 22 (`.nvmrc`) and npm.

```sh
npm ci
npm run dev:storefront        # http://localhost:8000 (redirects to /en; Urdu at /ur)
```

Checks used before every commit:

```sh
npm run typecheck             # storefront + scripts
npm run lint
npm run test:unit             # parser, order message, shop filters (with coverage)
npm run products:check        # outputs match Products/, image paths exact-case
npm run build:storefront
npm run test:e2e              # Playwright: builds to .next-e2e, then runs en + ur
```

The first time you run e2e, install the browser with `npx playwright install chromium`.

## Add or change a product

1. Create `Products/<Category>/<Product name>/`, for example `Products/Pens/Oro GR-7 Gel Pen/`.
2. Put **one** `.txt` file and the photos (`.jpg`, `.jpeg`, `.png` or `.webp`) inside. Copy the format of `Products/_TEMPLATE.txt`:
   - First line: the title, e.g. `Oro Veezo Eraser – 72 Pieces Jar`. The part before ` – ` or ` | ` becomes the product name.
   - Then description paragraphs.
   - Then `* Key: Value` lines (specs; `* Brand: …` sets the brand) and `* feature` lines.
   - Last: the price line, e.g. `RS 450` or `Rs 50 per pcs`.
3. Run `npm run products:sync` and read the report. It lists:
   - skipped folders, with the reason
   - fallbacks it used (no title line, no brand)
   - duplicate photos
   - new categories
4. If a new category was added, edit `apps/storefront/src/data/categories.json`: set its Urdu name (`name.ur`) and `departments` (`books`, `stationery`, `paper`, `office`). Until then its products appear only under All products.
5. Optional, in `apps/storefront/src/data/overrides.json`, keyed by product id:
   - `active: false` hides a product
   - `homeSection` (`"stationery"` or `"new"`), `bestSeller`, `offerPrice`, `sort`
   - `unit` (`box`, `pack`, `jar`, `piece`, `ream`)
   - `brand`
   - `imageOrder` (photo file names; the first is the cover)

   Run `npm run products:sync` again after changing `imageOrder`.
6. Commit `Products/`, `apps/storefront/src/data/` and `apps/storefront/public/products/` together. `npm run products:check` fails if they don't match.

## Store details (WhatsApp number, phone, address, delivery rates)

Edit `apps/storefront/src/config/store.ts`. Every value is `null` until the owner provides it.

**Orders can't be placed until `whatsapp` is set.** Use international format, digits only, e.g. `"923001234567"`. Until then the checkout button is disabled and explains why.

## Deploy on Vercel

These settings were checked against Vercel's docs on 2026-11-28:
- [Monorepos](https://vercel.com/docs/monorepos)
- [Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Configure a build](https://vercel.com/docs/builds/configure-a-build)
- [System environment variables](https://vercel.com/docs/environment-variables/system-environment-variables)

Import the Git repository, then under **Project Settings → Build and Deployment**:

| Setting | Value |
|---|---|
| Framework Preset | Next.js |
| Root Directory | `apps/storefront` |
| Include files outside the root directory in the Build Step | Enabled (Vercel's default). The npm lockfile and workspace root live one level up. |
| Node.js Version | 22.x (also pinned by `"engines": { "node": "22.x" }` in both `package.json` files) |
| Install Command | Default. Vercel detects npm from the root `package-lock.json` and installs the workspace. |
| Build Command | Default. Vercel runs the storefront's `build` script (`next build`). |
| Output Directory | Default (`.next`) |
| Environment variables | None needed. Do **not** set `NEXT_PUBLIC_E2E_WHATSAPP`; it is only for the Playwright test build. |

Open Graph image URLs use Vercel's system variable `VERCEL_PROJECT_PRODUCTION_URL` when "Automatically expose System Environment Variables" is on (the default). Otherwise they fall back to localhost, and the site itself still works.

I haven't deployed this to Vercel; the project needs to be connected from your Vercel account. After the first deploy, check:
- `/` redirects to `/en`
- `/ur` renders right-to-left
- an unknown URL shows the 404 page

## Project layout

```
Products/                      shop's product folders (source of truth)
scripts/sync-products.ts       products:sync / products:check
apps/storefront/
  src/app/[lang]/              pages (en, ur): home, shop, search, products, cart, checkout, order, about, contact
  src/data/                    products.json (generated), categories.json + overrides.json (owner-edited)
  src/config/store.ts          store settings (nulls until provided)
  src/i18n/                    en/ur dictionaries (from the approved design)
  src/styles/                  CSS ported from references/tariq-book-depot.html
  e2e/                         Playwright tests
references/tariq-book-depot.html   approved design
```
