---
name: tariq-book-depot
description: End-to-end architecture, anti-AI-slop UI/UX design, Next.js storefront, and Medusa.js v2 backend skill for building the Tariq Book Depot books and stationery e-commerce website. Use when designing, scaffolding, coding, styling, animating, or auditing any part of Tariq Book Depot, including Next.js App Router pages, Three.js 3D hero showcases, GSAP animations, Medusa v2 modules/workflows/APIs, bilingual English/Urdu RTL layouts, or full-stack checkout flows.
---

# Tariq Book Depot

Build and maintain **Tariq Book Depot**, a complete full-stack books and stationery e-commerce platform with a **Next.js (App Router)** frontend and a **Medusa.js v2** backend, designed with authentic editorial bookstore craft that never looks AI-generated.

This skill separates frontend and backend engineering into two dedicated reference files so coding agents keep presentation and commerce state strictly decoupled:

- Frontend specification (Next.js, editorial design system, anti-AI-slop gates, Three.js 3D, GSAP): read `references/frontend-nextjs.md`
- Backend specification (Medusa.js v2, PostgreSQL, books/stationery data models, workflows, PKR regions, checkout APIs): read `references/backend-medusa.md`

## When to Use

- Scaffolding the Tariq Book Depot monorepo (`apps/storefront` + `apps/backend`)
- Designing or implementing Next.js storefront pages, product cards, predictive search, cart drawers, or checkout flows
- Adding tactile Three.js 3D showcases or 5-pillar GSAP animations without sacrificing conversion or mobile performance
- Modeling books (ISBN, author, publisher, binding, edition, language) and stationery (paper GSM, ruling, nib size, ink color) in Medusa.js v2
- Auditing or redesigning existing pages to remove AI UI clichés, enforce WCAG 2.2 accessibility, and verify bilingual English/Urdu RTL readiness

## Architecture Principles

Keep responsibilities clean across the monorepo:

```text
tariq-book-depot/
├── design-system/
│   └── tariq-book-depot/
│       ├── MASTER.md              # Locked visual tokens and anti-slop rules
│       └── pages/
│           ├── pdp.md             # Book & stationery detail overrides
│           └── checkout.md        # Frictionless 2D checkout overrides
├── apps/
│   ├── backend/                   # Medusa.js v2 server + Admin dashboard (:9000)
│   └── storefront/                # Next.js App Router storefront (:8000)
└── packages/
    └── shared-types/              # Shared TypeScript DTOs for book/stationery metadata
```

- **Medusa owns commerce truth**: Never calculate authoritative prices, discounts, shipping rates, tax, or inventory on the Next.js client. Always render Medusa Store API responses.
- **Next.js owns editorial craft**: Use React Server Components for SEO-friendly catalog and book detail pages, Server Actions for cart mutations (`cart_id` in HttpOnly cookies), and isolated Client Components for 3D/GSAP interactions.
- **Spec first, code second**: Lock `design-system/tariq-book-depot/MASTER.md` and CSS tokens before building pages so every route shares one cohesive ink-and-paper identity.
- **Hybrid 2D commerce + targeted 3D**: Keep search, filtering, product grids, cart drawer, and checkout 100% 2D and fast. Reserve Three.js 3D strictly for hero pedestal spotlights and optional product preview modals.

## End-to-End Execution Workflow

Follow these phases in order when building or extending the store.

### Phase 1: Pre-Flight Grounding and Monorepo Setup

1. Verify prerequisites: Node.js v22.22.0+ LTS (< v25), PostgreSQL 15+, and Git CLI.
2. Scaffold the monorepo with Medusa v2 and Next.js (`npx create-medusa-app@latest tariq-book-depot --with-nextjs-starter`) or inspect the existing `apps/backend` and `apps/storefront` directories.
3. Ask the user once for real store assets (real book/stationery photography, actual store policies, Lahore/Pakistan shipping rates, real contact details). Never fabricate testimonials, fake reader counts (such as "500k+ Readers"), or dummy forms that pretend to submit.
4. Create `design-system/tariq-book-depot/MASTER.md` and `apps/storefront/src/styles/tokens.css` using the exact palette and typography in `references/frontend-nextjs.md`.

### Phase 2: Backend Foundation (Medusa.js v2)

Read `references/backend-medusa.md` before writing backend code.

1. Configure `medusa-config.ts` with PostgreSQL, CORS (`STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`), and payment/fulfillment providers (Cash on Delivery via manual provider + card gateway such as Stripe or local Pakistani gateway).
2. Create custom Medusa v2 modules and links for `book_metadata` (ISBN-13, author, publisher, binding, page count, edition, language) and `stationery_spec` (brand, paper GSM, ruling, nib size, ink color, pack quantity).
3. Seed realistic Tariq Book Depot categories (Fiction, Non-Fiction, Academic & Textbooks, Urdu Literature, Notebooks & Journals, Pens & Ink, Art Supplies, Gift Bundles), stock locations, PKR region, shipping options, and publishable API keys.
4. Expose custom Store API routes for predictive search (title, author, ISBN, SKU, brand) and faceted filtering.

