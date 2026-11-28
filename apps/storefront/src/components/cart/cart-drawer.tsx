"use client";

import Link from "next/link";
import { useRef } from "react";
import { Icon } from "@/components/icons";
import { useModalSheet } from "@/hooks/use-modal-sheet";
import { href, type Lang } from "@/i18n/config";
import { t } from "@/i18n/t";
import { formatPrice } from "@/lib/format";
import { CartLineItem, EmptyCart } from "./cart-line";
import { useCart } from "./cart-provider";

/** Slide-in cart (the HTML's #cart sheet). */
export function CartDrawer({ lang }: { lang: Lang }) {
  const { lines, subtotal, isDrawerOpen, closeDrawer } = useCart();
  const ref = useRef<HTMLElement>(null);
  useModalSheet(isDrawerOpen, closeDrawer, ref);
  const hasLines = lines.length > 0;

  return (
    <>
      <div className="scrim" hidden={!isDrawerOpen} onClick={closeDrawer} />
      <aside ref={ref} className="sheet sheet--end" id="cart" role="dialog" aria-modal="true" aria-labelledby="cart-title" hidden={!isDrawerOpen}>
        <div className="sheet__head">
          <h2 className="sheet__title" id="cart-title">{t(lang, "yourCart")}</h2>
          <button className="iconbtn" type="button" data-sheet-close aria-label={t(lang, "closeCart")} onClick={closeDrawer}>
            <Icon name="close" />
          </button>
        </div>
        <div className="drawer__body">
          {hasLines ? (
            <ul className="lines">
              {lines.map((l) => <CartLineItem key={l.id} lang={lang} line={l} onNavigate={closeDrawer} />)}
            </ul>
          ) : (
            <EmptyCart lang={lang} onNavigate={closeDrawer} />
          )}
        </div>
        {hasLines && (
          <div className="drawer__foot">
            <div className="row">
              <span>{t(lang, "subtotal")}</span>
              <span className="price" lang="en">{formatPrice(subtotal)}</span>
            </div>
            <p className="drawer__note">{t(lang, "delivery")}: {t(lang, "deliveryLater")}. {t(lang, "cod")}.</p>
            <Link className="btn btn--block btn--lg" href={href(lang, "/checkout")} onClick={closeDrawer}>{t(lang, "checkout")}</Link>
            <Link className="btn btn--line btn--block" href={href(lang, "/cart")} onClick={closeDrawer}>{t(lang, "viewCart")}</Link>
          </div>
        )}
      </aside>
    </>
  );
}
