# AUDIT — Tariq Book Depot (Phase 0, read-only)

Date: 2026-11-28 · HEAD: `027409f` ("new products add") · Branch: `main` · Node v22.23.5 · npm 10.9.9

Nothing in the repo was changed in Phase 0 except creating this file.

---

## 1. Facts in the brief: confirmed or corrected

| # | Brief says | Finding | Status |
|---|---|---|---|
| 1 | Facts verified at `204abc9` | HEAD is now **`027409f`**, which adds 8 products (3 Geometry, 5 pens) and commits `references/tariq-book-depot.html` | **Corrected** |
| 2 | Next.js 15.5, React 19, TS, ESLint 8, `next lint`, `.eslintrc.json` | `next 15.5.29`, `react 19.0.0`, `typescript 5.7.2`, `eslint 8.57.1`, `eslint-config-next 15.5.29`, `.eslintrc.json` extends `next/core-web-vitals` | Confirmed |
| 3 | npm workspaces, Node 22 (`.nvmrc`) | Workspaces `apps/*`, `packages/*`; `.nvmrc` = `22`; `engines.node` = `>=22.0.0 <25.0.0`; local Node v22.23.5 | Confirmed |
| 4 | Tailwind, GSAP, Motion and zod not installed in the storefront | Tailwind, Motion and zod are absent. **`gsap ^3.15.1` and `@gsap/react ^2.1.2` are dependencies of the *root* package.json**, hoisted into `node_modules`; the storefront imports them without declaring them (`src/lib/gsap.ts`). `lucide-react 0.468.0` is also a storefront dependency. | **Corrected** |
| 5 | Medusa never built; `apps/backend/` is only a README | Confirmed: `apps/backend/README.md` is the only file | Confirmed |
| 6 | ~20 docs/pages refer to Medusa | **22 tracked files** (list in §3); also stale `.next/` build cache, which is ignored | Confirmed (22) |
| 7 | `Products/`: 10 products, 46 files | **18 products, 93 files (18 `.txt` + 75 `.jpeg`)** | **Corrected** |
| 8 | Most follow `<Category>/<Product>/`; `Blc` and `copymate` are flat | Confirmed. Category folders: `Erasers`, `Geometry`, `Pencils`, `pens`, `scales`, `Sharpners` (mixed case; "Sharpners" misspelt) | Confirmed |
| 9 | Each `.txt`: line 1 = title, description, optional `Features:` bullets, last line = price | **Holds for 9 of 18 only.** 7 files have no title line, 2 have a sentence as line 1, 4 have text after the price line, and the bullet headings vary (`Features:`, `Key Features:`, `Product Features:`, `Product Specifications:`). See §4. | **Corrected** |
| 10 | WhatsApp photos with spaces in names | Confirmed; all 75 are `.jpeg` (progressive JPEG, 188×268 to 1170×1240) | Confirmed |
| 11 | `public/products/` has 36 images from a manual import | Confirmed: 36 files under `erasers/ paper/ pencils/ scales/ sharpners/`, named `NN-product-image.jpeg` | Confirmed |
| 12 | `tsconfig.tsbuildinfo` committed although ignored | Confirmed (`git ls-files` lists it; `.gitignore` has `*.tsbuildinfo`) | Confirmed |
| 13 | HTML is the approved design | Confirmed: 1,744 lines, 1.36 MB. About 1.07 MB of that is a `window.IMG` map of 32 base64 WebP product images plus a base64 PNG favicon/logo. GSAP 3.15.1 + ScrollTrigger + Flip + SplitText are inlined. | Confirmed |

### Other findings

- **Line endings:** `core.autocrlf=true`. The `.txt` files are stored as LF in git (`i/lf`) and checked out as CRLF here (`w/crlf`). Vercel/Linux will see LF, so the parser must accept both.
- **Case:** `core.ignorecase=true`. Windows will not catch case-only path mismatches; only the Linux-style check in the DoD will.
- **Encoding:** UTF-8 without BOM. Titles use an en dash `–` (U+2013); Coco Bear uses `’` (U+2019).
- **Baseline checks (no files written):**
  - `npm run lint`: `✔ No ESLint warnings or errors`, but it also prints `` `next lint` is deprecated and will be removed in Next.js 16 `` (existing warning).
  - `npx tsc --noEmit --incremental false`: no errors.
  - I did not run `build` in Phase 0, because `next build` rewrites the tracked `tsconfig.tsbuildinfo`.
