import Link from "next/link";
import { Suspense } from "react";
import { href, type Lang } from "@/i18n/config";
import { pick, t } from "@/i18n/t";
import { getCategories, getCategory, getProducts, type CatalogProduct } from "@/lib/catalog";
import type { Department } from "@/lib/catalog-schema";
import { DEPARTMENT_LIST } from "@/lib/departments";
import { AllProductsLink, ShopBrowser, ShopBrowserFallback } from "./shop-browser";

function inDept(product: CatalogProduct, dept: Department | null): boolean {
  if (!dept) return true;
  return getCategory(product.category)?.departments.includes(dept) ?? false;
}

export function Crumbs({ lang, trail }: { lang: Lang; trail: ReadonlyArray<{ label: string; href?: string; isEnglish?: boolean }> }) {
  return (
    <nav className="crumbs" aria-label={t(lang, "breadcrumb")}>
      <Link href={href(lang, "/")}>{t(lang, "home")}</Link>
      {trail.map((c) => (
        <span key={c.label} style={{ display: "contents" }}>
          <span aria-hidden="true">/</span>
          {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page" lang={c.isEnglish ? "en" : undefined}>{c.label}</span>}
        </span>
      ))}
    </nav>
  );
}

interface ShopPageProps {
  lang: Lang;
  dept: Department | null;
}

/** All products or one department (the HTML's viewShop). */
export function ShopPage({ lang, dept }: ShopPageProps) {
  const all = getProducts();
  const base = all.filter((p) => inDept(p, dept));
  const deptInfo = dept ? DEPARTMENT_LIST.find((d) => d.id === dept) : undefined;
  const title = deptInfo ? pick(lang, deptInfo.name) : t(lang, "all");
  const tabs = [
    { id: "all", href: href(lang, "/shop"), label: t(lang, "all"), n: all.length },
    ...DEPARTMENT_LIST.map((d) => ({ id: d.id, href: href(lang, `/shop/${d.id}`), label: pick(lang, d.name), n: all.filter((p) => inDept(p, d.id)).length })),
  ];
  const current = dept ?? "all";

  const props = {
    lang,
    title,
    base,
    categories: getCategories(),
    tabs: (
      <nav className="tabs" aria-label={t(lang, "productsLabel")}>
        {tabs.map((x) => (
          <Link key={x.id} href={x.href} aria-current={x.id === current ? "page" : undefined}>
            {x.label}<span className="tabs__n">{x.n}</span>
          </Link>
        ))}
      </nav>
    ),
    empty: (
      <div className="empty">
        <h2 className="empty__t">{t(lang, "emptyDeptT")}</h2>
        <p className="empty__b">{t(lang, "emptyDeptB")}</p>
        <AllProductsLink lang={lang} isPrimary />
      </div>
    ),
  };

  return (
    <div className="wrap page">
      <Crumbs lang={lang} trail={[{ label: title }]} />
      <Suspense fallback={<ShopBrowserFallback {...props} />}>
        <ShopBrowser {...props} />
      </Suspense>
    </div>
  );
}
