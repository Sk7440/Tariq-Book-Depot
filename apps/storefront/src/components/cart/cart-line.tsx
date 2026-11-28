"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { announce } from "@/components/chrome/live-region";
import { href, type Lang } from "@/i18n/config";
import { pick, t } from "@/i18n/t";
import { tNode } from "@/i18n/t-node";
import { formatPrice } from "@/lib/format";
import { UNIT_LABELS } from "@/lib/units";
import { MAX_QTY, useCart, type PricedLine } from "./cart-provider";

interface CartLineProps {
  lang: Lang;
  line: PricedLine;
  /** Quantity controls and Remove (cart, drawer); off in the checkout summary. */
  isEditable?: boolean;
  onNavigate?: () => void;
}

/** The HTML's lineHTML(). */
export function CartLineItem({ lang, line, isEditable = true, onNavigate }: CartLineProps) {
  const { setQty, remove } = useCart();
  const { product: p, qty } = line;
  const productHref = href(lang, `/products/${p.id}`);
  const rate = <span lang="en">{formatPrice(line.rate)}</span>;
  const each = p.unit ? <>{rate} {pick(lang, UNIT_LABELS[p.unit])}</> : tNode(lang, "each", { p: rate });

  const change = (next: number) => {
    setQty(p.id, next);
    announce(t(lang, "qtyLive", { name: p.name, q: next }));
  };
  const handleRemove = () => {
    remove(p.id);
    announce(t(lang, "removedLive", { name: p.name }));
  };

  return (
    <li className="line" data-line={p.id}>
      <Link href={productHref} tabIndex={-1} aria-hidden="true" onClick={onNavigate}>
        <Image className="line__img is-cut" src={p.image} alt="" width={76} height={76} />
      </Link>
      <div>
        <Link className="line__name" href={productHref} lang="en" onClick={onNavigate}>{p.name}</Link>
        <p className="line__meta">
          {p.pack && <span lang="en">{p.pack}</span>}
          {isEditable ? (
            <>
              {p.pack && <br />}
              {each}
            </>
          ) : (
            <> <span aria-hidden="true">×</span> {qty}</>
          )}
        </p>
        {isEditable && (
          <div className="line__row">
            <div className="qty qty--sm">
              <button type="button" aria-label={`${t(lang, "dec")}: ${p.name}`} disabled={qty <= 1} onClick={() => change(qty - 1)}>
                <Icon name="minus" />
              </button>
              <output aria-live="off">{qty}</output>
              <button type="button" aria-label={`${t(lang, "inc")}: ${p.name}`} disabled={qty >= MAX_QTY} onClick={() => change(qty + 1)}>
                <Icon name="plus" />
              </button>
            </div>
            <button className="linkbtn" type="button" onClick={handleRemove}>
              {t(lang, "remove")}<span className="sr-only">: {p.name}</span>
            </button>
          </div>
        )}
      </div>
      <span className="price line__total" lang="en">{formatPrice(line.total)}</span>
    </li>
  );
}

interface EmptyCartProps {
  lang: Lang;
  onNavigate?: () => void;
}

export function EmptyCart({ lang, onNavigate }: EmptyCartProps) {
  return (
    <div className="empty">
      <h2 className="empty__t">{t(lang, "cartEmptyT")}</h2>
      <p className="empty__b">{t(lang, "cartEmptyB")}</p>
      <Link className="btn" href={href(lang, "/shop")} onClick={onNavigate}>{t(lang, "continue")}</Link>
    </div>
  );
}
