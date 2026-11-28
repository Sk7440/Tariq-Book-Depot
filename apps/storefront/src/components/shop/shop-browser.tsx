"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { ProductCard } from "@/components/product/product-card";
import { href, type Lang } from "@/i18n/config";
import { pick, t } from "@/i18n/t";
import type { CatalogProduct } from "@/lib/catalog";
import type { Category } from "@/lib/catalog-schema";
import { applyFilters, DEFAULT_FILTERS, filtersFrom, filtersToQuery, type Filters, type Sort } from "@/lib/shop-filter";

export interface ShopBrowserProps {
  lang: Lang;
  title: string;
  base: readonly CatalogProduct[];
  categories: readonly Category[];
  /** Department tabs (server-rendered), shown under the heading. */
  tabs?: ReactNode;
  /** Shown instead of the toolbar and grid when `base` is empty. */
  empty: ReactNode;
}

const SORT_LABELS: ReadonlyArray<[Sort, "sortShop" | "sortLow" | "sortHigh" | "sortName"]> = [
  ["shop", "sortShop"], ["low", "sortLow"], ["high", "sortHigh"], ["name", "sortName"],
];

function productsLabel(lang: Lang, n: number): string {
  return n === 1 ? t(lang, "products1") : t(lang, "productsN", { n });
}

interface ViewProps extends ShopBrowserProps {
  filters: Filters;
  onChange: (next: Filters) => void;
}

/** Pure view; rendered with default filters during static generation. */
export function ShopBrowserView({ lang, title, base, categories, tabs, empty, filters, onChange }: ViewProps) {
  const visible = applyFilters(base, filters);
  const catIds = [...new Set(base.map((p) => p.category))];
  const cats = categories.filter((c) => catIds.includes(c.slug));
  const brands = [...new Set(base.map((p) => p.brand).filter((b): b is string => b !== null))].sort();
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <>
      <div className="shop__head">
        <h1 className="page__title">{title}</h1>
        <p className="shop__count">{productsLabel(lang, base.length ? visible.length : 0)}</p>
      </div>
      {tabs}
      {!base.length ? empty : (
        <>
          <div className="toolbar">
            {cats.length > 1 ? (
              <div className="chips" role="group" aria-label={t(lang, "category")}>
                <button className="chip" type="button" aria-pressed={!filters.cat} onClick={() => set({ cat: "" })}>
                  {t(lang, "allCats")}<span className="chip__n">{base.length}</span>
                </button>
                {cats.map((c) => (
                  <button key={c.slug} className="chip" type="button" aria-pressed={filters.cat === c.slug} onClick={() => set({ cat: c.slug })}>
                    {pick(lang, c.name)}<span className="chip__n">{base.filter((p) => p.category === c.slug).length}</span>
                  </button>
                ))}
              </div>
            ) : <div />}
            <div className="selects">
              {brands.length > 1 && (
                <label className="select">
                  {t(lang, "brand")}
                  <select value={filters.brand} onChange={(e) => set({ brand: e.target.value })}>
                    <option value="">{t(lang, "allBrands")}</option>
                    {brands.map((b) => <option key={b} value={b} lang="en">{b}</option>)}
                  </select>
                </label>
              )}
              <label className="select">
                {t(lang, "sort")}
                <select value={filters.sort} onChange={(e) => set({ sort: e.target.value as Sort })}>
                  {SORT_LABELS.map(([v, k]) => <option key={v} value={v}>{t(lang, k)}</option>)}
                </select>
              </label>
            </div>
          </div>
          <div className="grid" data-grid>
            {visible.map((p) => <ProductCard key={p.id} lang={lang} product={p} />)}
          </div>
          {visible.length === 0 && (
            <div className="note-empty">
              {t(lang, "noMatch")}{" "}
              <button className="linkbtn" type="button" onClick={() => onChange(DEFAULT_FILTERS)}>{t(lang, "clearFilters")}</button>
            </div>
          )}
        </>
      )}
    </>
  );
}

/** Reads cat/brand/sort from the URL and keeps them in sync (replaceState keeps the static page). */
export function ShopBrowser(props: ShopBrowserProps) {
  const params = useSearchParams();
  const filters = filtersFrom(params);
  const handleChange = (next: Filters) => {
    const qs = filtersToQuery(params.toString(), next);
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  };
  return <ShopBrowserView {...props} filters={filters} onChange={handleChange} />;
}

/** Suspense fallback: the same view with default filters (rendered in the static HTML). */
export function ShopBrowserFallback(props: ShopBrowserProps) {
  return <ShopBrowserView {...props} filters={DEFAULT_FILTERS} onChange={() => undefined} />;
}

export function AllProductsLink({ lang, isPrimary = false }: { lang: Lang; isPrimary?: boolean }) {
  return <Link className={isPrimary ? "btn" : "btn btn--line"} href={href(lang, "/shop")}>{t(lang, "all")}</Link>;
}
