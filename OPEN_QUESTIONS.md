# Open questions

Values that are unknown and must not be guessed. Each one stays `null` (or is left out of the copy) until the owner answers. Update this file when an answer arrives.

## Store settings (`apps/storefront/src/config/store.ts`) — every `null` value

| Field | Status | Effect while unknown |
|---|---|---|
| `whatsapp` (orders) | null | Checkout button is disabled and says "Orders can't be sent yet: the shop's WhatsApp number hasn't been added." |
| `phone` | null | Contact page and footer show "Not added yet" |
| `address` | null | Contact page shows "Not added yet"; the footer shows the city |
| `hours` | null | Contact page shows "Not added yet" |
| `email` | null | Contact page shows "Not added yet" |
| `delivery[local].price` (within Pattoki) | null | Checkout shows "Rate not set yet"; totals exclude delivery; WhatsApp message says "rate to be confirmed by the shop" |
| `delivery[courier].price` (other cities) | null | Same as above |

Also open:
- Do orders ship from Pattoki (shop logo) or from a Lahore warehouse (earlier brief)? The site says Pattoki, because the logo does.

## Catalogue

| Item | Status |
|---|---|
| No books in `Products/` yet | The Books department shows an honest empty state |
| `scales/dux`: priced Rs 80, but the photos show a 24-piece pack | Is Rs 80 per scale or per pack? |
| `brand: null` (no `* Brand:` line): blc-paper-rim, dux-12-inch-scale, oro-8-inch-scale, oro-tx-7-gel-pen, oro-inventor-pen, oro-coco-bear-geometry-box, oro-kelly-carlos, oro-la-bello-mirror-comb-geometry-box | Add `* Brand: …` to the `.txt` or `brand` in `overrides.json` |
| `priceNote: null` on 17 of 18 products (only "Oro 8-Inch Scale" says "per pcs") | Optional `unit` in `overrides.json` shows "per box/jar/…" |
| Pen colour lines ("Available clrs blck blue green", "Available in four different clrs") | Shown verbatim; customers can't choose a colour. Which colours does Inventor come in? |
| Title fallbacks: 7 products use the folder name (Geometry ×3, pens GR-7/GT-5/Inventor/R-6); 2 scales use the first sentence's subject (approved) | Add a title line to a `.txt` to change the wording |
| Categories `geometry` and `pens`: `name.ur` and `departments` | `ur = null` (the English name is shown on Urdu pages), `departments = []` (products appear only under All products) |
| `Erasers/oro veezo`: 2 of 3 photos are unrelated promo graphics ("Colorful Gift Game", "Make Mistakes History") | Remove them, or set `imageOrder` so the eraser photo is the cover |
| Spec and feature wording (e.g. "Ideal For: …" kept as a description paragraph) | Shown verbatim from the `.txt` files |

## Copy written during the build (please check)

The approved HTML had no strings for the WhatsApp hand-off, so these were added in `apps/storefront/src/i18n/dictionaries.ts`. The Urdu was written by the developer and should be checked by a native speaker:
- `waSendNote`, `waMissing`, `receiptWaNote`, `reopenWa`

## Resolved

- 2026-11-28: "Since 1984" and "Pattoki" come from the shop logo (`references/tariq-book-depot.html`, extracted to `public/brand/logo.webp`), so the HTML copy is kept.
- 2026-11-28: the GT-5 photo was removed from the GR-7 folder (owner).
- 2026-11-28: the brand of GR-7, GT-5 and R-6 is Oro, although the boxes say O-WRITE (owner); set in `overrides.json`.
- 2026-11-28: the scale titles "Dux 12-Inch Scale" and "Oro 8-Inch Scale" are approved (owner).