- **Root `test:e2e`** calls a storefront script that doesn't exist.
- **Root `dev:backend` / `build:backend`** point at the empty backend.

---

## 2. Top-level inventory: Keep / Delete / Rewrite

| Path | Verdict | Reason |
|---|---|---|
| `Products/` | **Keep** | Source of truth for the catalogue. Phase 1 adds `_TEMPLATE.txt`, which the sync must ignore (`_`-prefixed). |
| `references/tariq-book-depot.html` | **Keep** | The approved design. Read-only reference. |
| `references/frontend-nextjs.md` | **Delete** *(or Rewrite)* | Built around Medusa (§3) with a green/rust palette (`#1F3A2E`, `#B85D3B`) that conflicts with the HTML's navy, and asks for Three.js, which is out of scope. The alternative is to strip it to its a11y rules only. |
| `references/backend-medusa.md` | **Delete** | Medusa spec; no backend. |
| `apps/storefront/src/**` (21 files, 934 lines) | **Rewrite** | Built on `@tariq-book-depot/shared-types`, a hand-typed catalogue, Medusa copy and old routes (`/books`, `/stationery`, `/collections/[handle]`, `/products/[handle]`, `/orders/[id]/confirmed`). It will be replaced by the HTML port. |
| `apps/storefront/public/products/` (36 files) | **Delete → regenerated** | Replaced by the output of `products:sync`. Also uses the misspelt `sharpners/` path. |
| `apps/storefront/package.json` | **Rewrite** | Add gsap, @gsap/react, motion, zod, tailwind, tsx, @playwright/test. Drop shared-types and lucide-react (the HTML uses its own inline SVGs). Add a `test:e2e` script. |
| `apps/storefront/tsconfig.json`, `next.config.ts`, `next-env.d.ts`, `.eslintrc.json` | **Keep** (small edits) | Config is fine. `.eslintrc.json` depends on the lint decision in §6, item 9. |
| `apps/storefront/tsconfig.tsbuildinfo` | **Untrack** | It's a build artefact and is already ignored. |
| `apps/backend/` | **Delete** | README only. |
| `packages/shared-types/` | **Delete** | Replaced by zod-inferred types in the storefront. Remove `packages/*` from workspaces. |
| `package.json` (root) | **Rewrite** | Remove `dev:backend` and `build:backend`; move gsap deps into the storefront; add `products:sync`, `products:check`; fix `test:e2e`. |
| `package-lock.json` | **Keep** (regenerated) | Required for `npm ci`. |
| `.nvmrc` | **Keep** | `22`. |
| `.gitignore` | **Rewrite** (small) | Remove the duplicate `.next/`; add Playwright outputs (`test-results/`, `playwright-report/`). |
| `.env.example` | **Delete** | Only Medusa/Postgres variables. The new build needs no env vars. |
| `docker-compose.yml` | **Delete** | Postgres for Medusa. |
| `.github/copilot-instructions.md` | **Delete** | Medusa rules and the conflicting palette. `CLAUDE.md` replaces it. |
| `SKILL.md` (root) | **Delete** | Medusa + Three.js "skill"; superseded by `CLAUDE.md`. |
| `skills/` (~15.6 MB, 8 third-party repos) | **Delete** | Vendored agent skills, not project code. `IMPLEMENTATION_STATUS.md` already lists "Third-party skill clutter removed" as a to-do. |
| `design-system/` (3 files) | **Delete** | Medusa references and a palette that disagrees with the HTML. |
| `docs/` (8 stubs, 3–11 lines each) | **Delete** | Medusa / Postgres stubs. The new README covers setup and deployment. |
| `BUILD_PLAN.md`, `IMPLEMENTATION_STATUS.md` | **Delete** | Describe the Medusa plan; replaced by AUDIT, CLAUDE.md and README. |
| `README.md` | **Rewrite** | Medusa/Docker instructions; rewritten per the DoD in Phase 5. |
| `node_modules/`, `apps/storefront/.next/` | n/a | Ignored, local only. |

**New files planned:**
- Phase 1: `CLAUDE.md`, `Products/_TEMPLATE.txt`.
- Phase 2: `scripts/sync-products.ts`, `apps/storefront/src/data/{products,categories,overrides}.json`, `apps/storefront/src/config/store.ts`.
- `OPEN_QUESTIONS.md` and the Playwright tests come later.

---

## 3. Files that mention Medusa (22 tracked)

