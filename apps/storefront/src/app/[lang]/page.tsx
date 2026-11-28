import { notFound } from "next/navigation";
import { AboutBand } from "@/components/home/about-band";
import { BooksShelf } from "@/components/home/books-shelf";
import { CategoryTiles } from "@/components/home/category-tiles";
import { Hero } from "@/components/home/hero";
import { ProductRail } from "@/components/product/product-rail";
import { href, isLang } from "@/i18n/config";
import { t } from "@/i18n/t";
import { getProducts } from "@/lib/catalog";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const products = getProducts();
  const books = products.filter((p) => p.category === "books");

  return (
    <>
      <Hero lang={lang} />
      <CategoryTiles lang={lang} />
      {books.length ? (
        <ProductRail lang={lang} title={t(lang, "featuredBooks")} products={books.slice(0, 4)} viewAllHref={href(lang, "/shop/books")} />
      ) : (
        <BooksShelf lang={lang} />
      )}
      <ProductRail lang={lang} title={t(lang, "stationeryRail")} products={products.filter((p) => p.homeSection === "stationery")} viewAllHref={href(lang, "/shop/stationery")} />
      <ProductRail lang={lang} title={t(lang, "newArrivals")} products={products.filter((p) => p.homeSection === "new")} viewAllHref={href(lang, "/shop")} />
      <ProductRail lang={lang} title={t(lang, "bestSellers")} products={products.filter((p) => p.bestSeller)} viewAllHref={href(lang, "/shop")} />
      <ProductRail lang={lang} title={t(lang, "offers")} products={products.filter((p) => p.offerPrice !== null)} viewAllHref={href(lang, "/shop")} />
      <AboutBand lang={lang} />
    </>
  );
}
