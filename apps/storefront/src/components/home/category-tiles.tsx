import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Icon } from "@/components/icons";
import { href, type Lang } from "@/i18n/config";
import { pick, t } from "@/i18n/t";
import { categoryPath, getCategories, productsIn } from "@/lib/catalog";
import { countLabel } from "./hero";

const MAX_COLS = 6;

export function CategoryTiles({ lang }: { lang: Lang }) {
  const cats = getCategories();
  // The HTML lays out 6 categories in one row; with more, use balanced rows.
  const cols = cats.length <= MAX_COLS ? cats.length : Math.min(MAX_COLS, Math.ceil(cats.length / 2));
  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec__head">
          <h2 className="sec__title">{t(lang, "byCategory")}</h2>
          <Link className="textlink" href={href(lang, "/shop")}>{t(lang, "all")}</Link>
        </div>
        <div className="cats" style={{ "--cats-cols": cols } as CSSProperties}>
          {cats.map((c) => {
            const items = productsIn(c.slug);
            const cover = items[0]?.images[0];
            return (
              <Link key={c.slug} className="cat" href={href(lang, categoryPath(c))}>
                <div className="cat__media">
                  {cover ? <Image className="is-cut" src={cover} alt="" fill sizes="(max-width: 960px) 33vw, 190px" /> : <Icon name="book" />}
                </div>
                <span className="cat__name">{pick(lang, c.name)}</span>
                <span className="cat__count">{items.length ? countLabel(lang, items.length) : t(lang, "notOnline")}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
