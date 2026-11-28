"use client";

import { AnimatePresence } from "motion/react";
import Link from "next/link";
import { href, type Lang } from "@/i18n/config";
import { t } from "@/i18n/t";
import { formatPrice } from "@/lib/format";
import { CartLineItem, EmptyCart } from "./cart-line";
import { useCart } from "./cart-provider";

/** The HTML's viewCart(). */
export function CartPageView({ lang }: { lang: Lang }) {
  const { lines, subtotal, isReady } = useCart();
  if (!isReady) return <div className="cartpage" aria-busy="true" />;
  if (!lines.length) return <EmptyCart lang={lang} />;
  return (
    <div className="cartpage">
      <ul className="lines">
        <AnimatePresence initial={false}>
          {lines.map((l) => <CartLineItem key={l.id} lang={lang} line={l} />)}
        </AnimatePresence>
      </ul>
      <aside className="summary" aria-labelledby="sum-t">
        <h2 className="summary__t" id="sum-t">{t(lang, "orderSummary")}</h2>
        <div className="row">
          <span>{t(lang, "subtotal")}</span>
          <span className="price" lang="en">{formatPrice(subtotal)}</span>
        </div>
        <div className="row">
          <span>{t(lang, "delivery")}</span>
          <span className="muted">{t(lang, "deliveryLater")}</span>
        </div>
        <Link className="btn btn--block btn--lg" href={href(lang, "/checkout")}>{t(lang, "checkout")}</Link>
        <Link className="textlink" href={href(lang, "/shop")} style={{ justifySelf: "center" }}>{t(lang, "continue")}</Link>
      </aside>
    </div>
  );
}
