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
import { DEPARTMENT_LIST } from "@/lib/departments";
import { packOf } from "@/lib/format";

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

export { formatPrice, packOf, priceOf } from "@/lib/format";

export function productsIn(categorySlug: string): readonly CatalogProduct[] {
  return catalog.filter((p) => p.category === categorySlug);
}

/** App path (without language) for a category: its first department with ?cat=, else All products. */
export function categoryPath(category: Category): string {
  if (category.slug === "books") return "/shop/books";
  const dept = category.departments[0];
  return dept ? `/shop/${dept}?cat=${category.slug}` : `/shop?cat=${category.slug}`;
}

/** Slim product shape sent to client components (search, cart). */
export interface ClientProduct {
  id: string;
  name: string;
  brand: string | null;
  pack: string | null;
  priceNote: string | null;
  price: number;
  offerPrice: number | null;
  unit: CatalogProduct["unit"];
  image: string;
  /** Lower-cased text the header search matches against. */
  haystack: string;
}

export function toClientProducts(): ClientProduct[] {
  return catalog.map((p) => {
    const cat = getCategory(p.category);
    const pack = packOf(p);
    const hay = [p.name, p.brand, pack, cat?.name.en, cat?.name.ur, ...p.description, ...(cat?.departments ?? []).map((d) => DEPARTMENT_LIST.find((x) => x.id === d)?.name.en)]
      .filter((x): x is string => Boolean(x))
      .join(" ")
      .toLowerCase();
    return { id: p.id, name: p.name, brand: p.brand, pack, priceNote: p.priceNote, price: p.price, offerPrice: p.offerPrice, unit: p.unit, image: p.images[0], haystack: hay };
  });
}
