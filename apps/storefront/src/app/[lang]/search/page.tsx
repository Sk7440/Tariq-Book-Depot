import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SearchResults, SearchResultsFallback } from "@/components/shop/search-results";
import { Crumbs } from "@/components/shop/shop-page";
import { isLang } from "@/i18n/config";
import { t } from "@/i18n/t";
import { getCategories, getProducts, toClientProducts } from "@/lib/catalog";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? { title: t(lang, "searchGo"), robots: { index: false } } : {};
}

export default async function SearchPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const props = {
    lang,
    products: getProducts(),
    haystacks: Object.fromEntries(toClientProducts().map((p) => [p.id, p.haystack])),
    categories: getCategories(),
  };
  return (
    <div className="wrap page">
      <Crumbs lang={lang} trail={[{ label: t(lang, "searchGo") }]} />
      <Suspense fallback={<SearchResultsFallback {...props} />}>
        <SearchResults {...props} />
      </Suspense>
    </div>
  );
}
