import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { href, type Lang } from "@/i18n/config";
import { pick, t } from "@/i18n/t";
import { tNode } from "@/i18n/t-node";
import { categoryPath, formatPrice, getCategories, priceOf, productsIn } from "@/lib/catalog";
import { HeroMotion } from "./hero-motion";

function countLabel(lang: Lang, n: number): string {
  return n === 1 ? t(lang, "items1") : t(lang, "itemsN", { n });
}

/** The shop's rate list on a ruled copy page (HTML viewHome hero). */
export function Hero({ lang }: { lang: Lang }) {
  const rows = getCategories().map((c) => {
    const items = productsIn(c.slug);
    const min = items.length ? Math.min(...items.map(priceOf)) : null;
    const cover = items[0]?.images[0] ?? null;
    return { c, count: items.length, min, cover };
  });

  return (
    <HeroMotion lang={lang}>
      <div className="hero__rules" aria-hidden="true" />
      <div className="wrap hero__inner">
        <div className="hero__margin" aria-hidden="true" />
        <div className="hero__copy">
          <h1 className="hero__title" id="hero-title">{t(lang, "heroTitle")}</h1>
          <p className="hero__sub">{t(lang, "heroSub")}</p>
          <div className="hero__ctas">
            <Link className="btn" href={href(lang, "/shop")}>{t(lang, "shopAll")}</Link>
            <Link className="btn btn--line" href={href(lang, "/shop/stationery")}>{t(lang, "browseStationery")}</Link>
          </div>
        </div>
        <div className="rate">
          <h2 className="rate__title">{t(lang, "rateList")}</h2>
          {rows.map(({ c, count, min, cover }) => (
            <Link key={c.slug} className={count ? "rate__row" : "rate__row is-off"} href={href(lang, categoryPath(c))}>
              {cover ? (
                <Image className="rate__thumb is-cut" src={cover} alt="" width={40} height={40} />
              ) : (
                <span className="rate__thumb"><Icon name="book" /></span>
              )}
              <span className="rate__name">{pick(lang, c.name)}</span>
              <span className="rate__count">{count ? countLabel(lang, count) : ""}</span>
              <span className="rate__price">
                {min !== null ? tNode(lang, "from", { p: <span lang="en">{formatPrice(min)}</span> }) : t(lang, "notOnline")}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </HeroMotion>
  );
}

export { countLabel };
