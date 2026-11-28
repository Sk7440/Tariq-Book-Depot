# Open questions

Values that are unknown and must not be guessed. Each one stays `null` (or is left out of the copy) until the owner answers. Update this file when an answer arrives.

## Store settings (`apps/storefront/src/config/store.ts`, added in Phase 3)

| Item | Status | Effect while unknown |
|---|---|---|
| WhatsApp number for orders | null | Checkout button is disabled and says why; orders can't be sent |
| Phone number | null | Contact page shows "Not added yet" |
| Shop address | null | Contact page shows "Not added yet" |
| Opening hours | null | Contact page shows "Not added yet" |
| Email | null | Contact page shows "Not added yet" |
| Delivery rates (local Pattoki, courier to other cities) | null | Delivery cost is shown as unknown; totals exclude delivery |
| Store location: Pattoki (logo, HTML) or a Lahore warehouse (earlier brief)? | unconfirmed | HTML copy says Pattoki |
| "Since 1984" (hero, brand line, About) | unconfirmed | Removed from copy until confirmed |

## Catalogue

| Item | Status |
|---|---|
| No books in `Products/` yet | The Books department shows an honest empty state |
| `scales/dux`: priced Rs 80, but the photos show a 24-piece pack | Is Rs 80 per scale or per pack? |
| `pens/Oro GR-7 Gel Pen`: its cover photo (`WhatsApp Image 2026-11-27 at 6.38.33 PM.jpeg`) is byte-identical to one in GT-5, and the box is printed "GT-5" | Should it be removed from the GR-7 folder? |
| Pen packaging (GR-7, GT-5, R-6) shows the brand "O-WRITE"; the folder names say "Oro" | Which brand is correct? |
| Brand missing (no `* Brand:` line): blc-paper-rim, dux-12-inch-scale, oro-8-inch-scale, oro-tx-7-gel-pen, oro-gr-7-gel-pen, oro-gt-5-gel-pen, oro-inventor-pen, oro-r-6-gel-pen, oro-coco-bear-geometry-box, oro-kelly-carlos, oro-la-bello-mirror-comb-geometry-box | `brand` is `null` |
| Pen colour lines ("Available clrs blck blue green", "Available in four different clrs") | Shown verbatim; customers can't choose a colour. Which colours does Inventor come in? |
| Title fallbacks: 7 products use the folder name, 2 use the first sentence's subject | Add a title line to each `.txt` to control the wording |
| Categories `geometry` and `pens`: Urdu name and department | `ur = null`, `departments = []`; these products appear only under All products |
| Price units (per box / jar / ream) | Not shown unless set via `overrides.json` → `unit` |
