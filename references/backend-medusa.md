# Tariq Book Depot - Backend Engineering Specification (Medusa.js v2)

Use this specification whenever scaffolding, extending, seeding, or integrating `apps/backend` with **Medusa.js v2** for **Tariq Book Depot**. Medusa owns all commerce state: catalog, inventory, regional pricing, carts, promotions, payments, customers, and orders.

## 1. Prerequisites and Monorepo Setup

- **Runtime**: Node.js v22.22.0+ LTS (strictly `< v25`), PostgreSQL 15+, Redis (recommended for production event bus & cache)
- **Scaffold Command**:

```bash
npx create-medusa-app@latest tariq-book-depot --with-nextjs-starter
```

This creates a monorepo with:
- `apps/backend` running the Medusa v2 API + Admin Dashboard at `http://localhost:9000/app`
- `apps/storefront` running Next.js at `http://localhost:8000`

### Required Environment Variables

`apps/backend/.env`:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/tariq_book_depot
STORE_CORS=http://localhost:8000,https://tariqbookdepot.com
ADMIN_CORS=http://localhost:9000,https://admin.tariqbookdepot.com
AUTH_CORS=http://localhost:8000,http://localhost:9000
JWT_SECRET=<strong-random-secret>
COOKIE_SECRET=<strong-random-secret>
MEDUSA_ADMIN_ONBOARDING_TYPE=nextjs
```

`apps/storefront/.env.local`:

```env
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<pk_from_medusa_admin>
NEXT_PUBLIC_DEFAULT_REGION=pk
```

Never expose an Admin API secret key in Next.js client code. Every storefront `/store/*` request must include `x-publishable-api-key` linked to the active Tariq Book Depot Sales Channel.

## 2. Domain Data Model (Books + Stationery)

Medusa's built-in Product Module handles titles, handles, descriptions, images, categories, collections, options, and variants. Do not overload raw untyped JSON metadata for searchable bookstore specs; build two clean custom Medusa v2 modules and link them to `ProductModule` via `defineLink`.

### Module A: `bookCatalog` (`src/modules/book-catalog/`)

Create a `BookDetail` data model (`model.define("book_detail", ...)`) linked 1:1 with Medusa `Product`:

- `id`: primary key
- `isbn_13`: text, indexed, unique nullable (allows exact ISBN search)
- `isbn_10`: text, nullable
- `author`: text, indexed
- `publisher`: text
- `edition`: text (e.g., "1st Edition", "2026 Revised")
- `language`: enum (`en`, `ur`, `ar`, `bilingual`)
- `binding`: enum (`hardcover`, `paperback`, `board_book`, `box_set`)
- `page_count`: integer, nullable
- `publication_year`: integer, nullable
- `sample_pages_url`: text, nullable (feeds the frontend "Look Inside" preview modal)
- `model_3d_glb_url`: text, nullable (feeds opt-in 3D pedestal/preview modal)

Use Medusa Product Variants for formats of the same title (e.g., Option `Format`: `Hardcover` vs `Paperback`, each with its own SKU, inventory item, and PKR price).

### Module B: `stationerySpec` (`src/modules/stationery-spec/`)

Create a `StationeryDetail` data model (`model.define("stationery_detail", ...)`) linked 1:1 with Medusa `Product`:

- `id`: primary key
- `brand`: text, indexed (e.g., "Piano", "Dollar", "Muji", "Faber-Castell", "Lamy")
- `item_type`: enum (`notebook`, `pen`, `art_supply`, `desk_accessory`, `gift_bundle`)
- `paper_gsm`: integer, nullable (e.g., `80`, `100`, `120`, `160`)
- `ruling`: enum (`lined`, `dotted`, `grid`, `blank`, `none`)
- `nib_size_mm`: text, nullable (e.g., `0.38mm`, `0.5mm`, `0.7mm`, `Fine`, `Medium`)
- `pack_quantity`: integer, default `1`
- `swatch_hex`: text, nullable (primary color hex for storefront swatch dots)
- `model_3d_glb_url`: text, nullable

Use Medusa Product Variants for selectable stationery attributes (e.g., Options `Ink Color` / `Cover Color` / `Pack Size` with per-variant hex stored in `variant.metadata.swatch_hex` and tracked inventory per variant).

### Module Linking (`src/links/`)

```ts
// src/links/product-book-detail.ts
import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import BookCatalogModule from "../modules/book-catalog"

export default defineLink(
  ProductModule.linkable.product,
  BookCatalogModule.linkable.bookDetail
)
```

Create an identical link file `src/links/product-stationery-detail.ts` connecting `ProductModule.linkable.product` to `StationerySpecModule.linkable.stationeryDetail`. Query combined product + book/stationery data using Medusa's Remote Query (`query.graph(...)`).

## 3. Workflows and Custom API Routes

Follow Medusa v2's workflow-first architecture so all multi-module mutations remain transactional with compensation rollback steps.

### Custom Workflows (`src/workflows/`)

1. `create-book-product.ts`: Runs Medusa's `createProductsWorkflow` and creates + links the `book_detail` record in one atomic workflow (with compensation to delete `book_detail` if product creation fails).
2. `create-stationery-product.ts`: Atomically creates the Medusa product + variants + linked `stationery_detail`.
3. `sync-search-index.ts`: Triggered by Subscribers (`product.created`, `product.updated`, `product.deleted`) to keep predictive search synced.

### Store API Routes (`src/api/store/`)

All routes under `/store/*` automatically enforce the Publishable API Key middleware.

- `GET /store/catalog/search`: Predictive search endpoint accepting `?q=&type=book|stationery&language=&binding=&gsm=&nib=&min_price=&max_price=&region_id=&limit=`. Searches title, author, ISBN-13, stationery brand, and SKU via PostgreSQL full-text/trigram index (or Meilisearch plugin when catalog exceeds 5,000 SKUs). Always returns variant `calculated_price` scoped to `region_id`.
- `GET /store/catalog/featured-hero`: Returns the 3-4 hero products flagged with `metadata.hero_featured = true`, including their `model_3d_glb_url`, linked `book_detail` / `stationery_detail`, and calculated PKR price.
- `GET /store/products/[handle]/bundle-suggestions`: Returns 2-3 lightweight stationery add-ons (bookmarks, highlighters, notebooks) for the Cart Drawer cross-sell based on category rules.

### Admin Extensions (`src/admin/`)

Add clean Admin UI Widgets on the Product Detail page (`product.details.after`) so Tariq Book Depot staff can edit ISBN, Author, Publisher, Binding, Paper GSM, Nib Size, Swatch Hex, and 3D `.GLB` URL directly in the Medusa Admin Dashboard without touching code.

## 4. Regions, Shipping, Payments, and Inventory (Pakistan-Ready)

Configure these in the seed script (`src/scripts/seed-tariq-book-depot.ts`) so the store works immediately out of the box:

1. **Sales Channel**: `Tariq Book Depot Web Store` linked to the Publishable API Key.
2. **Region (`Pakistan`)**:
   - Currency: `PKR` (`pkr`)
   - Country code: `pk`
   - Tax configuration: tax-inclusive retail pricing by default (configurable per tax region)
   - Optional secondary Region (`International - USD`) if exporting Urdu/academic books abroad
3. **Stock Location & Fulfillment**:
   - Primary Stock Location: `Tariq Book Depot - Lahore Warehouse`
   - Fulfillment Provider: Manual Fulfillment (extensible to TCS, Leopards, or PostEx courier webhooks via a custom Fulfillment Module Provider)
   - Shipping Options:
     - `Lahore Same/Next-Day Courier` (flat PKR rate)
     - `Nationwide Standard Delivery` (flat PKR rate, free above configurable promotion threshold e.g. Rs. 3,000)
     - `Store Pickup - Lahore` (Rs. 0)
4. **Payment Providers**:
   - **Cash on Delivery (COD)**: Enabled via Medusa's default manual system provider (`pp_system_default`), labeled clearly as "Cash on Delivery" in the Next.js checkout.
   - **Online Cards / Wallets**: Configure `@medusajs/medusa/payment-stripe` (or a custom Medusa Payment Module Provider for PayFast / JazzCash / EasyPaisa / Safepay) with webhook signature verification before order capture.

## 5. Storefront-to-Medusa Integration Contract

Enforce these rules across every Next.js Server Action calling Medusa:

1. **Product Pricing**: Always pass `region_id` and `fields: "*variants.calculated_price,+variants.inventory_quantity,+book_detail.*,+stationery_spec.*"` when querying `/store/products`.
2. **Persistent Cart**: Create the cart once via `sdk.store.cart.create({ region_id })` and store `cart_id` in an `HttpOnly`, `SameSite=Lax` cookie via Next.js Server Actions (`cookies()`). Re-fetch cart from Medusa on every mutation rather than trusting stale client React state.
3. **Checkout Sequence (5 Strict Steps)**:
   - Step 1: Set customer email (`sdk.store.cart.update`)
   - Step 2: Set shipping and billing address (`sdk.store.cart.update`)
   - Step 3: Fetch eligible shipping options (`sdk.store.fulfillment.listCartOptions`) and attach selection (`sdk.store.cart.addShippingMethod`)
   - Step 4: Initialize payment collection and session (`sdk.store.payment.initiatePaymentSession`) for chosen provider (COD or Card)
   - Step 5: Complete cart (`sdk.store.cart.complete(cartId)`) and strictly check `if (response.type === "order")` before clearing the `cart_id` cookie and redirecting to `/orders/[id]/confirmed`. If `response.type === "cart"`, surface `response.error` inline without losing user input.
4. **Workflow Hook Safety**: Never mutate cart line items, shipping methods, or totals inside `completeCartWorkflow`'s `validate` hook. Run any pre-order adjustments in a separate workflow and refresh the payment collection beforehand so authorized amounts match order totals.

## 6. Verification Checklist

Run these checks before shipping backend changes:

```bash
# 1. Run migrations for core + custom book/stationery modules
npx medusa db:migrate

# 2. Seed Tariq Book Depot categories, PKR region, shipping, and sample books/stationery
npx medusa exec ./src/scripts/seed-tariq-book-depot.ts

# 3. Verify health and Store API publishable key wiring
curl -i http://localhost:9000/health
curl -H "x-publishable-api-key: $NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY" \
  "http://localhost:9000/store/regions"
```

Confirm:
- `GET /store/regions` returns the `PKR` region
- `GET /store/catalog/search?q=isbn` returns matched books with `book_detail` and `calculated_price`
- `POST /store/carts` -> add line item -> add shipping method -> initiate payment session -> `POST /store/carts/:id/complete` returns `{ type: "order", order: { ... } }` and decrements stock location inventory.
