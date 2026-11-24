# Tariq Book Depot - Frontend Engineering & Anti-AI-Slop Specification (Next.js App Router)

Use this specification whenever designing, scaffolding, styling, animating, or auditing `apps/storefront` in **Next.js (App Router + TypeScript + Tailwind CSS)** for **Tariq Book Depot**. Next.js owns presentation, SEO, tactile 3D/GSAP craft, and frictionless shopping UX; Medusa.js v2 owns all commerce state.

## 1. Visual Identity & Editorial Direction (Never AI-Generated)

Synthesize three editorial design schools into one authentic bookstore and stationery aesthetic:

- **Primary Editorial Backbone (`stripe-press` + Bookly layout)**: Generous archival paper whitespace, sculptural stone-pedestal or display-shelf focal points, crisp literary typography, and calm hierarchy that lets physical book covers carry color.
- **Stationery Catalog Precision (`muji-kenya-hara`)**: Honest tactile object presentation for pens, notebooks, and art supplies with scannable specs (paper GSM, ruling, nib size, pack quantity) and live ink/cover color swatches.
- **Commerce Conversion Density (Pixelora structure)**: Always-visible predictive search in the header, physical delivery trust signals, scannable Best Sellers grid, and fast 2D checkout.

### Locked Design Tokens (`apps/storefront/src/styles/tokens.css`)

Lock these tokens into `design-system/tariq-book-depot/MASTER.md` and `:root` before writing any page component:

```css
:root {
  /* Archival Paper Surfaces */
  --surface-paper: #FAF8F5;
  --surface-linen: #F3EFE8;
  --surface-card: #FFFFFF;
  --surface-stone: #E7E1D6;

  /* Ink Typography & Borders */
  --ink-primary: #1C1C1E;
  --ink-secondary: #4A4A4F;
  --ink-muted: #6E6E73;
  --border-hairline: #E2DDD3;
  --border-strong: #C9C1B4;

  /* Brand & Tactile Accents */
  --accent-forest: #1F3A2E;      /* Primary CTA, editorial sale banners */
  --accent-forest-hover: #162B22;
  --accent-terracotta: #B85D3B;  /* Subtle highlight, discount badge, active bookmark */
  --accent-indigo: #2B3E63;      /* Fountain-pen ink accent for stationery states */

  /* Semantic States */
  --status-success: #245A3D;
  --status-warning: #9A5B13;
  --status-danger: #A62B2B;

  /* Radii & Elevation */
  --radius-card: 12px;
  --radius-pill: 9999px;
  --radius-input: 8px;
  --shadow-paper: 0 1px 2px rgba(28, 28, 30, 0.05), 0 8px 24px rgba(28, 28, 30, 0.06);
  --shadow-floating: 0 12px 32px rgba(28, 28, 30, 0.10);
}
```

### Typography System (English LTR + Urdu RTL Ready)