```
.env.example                          docs/ADMIN_GUIDE.md
.github/copilot-instructions.md       docs/API.md
apps/backend/README.md                docs/ARCHITECTURE.md
apps/storefront/src/app/about/page.tsx docs/DATABASE.md
apps/storefront/src/app/cart/page.tsx docs/LOCAL_DEVELOPMENT.md
apps/storefront/src/app/checkout/page.tsx docs/TESTING.md
apps/storefront/src/app/orders/[id]/confirmed/page.tsx IMPLEMENTATION_STATUS.md
apps/storefront/src/components/cart-drawer.tsx README.md
BUILD_PLAN.md                         references/backend-medusa.md
design-system/tariq-book-depot/pages/checkout.md references/frontend-nextjs.md
design-system/tariq-book-depot/pages/pdp.md SKILL.md
```

The Delete/Rewrite list in §2 covers all 22. After Phase 1, `grep -ri medusa` should find only `AUDIT.md` (this file), unless you choose to keep something.

---

## 4. Parse preview, one row per product folder

These rules are applied exactly as written in the brief, with no guessing:
- title = line 1
- name = title before the first ` – ` or ` | `
- price = last line
- brand = `Brand:` bullet, else the product folder name
- duplicate images are removed by content hash

| # | Folder | Line 1 (title) | Price line → value | Images (files → unique) | Result | Problems |
|---|---|---|---|---|---|---|
| 1 | `Blc` *(flat)* | BLC Paper Rim – 70 GSM \| 500 Sheets | `RS 1000` → 1000 | 2 → 2 | ✅ parses (needs alias `Blc → paper`) | No `Brand:` bullet → brand = folder name `"Blc"` (title says "BLC") |
| 2 | `copymate` *(flat)* | Copy Mate A4 Paper – 70 GSM (500 Sheets) | `RS 850` → 850 | 4 → 4 | ✅ parses (needs alias `copymate → paper`) | Heading is `Product Specifications:` |
| 3 | `Erasers/oro veezo` | Oro Veezo Eraser – 72 Pieces Jar | `rs 450` → 450 | 3 → 3 | ✅ | Lowercase `rs` |
| 4 | `Erasers/oro` | Oro Offyso Eraser – 48 Pieces Pack | `RS 480` → 480 | 3 → 3 | ✅ | — |
| 5 | `Geometry/Oro Coco Bear Geometry Box` | *(none; line 1 is a bullet)* | `RS 250` → 250 | 4 → 4 | ❌ **skip**: no title | Bullets only, no description |
| 6 | `Geometry/Oro Kelly Carlos` | *(none; line 1 is a bullet)* | `RS 150` → 150 | 4 → 4 | ❌ **skip**: no title | Bullets don't say what the product is |
| 7 | `Geometry/Oro La Bello Mirror Comb Geometry Box` | *(none; line 1 blank)* | `RS 380` → 380 | 4 → 4 | ❌ **skip**: no title | — |
| 8 | `Pencils/oro` | ORO Trimetal Lead Pencil – 12 Pcs Box | `RS 250` → 250 | 3 → 3 | ✅ | Heading `Key Features:`; trailing `Ideal For: …` is not a bullet, so it goes into the description |
| 9 | `Pencils/piano` | Piano Lead Pencils – 12 Pcs Box | `rs 250` → 250 | 4 → 4 | ✅ | id becomes `piano-lead-pencils` (the old site used `piano-lead-pencil`) |
| 10 | `pens/Oro GR-7 Gel Pen` | *(none; line 1 is a bullet)* | `RS 120 ` is **not** the last line; last line = `Available clrs blck blue green` | 5 → 5 | ❌ **skip**: no title, no price on the last line | One image is **byte-identical** to one in GT-5 (`…6.38.33 PM.jpeg`) |
| 11 | `pens/Oro GT-5 Gel Pen` | *(none; line 1 is a bullet)* | `RS 100` not last; last = `Available clrs blck blue` | 5 → 5 | ❌ **skip**: same as GR-7 | Shares that image with GR-7 |
| 12 | `pens/Oro Inventor Pen` | *(none; line 1 is a bullet)* | `RS 50 ` not last; last = `Available in four different clrs` | 7 → 7 | ❌ **skip**: same | Colours aren't named |
| 13 | `pens/Oro R-6 Gel Pen` | *(none; line 1 blank)* | `RS 80 ` not last; last = `Available in blck blue red green` | 5 → 5 | ❌ **skip**: same | — |
| 14 | `pens/Oro TX-7 Gel Pen` | Oro TX-7 Gel Pen | `RS 150` → 150 | 5 → 5 | ✅ | No description paragraph; no `Brand:` → brand = folder name `"Oro TX-7 Gel Pen"` (wrong) |
| 15 | `scales/dux` | *"Dux 12-Inch Scale is a high-quality and durable measuring ruler, perfect for …"* (a whole sentence) | `RS 80` → 80 | 2 → 2 | ⚠️ parses but **title and id are the whole sentence** | Known question: priced Rs 80 but the photos show a 24-piece pack. Brand = `"dux"` (folder) |
| 16 | `scales/oro` | *"Oro 8-Inch Scale is a durable and lightweight measuring ruler, …"* (a sentence) | `Rs 50 per pcs` → 50, priceNote `per pcs` | 4 → **3** (1 duplicate) | ⚠️ parses but **title and id are the whole sentence** | Brand = `"oro"` (folder) |
| 17 | `Sharpners/Dux` | Dux Colour Sharpener – 50 Pieces Box | `Rs 500` → 500 | 6 → **3** (3 duplicates) | ✅ | Folder needs alias `Sharpners → sharpeners` |
| 18 | `Sharpners/oro` | Oro Reeko Sharpener – 50 Pieces Jar | `RS 500` → 500 | 5 → 5 | ✅ | — |

