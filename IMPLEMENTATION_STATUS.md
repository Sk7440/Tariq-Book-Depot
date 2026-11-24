# Implementation status

Updated: 2026-11-24

## Remediation sprint

- [ ] Node 22 runtime selected and verified.
- [ ] Docker Desktop and PostgreSQL health verified.
- [ ] Third-party skill clutter removed.
- [ ] Medusa backend configured, migrated, seeded, and smoke-tested.
- [ ] Storefront connected to live Medusa APIs.
- [ ] Live checkout Playwright verification passed.

## Milestone 0 — foundation

- [x] Workspace layout and npm scripts created.
- [x] Environment template created without secrets.
- [x] PostgreSQL Docker Compose service defined.
- [x] Design-system documentation created.
- [ ] Medusa prerequisites verified: blocked; Medusa and PostgreSQL are not installed/running in this workspace.
- [ ] Real store assets, policies, contact details, and payment credentials supplied: blocked; not supplied.

## Milestone 1 — storefront foundation

- [x] Next.js App Router shell and locked tokens created.
- [x] Homepage, books, stationery, product, cart, and checkout routes created.
- [x] Accessible demo catalog and client cart behavior created.
- [ ] Live Medusa pricing/inventory/cart checkout: blocked until backend is configured.

## Verification

- [x] `npm run typecheck` — passed.
- [x] `npm run lint` — passed with no warnings or errors.
- [x] `npm run build:storefront` — passed; routes generated: `/`, `/books`, `/stationery`, `/products/[handle]`, `/cart`, `/checkout`.
- [x] Runtime smoke test — `GET http://localhost:8000` returned HTTP 200.
- [ ] Backend/API/Playwright checkout verification — blocked until Medusa and an isolated PostgreSQL test service are configured.
- [ ] Runtime dependency audit — remaining transitive PostCSS issue reported by `npm audit --omit=dev`; requires a future dependency upgrade path beyond the current Next compatibility target.
