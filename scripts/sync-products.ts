/**
 * products:sync  — Products/ → apps/storefront/src/data/products.json + public/products/**
 * products:check — same computation, no writes; exits 1 if committed outputs differ.
 * Rules: CLAUDE.md, "Sync script rules".
 */
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, posix, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as z from "zod";
import {
  CategoriesSchema,
  formatIssues,
  OverridesSchema,
  ProductsSchema,
  type Category,
  type Overrides,
  type Product,
} from "../apps/storefront/src/lib/catalog-schema";
import { parseProductTxt, toKebab, toTitleCase } from "./lib/parse-product-txt";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTS_DIR = join(ROOT, "Products");
const DATA_DIR = join(ROOT, "apps/storefront/src/data");
const PUBLIC_DIR = join(ROOT, "apps/storefront/public/products");
const PRODUCTS_JSON = join(DATA_DIR, "products.json");
const CATEGORIES_JSON = join(DATA_DIR, "categories.json");
const OVERRIDES_JSON = join(DATA_DIR, "overrides.json");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

interface Skip { folder: string; reason: string }
interface Note { id: string; note: string }
interface Plan {
  products: Product[];
  categories: Category[];
  /** public-relative path (posix) → absolute source path */
  files: Map<string, string>;
  skipped: Skip[];
  notes: Note[];
  newCategories: string[];
  duplicatesSkipped: number;
  crossDuplicates: string[];
}

const rel = (abs: string): string => relative(ROOT, abs).split("\\").join("/");
const sha256 = (abs: string): string => createHash("sha256").update(readFileSync(abs)).digest("hex");
const byCodePoint = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);
const isHidden = (name: string): boolean => name.startsWith("_") || name.startsWith(".");
const json = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;

function readJson<S extends z.ZodType>(file: string, schema: S): z.infer<S> {
  const parsed = schema.safeParse(JSON.parse(readFileSync(file, "utf8")));
  if (!parsed.success) throw new Error(formatIssues(rel(file), parsed.error));
  return parsed.data;
}

function listDir(abs: string): { dirs: string[]; files: string[] } {
  const entries = readdirSync(abs).filter((n) => !isHidden(n)).sort(byCodePoint);
  return {
    dirs: entries.filter((n) => statSync(join(abs, n)).isDirectory()),
    files: entries.filter((n) => statSync(join(abs, n)).isFile()),
  };
}

function findCategory(categories: readonly Category[], folder: string): Category | undefined {
  const key = folder.toLowerCase();
  return categories.find((c) => c.slug === toKebab(folder) || c.aliases.some((a) => a.toLowerCase() === key));
}

interface ProductFolder { abs: string; name: string; category: string }

function discover(categories: Category[], plan: Plan): ProductFolder[] {
  const found: ProductFolder[] = [];
  for (const top of listDir(PRODUCTS_DIR).dirs) {
    const abs = join(PRODUCTS_DIR, top);
    const { dirs, files } = listDir(abs);
    if (files.length) {
      const cat = categories.find((c) => c.aliases.some((a) => a.toLowerCase() === top.toLowerCase()));
      if (!cat) plan.skipped.push({ folder: rel(abs), reason: "flat product folder with no alias in categories.json" });
      else found.push({ abs, name: top, category: cat.slug });
      if (dirs.length) plan.skipped.push({ folder: rel(abs), reason: "has both files and subfolders; subfolders ignored" });
      continue;
    }
    let cat = findCategory(categories, top);
    if (!cat) {
      cat = { slug: toKebab(top), name: { en: toTitleCase(top), ur: null }, departments: [], order: Math.max(0, ...categories.map((c) => c.order)) + 1, aliases: [] };
      categories.push(cat);
      plan.newCategories.push(`${cat.slug} ("${cat.name.en}", from folder "${top}")`);
    }
    for (const d of dirs) found.push({ abs: join(abs, d), name: d, category: cat.slug });
  }
  return found;
}

function orderImages(names: string[], order: string[] | undefined, id: string, plan: Plan): string[] {
  if (!order) return names;
  const missing = order.filter((n) => !names.includes(n));
  missing.forEach((n) => plan.notes.push({ id, note: `overrides.imageOrder lists "${n}", which is not in the folder` }));
  const listed = order.filter((n) => names.includes(n));
  return [...listed, ...names.filter((n) => !listed.includes(n))];
}