**Totals under the current rules:**
- 11 products parse (2 of them with sentence titles).
- 7 are skipped: 3 Geometry and 4 pens.
- 75 image files become 71 unique per product. One more image is duplicated *across* GR-7 and GT-5.

**New categories the sync would add** (ur = null, department = null; shown under All products until you assign one):
- `geometry` (Geometry): 0 products parse today
- `pens` (Pens): 1 product (TX-7)

**Parser notes:**
- Bullet lines are `* ` (asterisk + space).
- Any line ending in `:` that sits before bullets is a heading and is dropped.
- `* Key: Value` → spec. Otherwise the bullet is a feature.
- `Brand:` is taken out of specs and into `brand`.
- Some bullets end with `.` and some don't; they are kept verbatim.

---

## 5. Where the HTML and the brief's contract disagree

1. **Units.** The HTML shows "Rs 450 per jar", "per box", "per ream" (with Urdu) from a hand-set `unit` field. The contract only allows `priceNote` from the price line, which gives `per pcs` for the Oro 8-inch scale alone. Following the contract means the other prices show without a unit.
2. **Departments.** The HTML puts Paper in **two** departments (`paper` and `office`). `categories.json` allows a single `department` per category.
3. **Spec labels.** The HTML translates labels into Urdu (`SPEC` dictionary) and shortens values ("Triangular, ergonomic"). The contract keeps the `.txt` wording verbatim. In Urdu pages, the English product data sits in LTR-isolated spans, as the brief says.
4. **Image order and cover.** The HTML hand-picks the cover image (e.g. Offyso uses photo 03 first; Reeko uses 02). The sync will order images by file name. `overrides.json` has no field for image order.
5. **"Since 1984".** The hero, brand line, About page and Urdu strings all say *"Pattoki … since 1984"*. Your known open questions don't include this. If it isn't confirmed, it counts as invented data.
6. **Routing.** The HTML uses hash routes. Proposed App Router mapping:

   | HTML hash route | Next.js route |
   |---|---|
   | `#/` | `/` |
   | `#/shop/<dept>?cat=&brand=&sort=` | `/shop` and `/shop/[dept]`, with query params for cat, brand and sort |
   | `#/search?q=` | `/search?q=` |
   | `#/product/<id>` | `/products/[id]` |
   | `#/cart` | `/cart` |
   | `#/checkout` | `/checkout` |
   | `#/order/<ref>` | `/order` (client-only, reads sessionStorage) |
   | `#/about` | `/about` |
   | `#/contact` | `/contact` |

7. **Order reference.** The HTML uses `TB-YYMMDD-NNNN` with `Math.random()`. I'll keep that format.
8. **Motion.** The HTML uses GSAP Flip for the filter reflow. Per the brief, that becomes Motion `layout`; GSAP is kept for the hero and the shelf.

---

## 6. Decisions I need from you before Phase 1

1. **Deletions:** approve the Delete list in §2? In particular `skills/` (15.6 MB), `design-system/`, `docs/`, `.github/copilot-instructions.md`, `SKILL.md` and both `references/*.md`.
2. **The 7 untitled products** (Geometry ×3, pens GR-7/GT-5/Inventor/R-6). Options:
   - (a) you add a title line to each `.txt` and move the colours line above the price; or
   - (b) the sync falls back to the **product folder name** as the title when line 1 is a bullet or blank, and reports it.

   *Recommend (b): the folder names are your own wording.*