### Phase 3: Hero-First Frontend Build (Next.js App Router)

Read `references/frontend-nextjs.md` before writing UI code.

1. **Build and cold-review the Hero alone first**: Implement the header (with always-visible predictive search bar) and the editorial stone-pedestal / book-shelf hero with a linked quick-buy card wired to live Medusa product data. Verify layout, lighting, typography, and mobile fallback before building downstream sections.
2. **Build core shopping routes**:
   - Homepage: Hero showcase, physical trust bar (Fast Nationwide Delivery, Original Editions, Gift-Ready Packaging, Easy Returns), arched category strip, 3-card curated bundle spotlight, scannable Best Sellers grid, and editorial sale banner.
   - Catalog & Category Pages (`/books`, `/stationery`, `/collections/[handle]`): Instant faceted filters (binding, author, language, GSM, nib size, price in PKR) with GSAP `Flip` layout transitions.
   - Product Detail Page (`/products/[handle]`): `stripe-press` inspired book layout (cover/3D flip preview, Look Inside modal, ISBN/edition spec table) and `muji-kenya-hara` inspired stationery layout (live color/ink swatches, GSM/nib specs, bundle upsells).
   - Slide-Out Cart Drawer & 2D Checkout (`/checkout`): Server Action cart updates, cross-sell add-ons (bookmarks, highlighters), address/shipping selection, payment session init, and verified `response.type === "order"` completion.

### Phase 4: Tactile Motion and 3D Polish

1. Layer Three.js (`@react-three/fiber` + `@react-three/drei`) only on the hero turntable/shelf and opt-in 3D preview modals with 1K-2K `.GLB` textures, ACES Filmic tone mapping, warm directional lighting, and a static high-res image fallback for mobile/low-power devices.
2. Add restrained 5-pillar GSAP choreography (Core, Scroll, SVG, UI, Text) wrapped inside `gsap.matchMedia()` so `prefers-reduced-motion: reduce` degrades cleanly to instant opacity fades.

### Phase 5: Anti-AI-Slop QA and Verification

Run all checks before declaring any feature done:

1. **Floor Gates (Hard Blockers - Never Ship If Failing)**:
   - Contrast >= 4.5:1 for body text and >= 3:1 for large text/UI controls
   - Visible keyboard focus rings and WCAG 2.2 compliance across header, filters, drawers, and checkout
   - `prefers-reduced-motion` disables scroll scrubbing, SVG drawing, and 3D auto-rotation
   - Zero invented metrics, zero broken images, zero unsubmitted fake forms
   - Zero horizontal overflow across 8 viewport widths (`375px`, `414px`, `640px`, `768px`, `1024px`, `1280px`, `1440px`, `1920px`)
   - Logical CSS properties (`ms-*`, `me-*`, `ps-*`, `pe-*`) so Urdu RTL sections mirror cleanly
2. **Reflex Gates (Anti-AI-Slop Checks)**:
   - No uppercase tracked eyebrow pills above every section heading
   - No single colored/gradient word gimmick inside headlines
   - No neon/purple AI gradients or glassmorphism soup
   - No emojis used as UI icons (use clean SVG icons like Lucide)
   - No mandatory newsletter popup or footer spam bar tacked onto checkout/product pages
3. **End-to-End Smoke Verification**:
   - Verify Medusa backend health (`GET /health`), Publishable API key header, product listing with `*variants.calculated_price`, cart creation, line-item add/update, shipping method selection, and order confirmation (`type === "order"`).

## Gotchas

- **Never put business logic in Next.js Client Components**: Cart totals, tax, and inventory checks must come from Medusa Store API via Server Actions or typed SDK calls.
- **Never wrap the cart drawer or checkout in GSAP `ScrollSmoother`**: Smooth-scroll wrappers break native touch scrolling, sticky buttons, and mobile form focus.
- **Never mix book and stationery card layouts blindly**: Book cards need author, binding type, and optional Look Inside preview; stationery cards need ink/color swatches, ruling/GSM, or nib specs directly scannable.
- **Never skip ACES Filmic tone mapping on `.GLB` scenes**: Uncalibrated Three.js scenes render book covers muddy and dark against warm archival cream backgrounds.
- **Never mutate cart items inside Medusa's `completeCartWorkflow` validate hook**: Mutate and refresh payment collections before calling complete cart so payment totals stay synced.
