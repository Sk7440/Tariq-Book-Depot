"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { STORE } from "@/config/store";
import { href, type Lang } from "@/i18n/config";
import { t } from "@/i18n/t";
import { tNode } from "@/i18n/t-node";
import { formatPrice } from "@/lib/format";
import type { Order } from "@/lib/order";
import { createWhatsAppSink, orderWhatsAppNumber } from "@/lib/order-sink";
import { loadLastOrder } from "@/lib/order-storage";

type State = { status: "loading" } | { status: "missing" } | { status: "ready"; order: Order };

/** Order confirmation as a shop bill-book page (the HTML's viewOrder). Reads the last order from sessionStorage. */
export function OrderReceipt({ lang }: { lang: Lang }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const sink = useMemo(() => createWhatsAppSink(orderWhatsAppNumber()), []);

  useEffect(() => {
    const order = loadLastOrder();
    setState(order ? { status: "ready", order } : { status: "missing" });
  }, []);

  if (state.status === "loading") return <div className="receipt" aria-busy="true" />;
  if (state.status === "missing") {
    return (
      <div className="empty">
        <h1 className="page__title">{t(lang, "orderMissingT")}</h1>
        <p className="empty__b">{t(lang, "orderMissingB")}</p>
        <Link className="btn" href={href(lang, "/shop")}>{t(lang, "continue")}</Link>
      </div>
    );
  }

  const o = state.order;
  const date = new Date(o.date).toLocaleDateString(lang === "ur" ? "ur-PK" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
  const deliveryLabel = t(lang, o.delivery === "local" ? "ship_local" : "ship_courier");
  const waUrl = sink.urlFor(o);

  return (
    <>
      <article className="receipt" aria-labelledby="rc-t">
        <header className="receipt__head">
          <Image src="/brand/logo.webp" alt="" width={64} height={64} />
          <div>
            <p className="receipt__shop">{lang === "ur" ? STORE.nameUr : STORE.name}</p>
            <p className="muted">{t(lang, "brandSub")}</p>
          </div>
          <p className="receipt__ref">{t(lang, "orderRef")}<strong lang="en" data-testid="order-ref">{o.ref}</strong>{date}</p>
        </header>
        <h1 className="receipt__title" id="rc-t">{t(lang, "orderPlaced")}</h1>
        <p className="receipt__lead">{tNode(lang, "thanks", { name: o.customer.name, total: <span className="price" lang="en">{formatPrice(o.total)}</span> })}</p>
        <table className="bill">
          <thead>
            <tr>
              <th scope="col">{t(lang, "item")}</th>
              <th scope="col" className="num">{t(lang, "qty")}</th>
              <th scope="col" className="num">{t(lang, "rate")}</th>
              <th scope="col" className="num">{t(lang, "amount")}</th>
            </tr>
          </thead>
          <tbody>
            {o.lines.map((l) => (
              <tr key={l.id}>
                <td><span lang="en">{l.name}</span></td>
                <td className="num">{l.qty}</td>
                <td className="num"><span lang="en">{formatPrice(l.rate)}</span></td>
                <td className="num"><span lang="en">{formatPrice(l.rate * l.qty)}</span></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan={3}>{t(lang, "subtotal")}</td><td className="num"><span lang="en">{formatPrice(o.subtotal)}</span></td></tr>
            <tr><td colSpan={3}>{t(lang, "delivery")}</td><td className="num">{o.deliveryPrice !== null ? <span lang="en">{formatPrice(o.deliveryPrice)}</span> : t(lang, "rateNotSet")}</td></tr>
            <tr><td colSpan={3}>{t(lang, "total")}, {t(lang, "cod")}</td><td className="num"><span lang="en">{formatPrice(o.total)}</span></td></tr>
          </tfoot>
        </table>
        <dl className="receipt__meta">
          <div>
            <dt>{t(lang, "deliverTo")}</dt>
            <dd>{o.customer.name}, <span lang="en" dir="ltr">{o.customer.phone}</span><br />{o.customer.address}, {o.customer.city}</dd>
          </div>
          <div>
            <dt>{t(lang, "method")}</dt><dd>{deliveryLabel}</dd>
            <dt>{t(lang, "payment")}</dt><dd>{t(lang, "cod")}</dd>
          </div>
        </dl>
        <p className="receipt__note">{t(lang, "receiptWaNote")}</p>
      </article>
      <div className="receipt__actions">
        {waUrl && <a className="btn btn--line" href={waUrl} target="_blank" rel="noopener noreferrer">{t(lang, "reopenWa")}</a>}
        <button className="btn btn--line" type="button" onClick={() => window.print()}>{t(lang, "print")}</button>
        <Link className="btn" href={href(lang, "/shop")}>{t(lang, "continue")}</Link>
      </div>
    </>
  );
}