3. **Colour lines** such as `Available clrs blck blue green`. Options:
   - (a) keep the line verbatim in the description;
   - (b) turn it into a `Colours` spec; or
   - (c) treat colours as a customer choice in the cart and WhatsApp message. This is new scope.

   *Recommend (a), and price = the last line that matches the price pattern.*
4. **Sentence titles** (`scales/dux`, `scales/oro`): should you add a short title line, or should the sync use the folder name as in item 2?
5. **Brand fallback:** the folder name gives `"Blc"`, `"dux"`, `"oro"`, `"Oro TX-7 Gel Pen"`. *Recommend:* use the `Brand:` bullet, else `null`, plus an OPEN_QUESTIONS entry; or you add `* Brand:` lines.
6. **GR-7 / GT-5 shared photo:** is that photo in the wrong folder?
7. **Units and departments** (§5.1, §5.2):
   - Can `overrides.json` carry `unit`, and can `categories.json` take `department` as an array?
   - Or stick to one department per category and no units?
8. **"Since 1984"**: is it true? If not, I'll remove it and log an OPEN_QUESTIONS entry.
9. **`next lint` deprecation warning:**
   - (a) leave it as an existing warning; or
   - (b) migrate to the ESLint CLI in Phase 1. That needs checking whether `eslint-config-next 15.5` works with ESLint 8 or needs 9.
10. **Image order:** add an optional `images` order and cover field to `overrides.json`, or accept file-name order?
11. **Phase 2 exit** says "all 10 products". Change it to "every parseable product, with skips reported", now that there are 18?

---

## 7. Deployment risks

- **Monorepo on Vercel.** Root Directory `apps/storefront` with a root lockfile and npm workspaces. The install and build commands, and the "include files outside root" setting, must be checked against current Vercel docs in Phase 5.
- **Case sensitivity.** Windows (`ignorecase=true`) hides path-case bugs that break on Linux. The sync writes only lowercase kebab-case paths, and the DoD's case-sensitive check guards against this.
- **CRLF vs LF.** The parser must normalise line endings, or `products:check` will give different results on Windows and Linux.
- **Image optimisation.** 71 JPEGs going through `next/image` count against Vercel image optimisation quotas. I'll review sizes and quotas in Phase 5.
- **Urdu font weight.** Noto Nastaliq Urdu through `next/font` is large. Load it only for `lang="ur"` (preload off) and verify it's in the `next/font/google` list.
- **Dependency versions.** Tailwind v4, Motion, zod 4, `@gsap/react` and Playwright are new. Each needs its version and API checked before use (non-negotiable 4).
- **Checkout without settings.** With no WhatsApp number and no delivery prices, checkout can't be completed. That's correct behaviour, but it means the e2e test needs a test-only store config, injected without env vars at build time. This needs a design decision in Phase 3.
- **Hydration.** Cart (localStorage), language toggle and order confirmation (sessionStorage) are client-only state. They must render a stable server fallback to avoid hydration errors, which the DoD checks.
- **`next lint`** goes away in Next 16. This isn't blocking on 15.5.

⛔ **STOP.** Waiting for your approved list (§6) before Phase 1.

---

## 8. Decisions (owner, 2026-11-28)

- All deletions in §2 approved. The recommendations in §6 were adopted as follows:

| # | Decision |
|---|---|
| 1 | All listed paths deleted |
| 2 | Folder name is used as the title when line 1 is blank or a bullet, and reported |
| 3 | Colour lines are kept verbatim in the description; price = last line matching the price pattern |
| 4 | Sentence titles (`scales/dux`, `scales/oro`) use the folder name, same as item 2 |
| 5 | Brand = `Brand:` bullet, else `null`, plus an OPEN_QUESTIONS entry |
| 6 | GR-7 / GT-5 shared photo: kept in both, duplicate reported, logged as an open question |
| 7 | `categories.json` uses `departments: []` (array); `overrides.json` gets an optional `unit`, default unset, so nothing is shown |
| 8 | "Since 1984" is unconfirmed, so it is removed from copy and logged as an open question |
| 9 | The `next lint` deprecation warning is left as an existing warning for now |
| 10 | `overrides.json` gets an optional `imageOrder`; default is file-name order |
| 11 | Phase 2 exit = every parseable product, with skips reported |
