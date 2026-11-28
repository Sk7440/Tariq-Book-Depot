"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { announce } from "@/components/chrome/live-region";
import type { Lang } from "@/i18n/config";
import { t } from "@/i18n/t";
import { QtyStepper } from "./qty-stepper";

const DONE_MS = 1600;

interface BuyBoxProps {
  lang: Lang;
  productId: string;
  productName: string;
}

export function BuyBox({ lang, productId, productName }: BuyBoxProps) {
  const { add, count } = useCart();
  const [qty, setQty] = useState(1);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isDone) return;
    const timer = window.setTimeout(() => setIsDone(false), DONE_MS);
    return () => window.clearTimeout(timer);
  }, [isDone]);

  const handleAdd = () => {
    add(productId, qty);
    setIsDone(true);
    announce(t(lang, "addedLive", { name: productName, n: count + qty }));
  };

  return (
    <div className="buy">
      <QtyStepper lang={lang} value={qty} onChange={setQty} />
      <button className={isDone ? "btn is-done" : "btn"} type="button" onClick={handleAdd}>
        {isDone ? t(lang, "added") : t(lang, "add")}
      </button>
    </div>
  );
}
