# Implementation status

Updated: 2026-11-25

## Product catalog ingestion

- [x] Replaced the demo catalog with all 10 products documented under root `Products/`.
- [x] Copied and normalized all 36 product photos to `apps/storefront/public/products/`.
- [x] Added product-specific image galleries, exact supplied descriptions, explicit prices, and only source-supported specifications.
- [x] Added `/shop`, live category collections, predictive product search, and product detail metadata/schema.
- [ ] Medusa-backed catalog pricing and inventory remain unavailable until the backend is configured. Local catalog prices are not checkout-authoritative.

## Remediation sprint

- [ ] Node 22 runtime selected and verified.
- [ ] Docker Desktop and PostgreSQL health verified.
- [ ] Third-party skill clutter removed.
- [ ] Medusa backend configured, migrated, seeded, and smoke-tested.
- [ ] Storefront connected to live Medusa APIs.
- [ ] Live checkout Playwright verification passed.

## UI/UX redesign verification

- [x] Homepage product spotlight, live category counts, and full sourced catalog implemented.
- [x] `/books`, `/stationery`, `/collections/[handle]`, `/products/[handle]`, `/cart`, `/checkout`, `/about`, and `/orders/[id]/confirmed` routes created or redesigned.
- [x] Sticky global header, accessible 2D cart drawer, quantity controls, and 44px interaction targets added.
- [x] GSAP setup centralized in `src/lib/gsap.ts`; `useGSAP`, `gsap.matchMedia()`, ScrollTrigger, Flip, ScrollToPlugin, CustomEase, and SplitText integration included.
- [x] `npm run lint` passed with no warnings or errors.
- [x] `npm run typecheck` passed with `NODE_OPTIONS=--max-old-space-size=3072`.
- [x] `npm run build:storefront` passed and generated all storefront routes.
- [x] Browser smoke test returned HTTP 200 for `/`, `/books`, `/stationery`, `/about`, `/products/the-book-of-maps`, `/cart`, `/checkout`, `/collections/gift-bundles`, and `/orders/test/confirmed`.
- [x] Browser overflow audit passed at 375, 414, 640, 768, 1024, 1280, 1440, and 1920px.
- [x] Cart interaction test confirmed add-to-cart, open drawer, Escape close, and live cart quantity state.
- [ ] Live Medusa commerce, real prices/inventory, and real checkout confirmation remain blocked by Docker/PostgreSQL and backend setup prerequisites.

## Milestone 0 — foundation

- [x] Workspace layout and npm scripts created.
- [x] Environment template created without secrets.
- [x] PostgreSQL Docker Compose service defined.
- [x] Design-system documentation created.
- [ ] Medusa prerequisites verified: blocked; Medusa and PostgreSQL are not installed/running in this workspace.
- [ ] Real store assets, policies, contact details, and payment credentials supplied: blocked; not supplied.

## Milestone 1 — storefront foundation

- [x] Next.js App Router shell and locked tokens created.
- [x] Homepage, shop, books, stationery, category, product, cart, and checkout routes created.
- [x] Product catalog sourced from `Products/` and client cart behavior retained.
- [ ] Live Medusa pricing/inventory/cart checkout: blocked until backend is configured.

## Verification

- [x] `npm run typecheck` — passed.
- [x] `npm run lint` — passed with no warnings or errors.
- [x] `npm run build:storefront` — passed; routes generated: `/`, `/books`, `/stationery`, `/products/[handle]`, `/cart`, `/checkout`.
- [x] Runtime smoke test — `GET http://localhost:8000` returned HTTP 200.
- [ ] Backend/API/Playwright checkout verification — blocked until Medusa and an isolated PostgreSQL test service are configured.
- [ ] Runtime dependency audit — remaining transitive PostCSS issue reported by `npm audit --omit=dev`; requires a future dependency upgrade path beyond the current Next compatibility target.
