"use client";

import { CartLineItem } from "@/components/cart/cart-line";
import type { PricedLine } from "@/components/cart/cart-provider";
import type { Lang } from "@/i18n/config";
import { t } from "@/i18n/t";
import { formatPrice } from "@/lib/format";

interface OrderSummaryProps {
  lang: Lang;
  lines: readonly PricedLine[];
  subtotal: number;
  deliveryPrice: number | null;
  total: number;
}

/** The HTML's summaryHTML(): read-only lines and totals. */
export function OrderSummary({ lang, lines, subtotal, deliveryPrice, total }: OrderSummaryProps) {
  return (
    <div className="summary">
      <h2 className="summary__t">{t(lang, "orderSummary")}</h2>
      <ul className="lines">
        {lines.map((l) => <CartLineItem key={l.id} lang={lang} line={l} isEditable={false} />)}
      </ul>
      <div className="row">
        <span>{t(lang, "subtotal")}</span>
        <span className="price" lang="en">{formatPrice(subtotal)}</span>
      </div>
      <div className="row">
        <span>{t(lang, "delivery")}</span>
        {deliveryPrice !== null ? <span className="price" lang="en">{formatPrice(deliveryPrice)}</span> : <span className="muted">{t(lang, "rateNotSet")}</span>}
      </div>
      <div className="row row--total">
        <span>{t(lang, "total")}</span>
        <span className="price" lang="en" data-testid="order-total">{formatPrice(total)}</span>
      </div>
    </div>
  );
}