- **Display & Book Titles**: Editorial serif (`Newsreader` or `Cormorant Garamond` via `next/font/google`), tight display tracking (`-0.02em`), generous line-height (`1.12` for H1, `1.25` for H2).
- **UI, Specs, Prices & Filters**: Clean humanist/geometric sans (`Plus Jakarta Sans` or `Inter`), `font-variant-numeric: tabular-nums` on all PKR prices, stock counts, and ISBN numbers so columns align cleanly.
- **Urdu Literature Support**: Load `Noto Nastaliq Urdu` (or `Gulzar`) strictly scoped to `[lang="ur"]` or `.font-urdu` elements with increased line-height (`2.1`) so Nastaliq ascenders/descenders never clip.
- **Logical CSS Properties Only**: Use `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, and `text-start` instead of left/right utilities so Urdu RTL views mirror cleanly without broken alignment.

## 2. Anti-AI-Slop Rules (Hallmark + Craft Gates)

Apply these rules strictly on every page and component.

### Floor Gates (Hard Blockers - Never Ship If Violated)

- **Contrast**: Body text >= `4.5:1`; large headings, icons, and input borders >= `3:1`.
- **Keyboard & WCAG 2.2**: Every interactive filter chip, swatch, search result, modal, and cart button must use native `<button>` or `<a>` semantics, visible `:focus-visible` ring (`2px solid var(--accent-forest)` with `2px` offset), and full Escape/Tab trapping in drawers.
- **Honest Store Content**: Zero fabricated numbers (never invent "500k+ Happy Readers", fake 5-star counts, or placeholder reviews). Every form (search, newsletter, checkout, contact) must wire to a real backend endpoint or be omitted.
- **Resilient Text & Compact UI**: Headings must wrap naturally across widths without relying on manual `<br>` hacks; category chips and spec badges must wrap or use an accessible `+n` disclosure rather than clipping; badges must never convey status by color alone.
- **Responsive Across 8 Widths**: Verify zero horizontal overflow and clean touch targets (`>= 44x44px`) at `375px`, `414px`, `640px`, `768px`, `1024px`, `1280px`, `1440px`, and `1920px`.
- **Reduced Motion**: Wrap all GSAP timelines and Three.js rotation inside `prefers-reduced-motion: reduce` checks so reduced-motion users get immediate, calm states.

### Reflex Gates (Eliminate Machine-Made Tells)

- Never place a tracked-uppercase eyebrow pill (`NEW COLLECTION`, `TRENDING NOW`, `EXPLORE CATEGORIES`) above every single section heading. Use direct, confident editorial headings and keep eyebrows rare (at most 1 per page).
- Never highlight a single word inside a headline with a neon gradient or different color as a decorative gimmick.
- Never use emojis as UI icons; use crisp stroke-consistent SVG icons (`lucide-react` or `@phosphor-icons/react`) with `aria-hidden="true"` on decorative icons and `aria-label` on icon-only buttons.
- Never apply dark-mode neon gradients, glassmorphism blur soup, or generic SaaS bento grids to a physical bookstore.
- Never tack a redundant newsletter bar onto product detail pages, cart drawers, or checkout pages.

## 3. Next.js App Router Architecture & Medusa Integration

Keep storefront files cleanly organized under `apps/storefront/src/`:

```text
apps/storefront/src/
├── app/
│   ├── layout.tsx                   # Fonts, metadata, header, cart drawer provider
│   ├── page.tsx                     # Editorial homepage (RSC)
│   ├── books/page.tsx               # Book catalog with faceted filters
│   ├── stationery/page.tsx          # Stationery catalog with GSM/nib/color filters
│   ├── collections/[handle]/page.tsx
│   ├── products/[handle]/page.tsx   # Hybrid book/stationery PDP
│   ├── checkout/page.tsx            # Strict 2D 5-step Medusa checkout
│   └── orders/[id]/confirmed/page.tsx
├── lib/
│   ├── medusa-sdk.ts                # Single @medusajs/js-sdk client instance
│   ├── actions/
│   │   ├── cart.ts                  # "use server" cart mutations + HttpOnly cart_id cookie
│   │   └── checkout.ts              # "use server" address, shipping, payment, completeCart
│   └── data/
│       ├── products.ts              # RSC cached fetchers with next: { tags: [...] }
│       └── regions.ts               # Default PK / PKR region resolver
├── components/
│   ├── layout/                      # Header with predictive search, Footer, CartDrawer
│   ├── hero/                        # HeroSection + dynamic client Three.js pedestal/shelf
│   ├── catalog/                     # BookCard, StationeryCard, FacetedFilterBar
│   ├── pdp/                         # BookPdpLayout, StationeryPdpLayout, LookInsideModal
│   └── motion/                      # GsapProvider, DrawInkArrow, FlipGridWrapper
└── styles/
    └── tokens.css                   # Master ink-and-paper CSS variables
```

### Core Next.js + Medusa Coding Rules

1. **Single Typed SDK Client (`src/lib/medusa-sdk.ts`)**:

```ts
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!,
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
})
```

2. **Server Components for Reads, Server Actions for Writes**:
   - Fetch products, collections, and regions in Server Components with explicit cache tags (`next: { tags: ["products", "product-" + handle] }`) and revalidate via Medusa webhook or `revalidateTag()`.
   - Run all cart mutations (`createCart`, `addToCart`, `updateLineItem`, `removeLineItem`, `applyPromo`) inside `"use server"` actions that store `cart_id` in an `HttpOnly`, `SameSite=Lax` cookie and always render the authoritative Medusa cart response (never compute totals in client state).
3. **Always-Visible Predictive Search**:
   - Keep a visible search input in the top header (never hidden behind an icon on desktop).
   - Debounce queries (`200ms`) against `GET /store/catalog/search` and display split suggestions: Books (cover, title, author, ISBN, PKR price) and Stationery (thumbnail, brand, spec, swatches, PKR price). Handle IME composition safely (`!event.nativeEvent.isComposing`) for Urdu/multilingual input.

## 4. Page & Component Anatomy

### Hero Section (Build & Cold-Review First)

- **Layout**: Left column carries crisp serif headline, concise store value proposition, primary CTA (`Browse Books`), and secondary CTA (`Shop Stationery`). Right column showcases an interactive stone-pedestal / standing-book-shelf stage linked to a live quick-buy card showing the currently selected item's title, author/brand, PKR price, and working `Add to Cart` Server Action.
- **Physical Trust Strip**: Directly beneath the hero, render 4 honest physical bookstore signals in a clean hairline bar: Nationwide Pakistan Delivery, Original Editions, Protective Gift Packaging, and Cash on Delivery Available.

### Product Cards (Category-Specific, Never One-Size-Fits-All)

- **Book Card (`BookCard.tsx`)**: Vertical `2:3` book-cover ratio on `--surface-linen` frame, subtle book-spine edge shadow, title (max 2 lines with full title accessible), author name, binding pill (`Hardcover` / `Paperback`), PKR price in `tabular-nums`, and fast `Add to Cart` button.
- **Stationery Card (`StationeryCard.tsx`)**: Square `1:1` flat-lay frame, brand + product name, live interactive ink/cover color swatch dots (switching active Medusa variant & image), concise spec line (`120 GSM | Dotted | A5` or `0.5mm Gel`), PKR price, and `Add to Cart`.

### Slide-Out Cart Drawer & 2D Checkout

- Keep cart drawer and `/checkout` 100% 2D with zero WebGL or smooth-scroll hijacking.
- Include a compact 2-item cross-sell strip inside the cart drawer (fed by `/store/products/[handle]/bundle-suggestions`, e.g., brass bookmark or pastel highlighter pack).
- Preserve all checkout form inputs on validation or payment error; never reset state on failure; explicitly verify `response.type === "order"` from `sdk.store.cart.complete(cartId)` before clearing the cart cookie.

## 5. Targeted 3D Showcase Rules (Three.js / MotionSites Pattern)

Keep 3D purposeful, fast, and isolated so it elevates physical paper craft without hurting conversion:

- **Where 3D Is Allowed**: Only in the Homepage Hero (`HeroPedestal3D.tsx`, inspired by `Shelf Hero`) and an opt-in `"Inspect in 3D"` modal on flagship books, leather notebooks, and gift bundles.
- **Dynamic Import Only**: Load Three.js (`@react-three/fiber`, `@react-three/drei`) via `next/dynamic(..., { ssr: false })` with a high-resolution static studio photograph as the immediate SSR placeholder and permanent fallback on mobile/low-power devices (`navigator.hardwareConcurrency <= 4` or `prefers-reduced-motion`).
- **Asset Budget & Lighting Calibration**:
  - Limit hero `.GLB` assets to 3-4 flagship items with Draco compression and `1K-2K` textures (`<= 1.5 MB` total hero 3D payload).
  - Explicitly enable `THREE.ACESFilmicToneMapping` (`toneMappingExposure = 1.05`) and warm studio directional + hemisphere lighting (`#FFF8EE` key light, `#E7E1D6` ground bounce) so paper textures and covers match the daylight cream background instead of rendering dark or muddy.
  - Clicking or hovering a book spine on the 3D shelf slides it forward smoothly and syncs the adjacent floating Quick-Buy card to that Medusa variant.

