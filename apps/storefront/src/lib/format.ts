/** Client-safe helpers: no catalogue data imports, so client components can use them. */

/** "Rs 1,000": the HTML's rs(). */
export function formatPrice(rupees: number): string {
  return `Rs ${rupees.toLocaleString("en-PK")}`;
}

/** The price a customer pays: the offer price when set, otherwise the list price. */
export function priceOf(product: { price: number; offerPrice: number | null }): number {
  return product.offerPrice ?? product.price;
}

/** The part of the title after the name, e.g. "72 Pieces Jar"; null when the title is just the name. */
export function packOf(product: { title: string; name: string }): string | null {
  const rest = product.title.slice(product.name.length).replace(/^\s*[–|]\s*/, "").trim();
  return rest || null;
}
