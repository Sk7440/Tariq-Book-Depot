/** Shop filtering and sorting (the HTML's applyFilters sorters). Pure; used on server and client. */

export const SORTS = ["shop", "low", "high", "name"] as const;
export type Sort = (typeof SORTS)[number];

export interface Filters {
  cat: string;
  brand: string;
  sort: Sort;
}

export const DEFAULT_FILTERS: Filters = { cat: "", brand: "", sort: "shop" };

interface Filterable {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  price: number;
  offerPrice: number | null;
}

function isSort(value: string): value is Sort {
  return (SORTS as readonly string[]).includes(value);
}

/** Reads filters from URL params, ignoring unknown values. */
export function filtersFrom(params: { get: (key: string) => string | null }): Filters {
  const sort = params.get("sort") ?? "shop";
  return { cat: params.get("cat") ?? "", brand: params.get("brand") ?? "", sort: isSort(sort) ? sort : "shop" };
}

/** Writes filters into a query string, dropping defaults; keeps other params (e.g. q). */
export function filtersToQuery(current: string, filters: Filters): string {
  const params = new URLSearchParams(current);
  (["cat", "brand", "sort"] as const).forEach((key) => {
    const value = filters[key];
    if (value && !(key === "sort" && value === "shop")) params.set(key, value);
    else params.delete(key);
  });
  return params.toString();
}

const effectivePrice = (p: Filterable): number => p.offerPrice ?? p.price;

export function applyFilters<T extends Filterable>(base: readonly T[], filters: Filters): T[] {
  const order = new Map(base.map((p, i) => [p.id, i]));
  const byOrder = (a: T, b: T): number => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0);
  const sorters: Record<Sort, (a: T, b: T) => number> = {
    shop: byOrder,
    low: (a, b) => effectivePrice(a) - effectivePrice(b) || byOrder(a, b),
    high: (a, b) => effectivePrice(b) - effectivePrice(a) || byOrder(a, b),
    name: (a, b) => a.name.localeCompare(b.name, "en"),
  };
  return base
    .filter((p) => (!filters.cat || p.category === filters.cat) && (!filters.brand || p.brand === filters.brand))
    .sort(sorters[filters.sort]);
}

/** The HTML's searchProducts(): every term must appear; a trailing "s" may be dropped. */
export function matchesQuery(haystack: string, query: string): boolean {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return false;
  return terms.every((term) => haystack.includes(term) || (term.endsWith("s") && haystack.includes(term.slice(0, -1))));
}
