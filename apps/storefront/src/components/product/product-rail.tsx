import Link from "next/link";
import type { Lang } from "@/i18n/config";
import { t } from "@/i18n/t";
import type { CatalogProduct } from "@/lib/catalog";
import { ProductCard } from "./product-card";

interface ProductRailProps {
  lang: Lang;
  title: string;
  products: readonly CatalogProduct[];
  viewAllHref?: string;
}

/** The HTML's rail(): a titled product grid; renders nothing when empty. */
export function ProductRail({ lang, title, products, viewAllHref }: ProductRailProps) {
  if (!products.length) return null;
  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec__head">
          <h2 className="sec__title">{title}</h2>
          {viewAllHref && <Link className="textlink" href={viewAllHref}>{t(lang, "viewAll")}</Link>}
        </div>
        <div className="grid">
          {products.map((p) => <ProductCard key={p.id} lang={lang} product={p} />)}
        </div>
      </div>
    </section>
  );
}
