import categoriesJson from "@/data/categories.json";
import overridesJson from "@/data/overrides.json";
import productsJson from "@/data/products.json";
import {
  CategoriesSchema,
  formatIssues,
  OverridesSchema,
  ProductsSchema,
  type Category,
  type HomeSection,
  type Product,
  type Unit,
} from "@/lib/catalog-schema";
import type * as z from "zod";

/** A product merged with its owner overrides. Prices always come from here. */
export interface CatalogProduct extends Product {
  sort: number;
  homeSection: HomeSection | null;
  bestSeller: boolean;
  offerPrice: number | null;
  unit: Unit | null;
}

function load<S extends z.ZodType>(file: string, schema: S, data: unknown): z.infer<S> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw new Error(`Invalid catalogue data\n${formatIssues(file, parsed.error)}`);
  return parsed.data;
}

const products = load("src/data/products.json", ProductsSchema, productsJson);
const categories = load("src/data/categories.json", CategoriesSchema, categoriesJson);
const overrides = load("src/data/overrides.json", OverridesSchema, overridesJson);

const unknownCategories = products.filter((p) => !categories.some((c) => c.slug === p.category));
if (unknownCategories.length) {
  const list = unknownCategories.map((p) => `${p.id} → "${p.category}"`).join(", ");
  throw new Error(`Invalid catalogue data\nproducts.json: category not in categories.json: ${list}`);
}

const catalog: readonly CatalogProduct[] = products
  .filter((p) => overrides[p.id]?.active !== false)
  .map((p) => {
    const o = overrides[p.id] ?? {};
    return {
      ...p,
      brand: o.brand ?? p.brand,
      sort: o.sort ?? 0,
      homeSection: o.homeSection ?? null,
      bestSeller: o.bestSeller ?? false,
      offerPrice: o.offerPrice ?? null,
      unit: o.unit ?? null,
    };
  })
  .sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name, "en"));

/** Active products, in owner sort order then by name. */
export function getProducts(): readonly CatalogProduct[] {
  return catalog;
}

export function getProduct(id: string): CatalogProduct | undefined {
  return catalog.find((p) => p.id === id);
}

export function getCategories(): readonly Category[] {
  return [...categories].sort((a, b) => a.order - b.order);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/** The price a customer pays: the offer price when set, otherwise the list price. */
export function priceOf(product: Pick<CatalogProduct, "price" | "offerPrice">): number {
  return product.offerPrice ?? product.price;
}

export function formatPrice(rupees: number): string {
  return `Rs ${rupees.toLocaleString("en-PK")}`;
}
