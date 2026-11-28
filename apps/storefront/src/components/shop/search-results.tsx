"use client";

import { useSearchParams } from "next/navigation";
import type { Lang } from "@/i18n/config";
import { t } from "@/i18n/t";
import type { CatalogProduct } from "@/lib/catalog";
import type { Category } from "@/lib/catalog-schema";
import { DEFAULT_FILTERS, filtersFrom, filtersToQuery, matchesQuery, type Filters } from "@/lib/shop-filter";
import { AllProductsLink, ShopBrowserView } from "./shop-browser";

interface SearchResultsProps {
  lang: Lang;
  products: readonly CatalogProduct[];
  haystacks: Readonly<Record<string, string>>;
  categories: readonly Category[];
}

function SearchView({ lang, products, haystacks, categories, q, filters, onChange }: SearchResultsProps & { q: string; filters: Filters; onChange: (f: Filters) => void }) {
  const base = q ? products.filter((p) => matchesQuery(haystacks[p.id] ?? "", q)) : [];
  return (
    <ShopBrowserView
      lang={lang}
      title={t(lang, "searchT", { q })}
      base={base}
      categories={categories}
      filters={filters}
      onChange={onChange}
      empty={
        <>
          <p className="note-empty">{t(lang, "searchNone", { q })}</p>
          <AllProductsLink lang={lang} />
        </>
      }
    />
  );
}

export function SearchResults(props: SearchResultsProps) {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const handleChange = (next: Filters) => {
    const qs = filtersToQuery(params.toString(), next);
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  };
  return <SearchView {...props} q={q} filters={filtersFrom(params)} onChange={handleChange} />;
}

export function SearchResultsFallback(props: SearchResultsProps) {
  return <SearchView {...props} q="" filters={DEFAULT_FILTERS} onChange={() => undefined} />;
}
