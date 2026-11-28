# Open questions

Values that are unknown and must not be guessed. Each one stays `null` (or is left out of the copy) until the owner answers. Update this file when an answer arrives.

## Store settings (`apps/storefront/src/config/store.ts`)

All set by the owner on 2026-11-28; no `null` values remain. `src/config/store.test.ts` checks their format.

Hours are "24/7", shown the same in English and Urdu.

## Catalogue

| Item | Status |
|---|---|
| No books in `Products/` yet | The Books department shows an honest empty state |
| `scales/dux`: the owner confirmed the price is Rs 80; the photos show a 24-piece pack | Still unclear whether Rs 80 buys one scale or the 24-piece pack. Shown as "Rs 80" with no unit until answered (`overrides.json` → `unit: "piece"` or `"pack"`). |
| `brand: null` (no `* Brand:` line): blc-paper-rim, dux-12-inch-scale, oro-8-inch-scale, oro-tx-7-gel-pen, oro-inventor-pen, oro-coco-bear-geometry-box, oro-kelly-carlos, oro-la-bello-mirror-comb-geometry-box | Add `* Brand: …` to the `.txt` or `brand` in `overrides.json` |
| `priceNote: null` on 17 of 18 products (only "Oro 8-Inch Scale" says "per pcs") | Optional `unit` in `overrides.json` shows "per box/jar/…" |
| Pen colour lines (e.g. "Available clrs blck blue green") | Shown verbatim; customers can't choose a colour at checkout (they can add it in the delivery notes) |
| Title fallbacks: 7 products use the folder name (Geometry ×3, pens GR-7/GT-5/Inventor/R-6); 2 scales use the first sentence's subject (approved) | Add a title line to a `.txt` to change the wording |
| Categories `geometry` and `pens`: `name.ur` and `departments` | `ur = null` (the English name is shown on Urdu pages), `departments = []` (products appear only under All products) |
| `Erasers/oro veezo`: 2 of 3 photos are unrelated promo graphics ("Colorful Gift Game", "Make Mistakes History") | Remove them, or set `imageOrder` so the eraser photo is the cover |
| Spec and feature wording (e.g. "Ideal For: …" kept as a description paragraph) | Shown verbatim from the `.txt` files |

## Copy written during the build (please check)

The approved HTML had no strings for the WhatsApp hand-off, so these were added in `apps/storefront/src/i18n/dictionaries.ts`. The Urdu was written by the developer and should be checked by a native speaker:
- `waSendNote`, `waMissing`, `receiptWaNote`, `reopenWa`

## Resolved

- 2026-11-28: store settings set by the owner. Address "2VC2+3V8, Shahrah-e-Quaid-e-Azam Rd, Pattoki"; phone/WhatsApp +92 324 4962323; email info@tariqbookdepot.com; hours 24/7; delivery Rs 150 local, Rs 300 courier.
- 2026-11-28: orders ship from Pattoki (owner).
- 2026-11-28: Oro Inventor Pen comes in 4 colours: red, black, blue, green (owner); added to its `.txt`.
- 2026-11-28: Dux 12-inch scale price confirmed as Rs 80 (owner).

- 2026-11-28: "Since 1984" and "Pattoki" come from the shop logo (`references/tariq-book-depot.html`, extracted to `public/brand/logo.webp`), so the HTML copy is kept.
- 2026-11-28: the GT-5 photo was removed from the GR-7 folder (owner).
- 2026-11-28: the brand of GR-7, GT-5 and R-6 is Oro, although the boxes say O-WRITE (owner); set in `overrides.json`.
- 2026-11-28: the scale titles "Dux 12-Inch Scale" and "Oro 8-Inch Scale" are approved (owner).
