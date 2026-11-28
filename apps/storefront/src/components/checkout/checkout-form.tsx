"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { Icon } from "@/components/icons";
import { STORE } from "@/config/store";
import { href, type Lang } from "@/i18n/config";
import { t } from "@/i18n/t";
import { formatPrice } from "@/lib/format";
import {
  makeOrderRef,
  orderTotals,
  REQUIRED_FIELDS,
  validateCustomer,
  validateField,
  type Customer,
  type DeliveryId,
  type FieldError,
  type FieldName,
  type Order,
} from "@/lib/order";
import { createWhatsAppSink, orderWhatsAppNumber } from "@/lib/order-sink";
import { saveLastOrder } from "@/lib/order-storage";
import { CheckoutField } from "./checkout-field";
import { OrderSummary } from "./order-summary";

const EMPTY_CUSTOMER: Customer = { name: "", phone: "", address: "", city: "", notes: "" };

function isRequired(field: keyof Customer): field is FieldName {
  return (REQUIRED_FIELDS as readonly string[]).includes(field);
}

/** Cash on Delivery checkout with WhatsApp hand-off (the HTML's viewCheckout + placeOrder). */
export function CheckoutForm({ lang }: { lang: Lang }) {
  const router = useRouter();
  const { lines, isReady, clear } = useCart();
  const [customer, setCustomer] = useState<Customer>(EMPTY_CUSTOMER);
  const [errors, setErrors] = useState<Partial<Record<FieldName, FieldError>>>({});
  const [hasFormError, setHasFormError] = useState(false);
  const [delivery, setDelivery] = useState<DeliveryId>("local");
  const formRef = useRef<HTMLFormElement>(null);
  const sink = useMemo(() => createWhatsAppSink(orderWhatsAppNumber()), []);

  const orderLines = lines.map((l) => ({ id: l.id, name: l.product.name, pack: l.product.pack, qty: l.qty, rate: l.rate }));
  const deliveryPrice = STORE.delivery.find((d) => d.id === delivery)?.price ?? null;
  const { subtotal, total } = orderTotals(orderLines, deliveryPrice);

  if (!isReady) return <div className="co" aria-busy="true" />;
  if (!lines.length) {
    return (
      <div className="empty">
        <h2 className="empty__t">{t(lang, "coEmptyT")}</h2>
        <p className="empty__b">{t(lang, "cartEmptyB")}</p>
        <Link className="btn" href={href(lang, "/shop")}>{t(lang, "continue")}</Link>
      </div>
    );
  }

  const update = (field: keyof Customer, value: string) => {
    setCustomer((c) => ({ ...c, [field]: value }));
    if (isRequired(field) && errors[field]) setErrors((e) => ({ ...e, [field]: validateField(field, value) ?? undefined }));
  };
  const check = (field: FieldName) => {
    if (customer[field]) setErrors((e) => ({ ...e, [field]: validateField(field, customer[field]) ?? undefined }));
  };
  const errorText = (field: FieldName): string | null => (errors[field] ? t(lang, errors[field]) : null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateCustomer(customer);
    setErrors(found);
    const firstBad = REQUIRED_FIELDS.find((f) => found[f]);
    setHasFormError(Boolean(firstBad));
    if (firstBad) {
      formRef.current?.querySelector<HTMLInputElement>(`#f-${firstBad}`)?.focus();
      return;
    }
    if (!sink.isAvailable) return;
    const now = new Date();
    const random = crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
    const order: Order = {
      ref: makeOrderRef(now, random),
      date: now.toISOString(),
      delivery,
      deliveryPrice,
      subtotal,
      total,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        city: customer.city.trim(),
        notes: customer.notes.trim(),
      },
      lines: orderLines,
    };
    saveLastOrder(order);
    sink.send(order);
    clear();
    router.push(href(lang, "/order"));
  };

  const summary = <OrderSummary lang={lang} lines={lines} subtotal={subtotal} deliveryPrice={deliveryPrice} total={total} />;

  return (
    <div className="co">
      <form ref={formRef} className="co__form" noValidate onSubmit={handleSubmit}>
        <details className="co__mobile">
          <summary><span>{t(lang, "showSummary")}</span><span className="price" lang="en">{formatPrice(total)}</span></summary>
          {summary}
        </details>
        <p className="co__err" role="alert" hidden={!hasFormError}>{t(lang, "eForm")}</p>

        <fieldset className="step">
          <legend><span className="step__n">1</span>{t(lang, "coContact")}</legend>
          <div className="fields">
            <CheckoutField id="name" label={t(lang, "fName")} value={customer.name} onChange={(v) => update("name", v)} onBlur={() => check("name")} error={errorText("name")} inputProps={{ type: "text", autoComplete: "name", required: true, autoCapitalize: "words" }} />
            <CheckoutField id="phone" label={t(lang, "fPhone")} value={customer.phone} onChange={(v) => update("phone", v)} onBlur={() => check("phone")} error={errorText("phone")} hint={t(lang, "fPhoneHint")} inputProps={{ type: "tel", autoComplete: "tel", required: true, inputMode: "tel", dir: "ltr" }} />
          </div>
        </fieldset>

        <fieldset className="step">
          <legend><span className="step__n">2</span>{t(lang, "coAddress")}</legend>
          <div className="fields">
            <CheckoutField id="address" label={t(lang, "fAddress")} value={customer.address} onChange={(v) => update("address", v)} onBlur={() => check("address")} error={errorText("address")} isWide inputProps={{ type: "text", autoComplete: "street-address", required: true }} />
            <CheckoutField id="city" label={t(lang, "fCity")} value={customer.city} onChange={(v) => update("city", v)} onBlur={() => check("city")} error={errorText("city")} inputProps={{ type: "text", autoComplete: "address-level2", required: true }} />
            <div />
            <CheckoutField id="notes" label={t(lang, "fNotes")} value={customer.notes} onChange={(v) => update("notes", v)} isTextarea isWide />
          </div>
        </fieldset>

        <fieldset className="step">
          <legend><span className="step__n">3</span>{t(lang, "coMethod")}</legend>
          <div>
            {STORE.delivery.map((d) => (
              <label key={d.id} className="opt">
                <input type="radio" name="ship" value={d.id} checked={delivery === d.id} onChange={() => setDelivery(d.id)} />
                <span>
                  <span className="opt__t">{t(lang, d.id === "local" ? "ship_local" : "ship_courier")}</span>
                  <span className="opt__b">{t(lang, d.id === "local" ? "ship_localB" : "ship_courierB")}</span>
                </span>
                <span className="opt__p">{d.price !== null ? <span className="price" lang="en">{formatPrice(d.price)}</span> : t(lang, "rateNotSet")}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="step">
          <legend><span className="step__n">4</span>{t(lang, "coPayment")}</legend>
          <label className="opt">
            <input type="radio" name="pay" value="cod" checked readOnly />
            <span><span className="opt__t">{t(lang, "cod")}</span><span className="opt__b">{t(lang, "codB")}</span></span>
            <span className="opt__p"><Icon name="cash" /></span>
          </label>
        </fieldset>

        <p className="field__hint" id="wa-note">{sink.isAvailable ? t(lang, "waSendNote") : t(lang, "waMissing")}</p>
        <button className="btn btn--block btn--lg" type="submit" disabled={!sink.isAvailable} aria-describedby="wa-note" data-testid="place-order">
          {t(lang, "placeOrder")}, <span lang="en">{formatPrice(total)}</span>
        </button>
      </form>
      <aside className="co__side" aria-label={t(lang, "orderSummary")}>{summary}</aside>
    </div>
  );
}
