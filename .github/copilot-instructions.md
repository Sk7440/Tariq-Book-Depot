# Tariq Book Depot Copilot Instructions

- Medusa.js v2 is the only source of commerce truth. Next.js never calculates authoritative prices, discounts, tax, shipping, inventory totals, or order totals.
- Use React Server Components for live catalog reads and Server Actions for cart and checkout mutations. Persist `cart_id` in an HttpOnly, `SameSite=Lax` cookie.
- Checkout and cart UI must remain 2D. Clear the cart cookie only after Medusa returns `response.type === "order"`.
- Use the archival ink-and-paper palette: `#FAF8F5`, `#1C1C1E`, `#1F3A2E`, `#B85D3B`, `#2B3E63`.
- Use logical CSS properties for alignment and spacing. Support English LTR and Urdu RTL with `Noto Nastaliq Urdu`.
- Do not use fake metrics, testimonials, stock claims, placeholder commerce success states, neon gradients, repetitive uppercase eyebrows, glassmorphism soup, or emoji UI icons.
- Restrict Three.js to a dynamic-imported homepage hero or explicit product inspection modal. Use ACES Filmic tone mapping and reduced-motion/static fallbacks.
- Wrap GSAP motion in `useGSAP` and `gsap.matchMedia()`. Do not use smooth-scroll wrappers on cart or checkout surfaces.