function buildProduct(folder: ProductFolder, overrides: Overrides, plan: Plan, seen: Map<string, string>): Product | null {
  const { files } = listDir(folder.abs);
  const txts = files.filter((f) => extname(f).toLowerCase() === ".txt");
  const images = files.filter((f) => IMAGE_EXT.has(extname(f).toLowerCase()));
  const skip = (reason: string): null => (plan.skipped.push({ folder: rel(folder.abs), reason }), null);
  if (txts.length !== 1) return skip(`expected exactly one .txt, found ${txts.length}`);
  if (!images.length) return skip("no images (.jpg .jpeg .png .webp)");
  files.filter((f) => !txts.includes(f) && !images.includes(f)).forEach((f) => plan.notes.push({ id: rel(folder.abs), note: `ignored file "${f}"` }));

  const source = join(folder.abs, txts[0]);
  const parsed = parseProductTxt(readFileSync(source, "utf8"), folder.name);
  if (!parsed.ok) return skip(parsed.reason);
  const p = parsed.value;
  const id = toKebab(p.name);
  if (!id) return skip(`name "${p.name}" gives an empty id`);
  const brandOverride = overrides[id]?.brand;
  p.notes
    .map((note) => (brandOverride && note.startsWith("no Brand:") ? `no Brand: bullet; brand "${brandOverride}" set in overrides.json` : note))
    .forEach((note) => plan.notes.push({ id, note }));

  const paths: string[] = [];
  const hashes = new Set<string>();
  for (const name of orderImages(images, overrides[id]?.imageOrder, id, plan)) {
    const abs = join(folder.abs, name);
    const hash = sha256(abs);
    if (hashes.has(hash)) { plan.duplicatesSkipped += 1; continue; }
    hashes.add(hash);
    const other = seen.get(hash);
    if (other && other !== id) plan.crossDuplicates.push(`${id} "${name}" is identical to a photo in ${other}`);
    else seen.set(hash, id);
    const out = posix.join(folder.category, id, `${String(paths.length + 1).padStart(2, "0")}${extname(name).toLowerCase()}`);
    plan.files.set(out, abs);
    paths.push(`/products/${out}`);
  }

  return {
    id, title: p.title, name: p.name, brand: p.brand, category: folder.category, price: p.price, priceNote: p.priceNote,
    description: p.description, specs: p.specs, features: p.features, images: paths, source: rel(source),
  };
}

function makePlan(): Plan {
  const categories = readJson(CATEGORIES_JSON, CategoriesSchema);
  const overrides = readJson(OVERRIDES_JSON, OverridesSchema);
  const plan: Plan = { products: [], categories, files: new Map(), skipped: [], notes: [], newCategories: [], duplicatesSkipped: 0, crossDuplicates: [] };
  const seen = new Map<string, string>();
  for (const folder of discover(categories, plan)) {
    const product = buildProduct(folder, overrides, plan, seen);
    if (!product) continue;
    const clash = plan.products.find((x) => x.id === product.id);
    if (clash) plan.skipped.push({ folder: product.source, reason: `id "${product.id}" already used by ${clash.source}` });
    else plan.products.push(product);
  }
  plan.products.sort((a, b) => byCodePoint(a.id, b.id));
  Object.keys(overrides).filter((id) => !plan.products.some((x) => x.id === id))
    .forEach((id) => plan.notes.push({ id, note: "overrides.json entry has no matching product" }));

  const valid = ProductsSchema.safeParse(plan.products);
  if (!valid.success) throw new Error(formatIssues("products.json (generated)", valid.error));
  return plan;
}

function listPublic(abs = PUBLIC_DIR, prefix = ""): string[] {
  if (!existsSync(abs)) return [];
  return readdirSync(abs).flatMap((n) => {
    const child = join(abs, n);
    const key = prefix ? `${prefix}/${n}` : n;
    return statSync(child).isDirectory() ? listPublic(child, key) : [key];
  });
}

function removeEmptyDirs(abs: string): void {
  if (!existsSync(abs) || !statSync(abs).isDirectory()) return;
  readdirSync(abs).forEach((n) => removeEmptyDirs(join(abs, n)));
  if (abs !== PUBLIC_DIR && readdirSync(abs).length === 0) rmSync(abs, { recursive: true });
}

interface Diff { stale: string[]; changed: string[]; missing: string[]; jsonChanged: string[] }

