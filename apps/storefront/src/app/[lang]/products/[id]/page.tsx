import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { BuyBox } from "@/components/product/buy-box";
import { Gallery } from "@/components/product/gallery";
import { ProductRail } from "@/components/product/product-rail";
import { Crumbs } from "@/components/shop/shop-page";
import { href, isLang } from "@/i18n/config";
import { pick, t } from "@/i18n/t";
import { categoryPath, formatPrice, getCategory, getProduct, getProducts, packOf, priceOf, type CatalogProduct } from "@/lib/catalog";
import { UNIT_LABELS } from "@/lib/units";

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): Array<{ id: string }> {
  return getProducts().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = getProduct(id);
  return p ? { title: p.name, description: p.description[0] ?? p.title, openGraph: { images: [p.images[0]] } } : {};
}

/** Same category first, then products sharing a department (the HTML's related list). */
function relatedTo(p: CatalogProduct): CatalogProduct[] {
  const depts = getCategory(p.category)?.departments ?? [];
  const others = getProducts().filter((x) => x.id !== p.id);
  const sameDept = (x: CatalogProduct) => getCategory(x.category)?.departments.some((d) => depts.includes(d)) ?? false;
  return [...others.filter((x) => x.category === p.category), ...others.filter((x) => x.category !== p.category && sameDept(x))].slice(0, 4);
}

export default async function ProductPage({ params }: Props) {
  const { lang, id } = await params;
  const p = getProduct(id);
  if (!isLang(lang) || !p) notFound();
  const cat = getCategory(p.category);
  const pack = packOf(p);
  const hasOffer = p.offerPrice !== null;
  const catName = cat ? pick(lang, cat.name) : p.category;
  const catHref = cat ? href(lang, categoryPath(cat)) : href(lang, "/shop");

  return (
    <>
      <div className="wrap page">
        <Crumbs lang={lang} trail={[{ label: catName, href: catHref }, { label: p.name, isEnglish: true }]} />
        <div className="pdp">
          <Gallery lang={lang} name={p.name} images={p.images} />
          <div className="pdp__info">
            {p.brand && <p className="pdp__brand" lang="en">{p.brand}</p>}
            <h1 className="pdp__name" lang="en">{p.name}</h1>
            {pack && <p className="pdp__pack" lang="en">{pack}</p>}
            <p className="pdp__price">
              <span className="price" lang="en">
                {hasOffer && <s>{formatPrice(p.price)}</s>}
                {formatPrice(priceOf(p))}
              </span>
              {p.priceNote && <span className="pdp__unit" lang="en">{p.priceNote}</span>}
              {!p.priceNote && p.unit && <span className="pdp__unit">{pick(lang, UNIT_LABELS[p.unit])}</span>}
            </p>
            <BuyBox lang={lang} productId={p.id} productName={p.name} />
            <p className="pdp__cod"><Icon name="cash" />{t(lang, "codNote")}</p>
            {p.specs.length > 0 && (
              <>
                <h2 className="pdp__h">{t(lang, "details")}</h2>
                <dl className="specs ruled">
                  {p.specs.map((s) => (
                    <div key={s.label}><dt lang="en">{s.label}</dt><dd lang="en">{s.value}</dd></div>
                  ))}
                </dl>
              </>
            )}
            {p.description.length > 0 && (
              <>
                <h2 className="pdp__h">{t(lang, "description")}</h2>
                {p.description.map((d) => <p key={d} className="pdp__desc" lang="en">{d}</p>)}
              </>
            )}
            {p.features.length > 0 && (
              <>
                <h2 className="pdp__h">{t(lang, "features")}</h2>
                <ul className="feats ruled">
                  {p.features.map((f) => <li key={f}><span lang="en">{f}</span></li>)}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
      <ProductRail lang={lang} title={t(lang, "moreIn", { c: catName })} products={relatedTo(p)} viewAllHref={catHref} />
    </>
  );
}