## 6. Five-Pillar GSAP Motion Spec (Tactile Ink & Paper)

Install `gsap` and `@gsap/react` and register plugins once inside a client utility (`src/lib/gsap.ts`). Wrap every timeline in `useGSAP` + `gsap.matchMedia()` so reduced-motion users receive clean instant reveals.

- **Core (`gsap`, `CustomEase`, `useGSAP`)**: Register a weighted `"paperSettle"` ease (`CustomEase.create("paperSettle", "0.22, 1, 0.36, 1")`) and cap UI micro-transitions to `160ms-280ms` so rapid clicks cancel cleanly without leaving stale semantic state.
- **Scroll (`ScrollTrigger`, `ScrollToPlugin`)**: Scrub subtle rotation of the hero 3D pedestal or stacked books near the testimonial/editorial band (`scrub: 0.6`). Do not enable `ScrollSmoother` on touch devices, cart drawers, or checkout routes.
- **SVG (`DrawSVGPlugin`, `MorphSVGPlugin`, `MotionPathPlugin`)**: Animate a single handwritten editorial arrow or ink underline on load (`DrawSVG`, `0.55s`), morph the wishlist heart and Add-to-Cart checkmark (`MorphSVG`, `0.2s`), and optionally arc a minimal ink-dot badge to the header cart icon (`MotionPath`, `0.45s`).
- **UI (`Flip`, `Draggable`, `InertiaPlugin`)**: Animate catalog filter changes between Books, Notebooks, Pens, and Art Supplies smoothly with `Flip`; make horizontal category/bestseller shelves flickable on desktop/touch with `Draggable` + `InertiaPlugin`.
- **Text (`SplitText`, `TextPlugin`)**: Mask-reveal the hero H1 line-by-line on initial paint (`SplitText`, `0.6s`, GPU `yPercent` + `opacity` only). Reserve `ScrambleText` strictly for numeric discount tags or ISBN hover micro-details, never on readable book titles.

## 7. Pre-Ship Frontend Verification Checklist

Before declaring any frontend milestone complete, run and verify:

```bash
# Typecheck, lint, and production build inside apps/storefront
cd apps/storefront
npm run typecheck
npm run lint
npm run build
```

Then inspect in a real headless or local browser across all 8 widths (`375px` to `1920px`):

- Hero fits cleanly above the fold on desktop (`1440x900`) and mobile (`375x812`) with zero layout shift (CLS < `0.1`).
- Predictive search returns live Medusa results for book title, author, ISBN, and stationery brand.
- Swatch click on a stationery card updates the variant image and adds the exact selected Medusa `variant_id` to cart.
- Keyboard-only walkthrough reaches search, category filter, product card, Add to Cart, cart drawer quantity controls, and checkout submit without focus traps.
- Emulating `prefers-reduced-motion: reduce` disables GSAP scrubbing, SVG drawing, and Three.js auto-rotation while keeping all interactive states functional.