function diff(plan: Plan): Diff {
  const existing = listPublic();
  const out: Diff = { stale: existing.filter((f) => !plan.files.has(f)), changed: [], missing: [], jsonChanged: [] };
  plan.files.forEach((src, key) => {
    const dest = join(PUBLIC_DIR, key);
    if (!existsSync(dest)) out.missing.push(key);
    else if (sha256(dest) !== sha256(src)) out.changed.push(key);
  });
  const want: Array<[string, string]> = [[PRODUCTS_JSON, json(plan.products)], [CATEGORIES_JSON, json(plan.categories)]];
  want.forEach(([file, content]) => {
    const current = existsSync(file) ? readFileSync(file, "utf8").replace(/\r\n/g, "\n") : null;
    const comparable = file === CATEGORIES_JSON && current !== null ? json(JSON.parse(current)) : current;
    if (comparable !== content) out.jsonChanged.push(rel(file));
  });
  return out;
}

function apply(plan: Plan, d: Diff): void {
  d.stale.forEach((f) => rmSync(join(PUBLIC_DIR, f)));
  [...d.missing, ...d.changed].forEach((key) => {
    const dest = join(PUBLIC_DIR, key);
    const src = plan.files.get(key);
    if (!src) throw new Error(`internal: no source for ${key}`);
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(src, dest);
  });
  removeEmptyDirs(PUBLIC_DIR);
  if (d.jsonChanged.includes(rel(PRODUCTS_JSON))) writeFileSync(PRODUCTS_JSON, json(plan.products));
  if (d.jsonChanged.includes(rel(CATEGORIES_JSON))) writeFileSync(CATEGORIES_JSON, json(plan.categories));
}

function section(title: string, lines: string[]): string {
  return `\n${title} (${lines.length})\n${lines.length ? lines.map((l) => `  - ${l}`).join("\n") : "  (none)"}`;
}

function report(plan: Plan, d: Diff, check: boolean): string {
  const written = d.missing.length + d.changed.length;
  return [
    `products:${check ? "check" : "sync"} — ${plan.products.length} products, ${plan.files.size} images`,
    section("Products", plan.products.map((p) => `${p.id} · Rs ${p.price}${p.priceNote ? ` ${p.priceNote}` : ""} · ${p.images.length} images · ${p.category}`)),
    `\nImages ${check ? "out of date" : "written"}: ${written} · stale ${check ? "found" : "removed"}: ${d.stale.length} · duplicates skipped: ${plan.duplicatesSkipped}`,
    section("Duplicate photos across products", plan.crossDuplicates),
    section("Skipped folders", plan.skipped.map((s) => `${s.folder}: ${s.reason}`)),
    section("Fallbacks and notes", plan.notes.map((n) => `${n.id}: ${n.note}`)),
    section("New categories (ur = null, departments = [])", plan.newCategories),
    section(check ? "Out-of-date JSON" : "JSON written", d.jsonChanged),
  ].join("\n");
}

/**
 * Linux-style check: every image path in products.json is lowercase and exists with exactly that case.
 * Walks directory listings because existsSync is case-insensitive on Windows and macOS.
 */
function caseSensitiveImageProblems(products: readonly Product[]): string[] {
  const publicRoot = dirname(PUBLIC_DIR);
  return products.flatMap((p) =>
    p.images.flatMap((img) => {
      if (img !== img.toLowerCase()) return [`${p.id}: not lowercase: ${img}`];
      let dir = publicRoot;
      for (const segment of img.split("/").filter(Boolean)) {
        if (!existsSync(dir) || !readdirSync(dir).includes(segment)) return [`${p.id}: missing (exact case): ${img}`];
        dir = join(dir, segment);
      }
      return [];
    }),
  );
}

function main(): void {
  const check = process.argv.includes("--check");
  const plan = makePlan();
  const d = diff(plan);
  if (!check) apply(plan, d);
  process.stdout.write(`${report(plan, d, check)}\n`);
  const caseProblems = caseSensitiveImageProblems(plan.products);
  const imageCount = plan.products.reduce((n, p) => n + p.images.length, 0);
  process.stdout.write(`${section(`Case-sensitive image check (${imageCount} paths)`, caseProblems)}\n`);
  const dirty = d.stale.length + d.missing.length + d.changed.length + d.jsonChanged.length + caseProblems.length;
  if (check && dirty) {
    process.stderr.write(`\nproducts:check FAILED — ${dirty} output(s) differ from Products/. Run npm run products:sync and commit.\n`);
    process.exit(1);
  }
  if (check) process.stdout.write("\nproducts:check OK — committed outputs match Products/.\n");
}

try {
  main();
} catch (error: unknown) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
